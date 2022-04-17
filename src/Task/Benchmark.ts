import { ArgumentStore } from '../Data';
import { FunctionInfo } from '../Function';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { BenchmarkingSettings, BenchmarkTestFnOptions, TestFn } from '../types';
import { Optional } from '../types.internal';

interface ConstructorArgs<T extends TestFn> {
    name?: string;
    options: BenchmarkOptions<T>;
    testFn: T;
}

export interface BenchmarkOptions<T extends TestFn> extends BenchmarkingSettings, BenchmarkTestFnOptions<T> {}

export class Benchmark<T extends TestFn = TestFn> {
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _name: string;

    private declare readonly _testFn: T;
    private declare readonly _testFnName: string;
    private declare readonly _testFnParamNames: readonly string[];
    private declare readonly _testArgStore: ArgumentStore;

    private declare readonly _settings: Readonly<BenchmarkingSettings>;

    private declare readonly _setup: Optional<() => void>;
    private declare readonly _cleanup: Optional<() => void>;

    public get name(): string {
        return this._name;
    }

    public get testFn() {
        return this._testFn;
    }

    public get testFnParamNames() {
        return this._testFnParamNames;
    }

    public get testArgStore() {
        return this._testArgStore;
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

    /**
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(testFn: T, options?: Readonly<BenchmarkOptions<T>>);
    /**
     * @param name The name used to identify this benchmark.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(name: string, testFn: T, options?: Readonly<BenchmarkOptions<T>>);

    public constructor(...args: [T, Readonly<BenchmarkOptions<T>>?] | [string, T, Readonly<BenchmarkOptions<T>>?]) {
        const { name, options, testFn } = this.parseArgs(args);

        this._id = ++Benchmark.id;

        this._testFn = testFn;
        this._testFnName = FunctionInfo.getFunctionName(testFn);
        this._testFnParamNames = FunctionInfo.getParameterNames(testFn);
        this._testArgStore = new ArgumentStore(options.args, options.jitArgs);

        this._name = name ?? this._testFnName;

        this._settings = options;

        this._setup = options.setup ?? null;
        this._cleanup = options.cleanup ?? null;
    }

    private parseArgs(
        args: [T, Readonly<BenchmarkOptions<T>>?] | [string, T, Readonly<BenchmarkOptions<T>>?],
    ): ConstructorArgs<T> {
        if (typeof args[0] === 'string') {
            const [name, testFn, options = {}] = args as [string, T, Readonly<BenchmarkOptions<T>>?];
            return { name, testFn, options };
        } else {
            const [testFn, options = {}] = args as [T, Readonly<BenchmarkOptions<T>>?];
            return { testFn, options };
        }
    }

    /**
     * Validates this benchmark.
     * @returns Returns `false` if problems in this benchmark, otherwise `true`.
     */
    public validate(): boolean {
        const logger = ConsoleLogger.default;

        let pass = true;

        const prefix = `[No.${this._id} Benchmark]`;

        if (this._name === FunctionInfo.ANONYMOUS_NAME && this._testFnName === FunctionInfo.ANONYMOUS_NAME) {
            logger.writeLineError(
                `${prefix} The name of benchmark cannot be the anonymous function name, please give a specific name`,
            );
            pass = false;
        }

        return pass;
    }
}
