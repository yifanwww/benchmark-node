import { StatisticColumn, StatisticColumnOrder } from '../Columns';
import { Settings } from '../Data';
import { GlobalSetup, GlobalSetupView } from '../Function';
import { MapToParams } from '../Parameterization';
import { ArgumentStoreView } from '../ParameterizationStore';
import { SummaryTable } from '../Reports';
import { RuntimeInfo } from '../RuntimeInfo';
import { Benchmark, BenchmarkOptions, BenchmarkTask } from '../Task';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { BenchmarkingSettings, TestFn } from '../types';
import { Optional } from '../types.internal';
import { JobConfigBase } from './JobConfigBase';

export interface BenchmarkJobOptions extends BenchmarkingSettings {
    /**
     * The columns to display the statistic data in the summary table.
     *
     * By default the summary table contains the Mean column, Standard Error column and Standard Deviation column,
     * you cannot disable them.
     */
    columns?: (StatisticColumn | (() => StatisticColumn))[];
}

export class BenchmarkJob extends JobConfigBase {
    private declare readonly _benchs: Benchmark[];

    private declare _setup: GlobalSetup;
    private declare _cleanup: Optional<() => void>;
    private declare readonly _setups: Array<GlobalSetup | undefined>;
    private declare readonly _cleanups: Array<(() => void) | undefined>;

    private declare readonly _settings: Settings;

    private declare readonly _statsColumnOrder: StatisticColumnOrder;

    constructor(options?: Readonly<BenchmarkJobOptions>) {
        super();

        this._benchs = [];

        this._setup = GlobalSetup.EMPTY;
        this._setups = [];
        this._cleanups = [];

        this._statsColumnOrder = new StatisticColumnOrder();

        const { columns, ...settings } = options ?? {};

        this._settings = Settings.from(settings);

        if (columns) {
            this.setColumnOrder(columns.map((column) => (typeof column === 'function' ? column() : column)));
        }
    }

    setColumnOrder(order: StatisticColumn[]): this {
        this._statsColumnOrder.addOrder(order);
        return this;
    }

    add<T extends TestFn>(bench: Benchmark<T>): this;
    add<T extends TestFn>(testFn: T, options?: BenchmarkOptions<T>): this;
    add<T extends TestFn>(name: string, testFn: T, options?: BenchmarkOptions<T>): this;

    add(
        ...args: [Benchmark] | [TestFn, BenchmarkOptions<TestFn>?] | [string, TestFn, BenchmarkOptions<TestFn>?]
    ): this {
        if (args[0] instanceof Benchmark) {
            this._benchs.push(args[0]);
        } else {
            this._benchs.push(new Benchmark(...(args as [string, TestFn, BenchmarkOptions<TestFn>?])));
        }
        return this;
    }

    /** @deprecated Please use `setSetup` instead. */
    addSetup(setup: () => void): this {
        return this.setSetup(setup);
    }

    /**
     * Adds global setup.
     * The global setup function will be executed only once before all the benchmark function invocations.
     *
     * NOTE: An benchmark job can only have one global setup function.
     *
     * @param setup A callback function that does some setup work.
     * @returns The benchmark instance itself.
     */
    setSetup(setup: () => void): this;
    /**
     * Adds global setup.
     * The global setup function will be executed only once before all the benchmark function invocations.
     *
     * NOTE: An benchmark job can only have one global setup function.
     *
     * @param setup A callback function that does some setup work.
     * @param params The parameters passed to the setup function.
     * @returns The benchmark instance itself.
     */
    setSetup<Args extends readonly unknown[]>(setup: (...args: Args) => void, params: MapToParams<Args>): this;

    setSetup<Args extends readonly unknown[]>(setup: (...args: Args) => void, params?: MapToParams<Args>): this {
        const globalSetup = new GlobalSetup(setup as (...args: readonly unknown[]) => void, params ?? []);
        this._setup = globalSetup;
        this._setups.push(globalSetup);
        return this;
    }

    /** @deprecated Please use `setCleanup` instead. */
    addCleanup(cleanup: () => void): this {
        return this.setCleanup(cleanup);
    }

    /**
     * Adds global cleanup.
     * The global cleanup function will be executed only once after all the benchmark function invocations.
     *
     * NOTE: An benchmark job can only have one global cleanup function.
     *
     * @param cleanup A callback function that does some cleanup work.
     * @returns The benchmark instance itself.
     */
    setCleanup(cleanup: () => void): this {
        this._cleanup = cleanup;
        this._cleanups.push(cleanup);
        return this;
    }

    private benchmarkToTask(): BenchmarkTask[] {
        const tasks: BenchmarkTask[] = [];

        for (const setupView of GlobalSetupView.iteratesGlobalSetupExecutors(this._setup)) {
            for (const bench of this._benchs) {
                for (const argsView of ArgumentStoreView.iteratesStoreArgs(bench.testArgStore)) {
                    tasks.push(
                        new BenchmarkTask(
                            bench.name,
                            bench.testFn,
                            bench.testFnParamNames,
                            argsView,
                            this._settings.merge(bench.settings),
                            setupView,
                            this._cleanup,
                            bench.setup,
                            bench.cleanup,
                        ),
                    );
                }
            }
        }

        return tasks;
    }

    run(): void {
        if (!this.validate()) return;

        const logger = ConsoleLogger.default;

        const tasks = this.benchmarkToTask();

        logger.writeLineInfo(`Found ${tasks.length} ${tasks.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const task of tasks) {
            logger.writeLineInfo(`- ${task.name}`);
        }
        logger.writeLine();

        for (const task of tasks) {
            logger.writeLineHeader(`* Benchmark: ${task.name} *`);
            task.logConfigs();
            logger.writeLine();

            this._runner.run(task);
        }

        logger.writeLineHeader('* Summary *\n');

        RuntimeInfo.log();

        const table = new SummaryTable({
            argLen: Math.max(...this._benchs.map((bench) => bench.testArgStore.argsLength)),
            paramLen: this._setup.params.length,
        });

        table.addStatisticColumns(this._statsColumnOrder.getOrder());
        for (const task of tasks) {
            table.addStats(task.stats);
        }
        table.draw();
        table.drawDescription();
    }

    /**
     * Validates this benchmark job.
     * @returns Returns `false` if problems in this benchmark job, otherwise `true`.
     */
    validate(): boolean {
        const logger = ConsoleLogger.default;

        logger.writeLineInfo('Validating benchmarks...');

        let pass = true;

        for (const bench of this._benchs) {
            if (!bench.validate()) pass = false;
        }

        if (this._setups.length > 1) {
            logger.writeLineError(
                `[No.${this._id} BenchmarkJob] An benchmark job can only have one global setup function`,
            );
            pass = false;
        }

        if (this._cleanups.length > 1) {
            logger.writeLineError(
                `[No.${this._id} BenchmarkJob] An benchmark job can only have one global cleanup function`,
            );
            pass = false;
        }

        return pass;
    }
}
