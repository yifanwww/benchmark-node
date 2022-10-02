import { FunctionInfo } from '../Function';
import { ArgumentStore, ArgumentStoreView } from '../ParameterizationStore';
import { ConsoleLogger } from '../Tools/ConsoleLogger';

import { BenchmarkTask } from './BenchmarkTask';

import type { Settings } from '../Data';
import type { ParameterStoreView } from '../ParameterizationStore';
import type { BenchmarkingSettings, BenchmarkTestFnOptions, TestFn } from '../types';
import type { Optional } from '../types.internal';
import type { BenchmarkContext } from './Context';

interface ConstructorArgs<T extends TestFn> {
    name?: string;
    options: BenchmarkOptions<T>;
    testFn: T;
}

export interface BenchmarkOptions<T extends TestFn> extends BenchmarkingSettings, BenchmarkTestFnOptions<T> {}

export class Benchmark<T extends TestFn = TestFn> {
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _context: BenchmarkContext;

    private declare readonly _testFnName: string;
    private declare readonly _testArgStore: ArgumentStore;

    private declare readonly _settings: Readonly<BenchmarkingSettings>;

    get testArgStore() {
        return this._testArgStore;
    }

    /**
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    constructor(testFn: T, options?: Readonly<BenchmarkOptions<T>>);
    /**
     * @param name The name used to identify this benchmark.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    constructor(name: string, testFn: T, options?: Readonly<BenchmarkOptions<T>>);

    constructor(...args: [T, Readonly<BenchmarkOptions<T>>?] | [string, T, Readonly<BenchmarkOptions<T>>?]) {
        this._id = ++Benchmark.id;

        const { name, options, testFn } = this.parseArgs(args);

        this._testFnName = FunctionInfo.getFunctionName(testFn);
        this._testArgStore = new ArgumentStore(options.args, options.jitArgs);

        this._settings = options;

        this._context = {
            name: name ?? this._testFnName,

            testFn,
            testFnParamNames: FunctionInfo.getParameterNames(testFn),

            setup: options.setup ?? null,
            cleanup: options.cleanup ?? null,
        };
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
    validate(): boolean {
        const logger = ConsoleLogger.default;
        const prefix = `[No.${this._id} Benchmark]`;

        let pass = true;

        if (this._context.name === FunctionInfo.ANONYMOUS_NAME && this._testFnName === FunctionInfo.ANONYMOUS_NAME) {
            logger.writeLineError(
                `${prefix} The name of benchmark cannot be the anonymous function name, please give a specific name`,
            );
            pass = false;
        }

        return pass;
    }

    toTask(globalSettings: Settings, paramStoreView: Optional<ParameterStoreView>): BenchmarkTask[] {
        const tasks: BenchmarkTask[] = [];

        for (const argsView of ArgumentStoreView.iteratesStoreArgs(this._testArgStore)) {
            tasks.push(
                new BenchmarkTask(argsView, globalSettings.merge(this._settings), paramStoreView, this._context),
            );
        }

        return tasks;
    }
}
