import { Settings, Statistics, TestFunction } from './Data';
import { RuntimeInfo } from './RuntimeInfo';
import { CodeGen, Tester } from './Tools/CodeGen';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { Formatter } from './Tools/Formatter';
import { BenchmarkOptions, TestFn } from './types';

interface ConstructorArgs<T extends TestFn> {
    name?: string;
    options: BenchmarkOptions<T>;
    testFn: T;
}

export class Benchmark<T extends TestFn> {
    private static id = 0;
    private readonly _id = ++Benchmark.id;

    private _name?: string;
    private _testFunction: TestFunction<T>;
    private _tester: Tester;

    private _settings: Settings;

    private _setup?: () => void;
    private _cleanup?: () => void;

    private _stats: Statistics[] = [];

    public get name(): string {
        return this._name ?? this._testFunction.fn.name;
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
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(testFn: T, options?: BenchmarkOptions<T>);
    /**
     * @param name The name used to identify this test.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(name: string, testFn: T, options?: BenchmarkOptions<T>);

    public constructor(...args: [T, BenchmarkOptions<T>?] | [string, T, BenchmarkOptions<T>?]) {
        const { name, options, testFn } = this.parseArgs(args);

        this._name = name;
        this._testFunction = new TestFunction(testFn, options);

        this._settings = new Settings(options);

        this._setup = options.setup;
        this._cleanup = options.cleanup;

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "src/test/perf-DynamicFnCall.ts".
        this._tester = CodeGen.createTester({
            argument: { count: this._testFunction.maxArgsLength },
        });
    }

    private parseArgs(args: [T, BenchmarkOptions<T>?] | [string, T, BenchmarkOptions<T>?]): ConstructorArgs<T> {
        if (typeof args[0] === 'string') {
            const _args = args as [string, T, BenchmarkOptions<T>?];
            return {
                name: _args[0],
                testFn: _args[1],
                options: _args[2] ?? {},
            };
        } else {
            const _args = args as [T, BenchmarkOptions<T>?];
            return {
                testFn: _args[0],
                options: _args[1] ?? {},
            };
        }
    }

    public logConfigs() {
        const { delay, initOps, measurementCount, minMeasurementTime } = this._settings;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo('Benchmark Environment Information:');
        logger.writeLineInfo(`  Node.js ${RuntimeInfo.node} (V8 ${RuntimeInfo.v8})`);
        logger.writeLineInfo('Benchmark Configuration:');
        logger.writeLineInfo(`  delay               : ${Formatter.beautifyNumber(delay)} ns`);
        logger.writeLineInfo(`  initial ops         : ${Formatter.beautifyNumber(initOps)}`);
        logger.writeLineInfo(`  measurement count   : ${Formatter.beautifyNumber(measurementCount)}`);
        logger.writeLineInfo(`  min measurement time: ${Formatter.beautifyNumber(minMeasurementTime)} ns`);
        logger.writeLineInfo(`  ${this._testFunction.setup ? 'Has' : 'No'} iteration setup`);
        logger.writeLineInfo(`  ${this._testFunction.cleanup ? 'Has' : 'No'} iteration cleanup`);
    }

    /**
     * Validates this benchmark.
     * @returns Returns `false` if problems in this benchmark, otherwise `true`.
     */
    public validate(): boolean {
        const logger = ConsoleLogger.default;

        let pass = true;

        if (this._name === '') {
            logger.writeLineError(`[No.${this._id} Benchmark] The name of this benchmark cannot be an empty string`);
            pass = false;
        } else if (this._name === undefined && this._testFunction.fn.name === '') {
            const prefix = `[No.${this._id} Benchmark]`;
            logger.writeLineError(
                `${prefix} No name provided, cannot get the name of \`testFn\`, it's an anonymous function`,
            );
            pass = false;
        }

        return pass;
    }
}
