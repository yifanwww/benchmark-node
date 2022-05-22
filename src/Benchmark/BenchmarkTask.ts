import { Settings, Statistics } from '../Data';
import { ArgumentStoreView, ParameterStoreView } from '../ParameterizationStore';
import { RuntimeInfo } from '../RuntimeInfo';
import { CodeGen, Tester } from '../Tools/CodeGen';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { Formatter } from '../Tools/Formatter';
import { TestFn } from '../types';
import { Optional } from '../types.internal';

export class BenchmarkTask {
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _name: string;
    private declare readonly _fullName: string;

    private declare readonly _testFn: TestFn;
    private declare readonly _testFnParamNames: readonly string[];
    private declare readonly _testFnArgStore: ArgumentStoreView;
    private declare readonly _tester: Tester;

    private declare readonly _settings: Settings;

    private declare readonly _paramStoreView: Optional<ParameterStoreView>;

    private declare readonly _setup: Optional<() => void>;
    private declare readonly _cleanup: Optional<() => void>;

    private declare readonly _stats: Statistics[];

    get name(): string {
        return this._name;
    }

    get desc(): string {
        const arr: string[] = [this._name];
        const paramStr = this.params && this._paramStoreView!.strs.join(', ');
        if (paramStr) {
            arr.push(`[${paramStr}]`);
        }
        return arr.join(' ');
    }

    get testFn() {
        return this._testFn;
    }

    get testFnArgStore() {
        return this._testFnArgStore;
    }

    get tester() {
        return this._tester;
    }

    get settings() {
        return this._settings;
    }

    get setup() {
        return this._setup;
    }

    get cleanup() {
        return this._cleanup;
    }

    get stats() {
        return this._stats;
    }

    get params() {
        return this._paramStoreView?.params ?? null;
    }

    constructor(
        name: string,
        testFn: TestFn,
        testFnInfo: readonly string[],
        testFnArgStore: ArgumentStoreView,
        settings: Settings,
        paramStoreView: Optional<ParameterStoreView>,
        setup: Optional<() => void>,
        cleanup: Optional<() => void>,
    ) {
        this._id = ++BenchmarkTask.id;

        this._name = name;

        this._testFn = testFn;
        this._testFnParamNames = testFnInfo;
        this._testFnArgStore = testFnArgStore;

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "test/perfs/DynamicFnCall.ts".
        this._tester = CodeGen.createTester({
            argument: { count: this._testFnArgStore.maxArgsLength },
        });

        this._settings = settings;

        this._paramStoreView = paramStoreView;

        this._setup = setup;
        this._cleanup = cleanup;

        this._stats = [];
    }

    logConfigs(): void {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = this._settings;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo('Benchmark Environment Information:');
        logger.writeLineInfo(`  Node.js ${RuntimeInfo.node} (V8 ${RuntimeInfo.v8})`);
        logger.writeLineInfo('Benchmark Configuration:');
        logger.writeLineInfo(`  delay               : ${Formatter.beautifyNumber(delay)} ns`);
        logger.writeLineInfo(`  initial ops         : ${Formatter.beautifyNumber(initOps)}`);
        logger.writeLineInfo(`  measurement count   : ${Formatter.beautifyNumber(measurementCount)}`);
        logger.writeLineInfo(`  min measurement time: ${Formatter.beautifyNumber(minMeasurementTime)} ns`);
        logger.writeLineInfo(`  warmup count        : ${Formatter.beautifyNumber(warmupCount)}`);
        logger.writeLineInfo(`  ${this._setup ? 'Has' : 'No'} iteration setup`);
        logger.writeLineInfo(`  ${this._cleanup ? 'Has' : 'No'} iteration cleanup`);
    }
}
