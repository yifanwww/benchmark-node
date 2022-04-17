import { Settings, Statistics, TestFunction } from './Data';
import { GlobalCleanup, GlobalSetup } from './Function';
import { RuntimeInfo } from './RuntimeInfo';
import { CodeGen, Tester } from './Tools/CodeGen';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { Formatter } from './Tools/Formatter';
import { TestFn } from './types';

export class BenchmarkTask {
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _name: string;
    private declare readonly _fullName: string;

    private declare readonly _testFn: TestFn;
    private declare readonly _testFunction: TestFunction<TestFn>;
    private declare readonly _tester: Tester;

    private declare readonly _settings: Settings;

    private declare readonly _globalSetup?: GlobalSetup;
    private declare readonly _globalCleanup?: GlobalCleanup;

    private declare readonly _setup?: () => void;
    private declare readonly _cleanup?: () => void;

    private declare readonly _stats: Statistics[];

    public get name(): string {
        return this._name;
    }

    public get testFn() {
        return this._testFn;
    }

    public get testFunction() {
        return this._testFunction;
    }

    public get tester() {
        return this._tester;
    }

    public get settings() {
        return this._settings;
    }

    public get setup() {
        return this._setup;
    }

    public get cleanup() {
        return this._cleanup;
    }

    public get stats() {
        return this._stats;
    }

    /**
     * @param name The name used to identify this test.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(
        name: string,
        testFn: TestFn,
        testFunction: TestFunction<TestFn>,
        settings: Settings,
        setup?: () => void,
        cleanup?: () => void,
    ) {
        this._id = ++BenchmarkTask.id;

        this._name = name;

        this._testFn = testFn;
        this._testFunction = testFunction;

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "src/test/perf-DynamicFnCall.ts".
        this._tester = CodeGen.createTester({
            argument: { count: this._testFunction.maxArgsLength },
        });

        this._settings = settings;

        this._setup = setup;
        this._cleanup = cleanup;

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
        logger.writeLineInfo(`  ${this._testFunction.setup ? 'Has' : 'No'} iteration setup`);
        logger.writeLineInfo(`  ${this._testFunction.cleanup ? 'Has' : 'No'} iteration cleanup`);
    }
}
