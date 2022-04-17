import { ArgumentStoreView, Settings, Statistics } from '../Data';
import { GlobalSetupView } from '../Function';
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

    private declare readonly _globalSetup: Optional<GlobalSetupView>;
    private declare readonly _globalCleanup: Optional<() => void>;

    private declare readonly _iterationSetup: Optional<() => void>;
    private declare readonly _iterationCleanup: Optional<() => void>;

    private declare readonly _stats: Statistics[];

    public get name(): string {
        return this._name;
    }

    public get testFn() {
        return this._testFn;
    }

    public get testFnArgStore() {
        return this._testFnArgStore;
    }

    public get tester() {
        return this._tester;
    }

    public get settings() {
        return this._settings;
    }

    public get globalSetup() {
        return this._globalSetup;
    }

    public get globalCleanup() {
        return this._globalCleanup;
    }

    public get iterationSetup() {
        return this._iterationSetup;
    }

    public get iterationCleanup() {
        return this._iterationCleanup;
    }

    public get stats() {
        return this._stats;
    }

    public constructor(
        name: string,
        testFn: TestFn,
        testFnInfo: readonly string[],
        testFnArgStore: ArgumentStoreView,
        settings: Settings,
        globalSetup: Optional<GlobalSetupView>,
        // globalSetupParams: ParamValuePairs,
        globalCleanup: Optional<() => void>,
        iterationSetup: Optional<() => void>,
        iterationCleanup: Optional<() => void>,
    ) {
        this._id = ++BenchmarkTask.id;

        this._name = name;

        this._testFn = testFn;
        this._testFnParamNames = testFnInfo;
        this._testFnArgStore = testFnArgStore;

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "src/test/perf-DynamicFnCall.ts".
        this._tester = CodeGen.createTester({
            argument: { count: this._testFnArgStore.maxArgsLength },
        });

        this._settings = settings;

        this._globalSetup = globalSetup;
        this._globalCleanup = globalCleanup;

        this._iterationSetup = iterationSetup;
        this._iterationCleanup = iterationCleanup;

        this._stats = [];
    }

    public logConfigs(): void {
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
        logger.writeLineInfo(`  ${this._iterationSetup ? 'Has' : 'No'} iteration setup`);
        logger.writeLineInfo(`  ${this._iterationCleanup ? 'Has' : 'No'} iteration cleanup`);
    }
}
