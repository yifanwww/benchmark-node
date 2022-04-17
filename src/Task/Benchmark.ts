import { ANONYMOUS_FN_NAME } from '../constants';
import { Settings, TestFunction } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { BenchmarkingSettings, BenchmarkTestFnOptions, TestFn } from '../types';
import { BenchmarkTask } from './BenchmarkTask';

interface ConstructorArgs<T extends TestFn> {
    name?: string;
    options: BenchmarkOptions<T>;
    testFn: T;
}

export interface BenchmarkOptions<T extends TestFn> extends BenchmarkingSettings, BenchmarkTestFnOptions<T> {}

export class Benchmark<T extends TestFn> {
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _name: string;

    private declare readonly _testFn: T;
    private declare readonly _testFunction: TestFunction<T>;

    private declare readonly _settings: Readonly<BenchmarkingSettings>;

    private declare readonly _setup?: () => void;
    private declare readonly _cleanup?: () => void;

    /**
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(testFn: T, options?: Readonly<BenchmarkOptions<T>>);
    /**
     * @param name The name used to identify this test.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    public constructor(name: string, testFn: T, options?: Readonly<BenchmarkOptions<T>>);

    public constructor(...args: [T, Readonly<BenchmarkOptions<T>>?] | [string, T, Readonly<BenchmarkOptions<T>>?]) {
        const { name, options, testFn } = this.parseArgs(args);

        this._id = ++Benchmark.id;

        this._testFn = testFn;
        this._testFunction = new TestFunction(testFn, options);

        this._name = name ?? this._testFunction.name;

        this._settings = options;

        this._setup = options.setup;
        this._cleanup = options.cleanup;
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

        if (this._name === ANONYMOUS_FN_NAME && this._testFunction.name === ANONYMOUS_FN_NAME) {
            logger.writeLineError(
                `${prefix} The name of benchmark cannot be the anonymous function name, please give a specific name`,
            );
            pass = false;
        }

        return pass;
    }

    public toBenchmarkTask(jobSettings: Settings): BenchmarkTask {
        return new BenchmarkTask(
            this._name,
            this._testFn,
            this._testFunction,
            jobSettings.merge(this._settings),
            this._setup,
            this._cleanup,
        );
    }
}
