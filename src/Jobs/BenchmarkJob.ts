import { Benchmark, BenchmarkOptions } from '../Benchmark';
import { StatisticColumn } from '../Columns';
import { GlobalCleanup, GlobalSetup } from '../Function';
import { JobConfigBase } from './JobConfigBase';
import { MapToParams } from '../Parameterization';
import { RuntimeInfo } from '../RuntimeInfo';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { BenchmarkingSettings, TestFn } from '../types';
import { StatisticColumnOrder, Table } from '../View';
import { BenchmarkTask } from '../BenchmarkTask';

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
    private static id = 0;
    private declare readonly _id: number;

    private declare readonly _benchs: Benchmark<TestFn>[];

    private declare readonly _setup: Array<GlobalSetup | undefined>;
    private declare readonly _cleanup: Array<GlobalCleanup | undefined>;

    private declare readonly _settings: BenchmarkingSettings;

    private declare readonly _statsColumnOrder: StatisticColumnOrder;

    public constructor(options?: BenchmarkJobOptions) {
        super();

        this._id = ++BenchmarkJob.id;

        this._benchs = [];
        this._setup = [];
        this._cleanup = [];

        this._statsColumnOrder = new StatisticColumnOrder();

        const { columns, ...settings } = options ?? {};

        this._settings = settings;

        if (columns) {
            this.setColumnOrder(columns.map((column) => (typeof column === 'function' ? column() : column)));
        }
    }

    public setColumnOrder(order: StatisticColumn[]): this {
        this._statsColumnOrder.setOrder(order);
        return this;
    }

    public add<T extends TestFn>(bench: Benchmark<T>): this;
    public add<T extends TestFn>(testFn: T, options?: BenchmarkOptions<T>): this;
    public add<T extends TestFn>(name: string, testFn: T, options?: BenchmarkOptions<T>): this;

    public add(
        ...args: [Benchmark<TestFn>] | [TestFn, BenchmarkOptions<TestFn>?] | [string, TestFn, BenchmarkOptions<TestFn>?]
    ): this {
        if (args[0] instanceof Benchmark) {
            this._benchs.push(args[0]);
        } else {
            this._benchs.push(new Benchmark(...(args as [string, TestFn, BenchmarkOptions<TestFn>?])));
        }
        return this;
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
    public addSetup(setup: () => void): this;
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
    public addSetup<Args extends readonly unknown[]>(setup: (...args: Args) => void, params: MapToParams<Args>): this;

    public addSetup<Args extends readonly unknown[]>(setup: (...args: Args) => void, params?: MapToParams<Args>): this {
        this._setup.push(new GlobalSetup(setup as (...args: readonly unknown[]) => void, params ?? []));
        return this;
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
    public addCleanup(cleanup: () => void): this {
        this._cleanup.push(new GlobalCleanup(cleanup));
        return this;
    }

    private runBenchmark(benchs: BenchmarkTask[]) {
        const logger = ConsoleLogger.default;

        for (const bench of benchs) {
            logger.writeLineHeader(`* Benchmark: ${bench.name} *`);
            bench.logConfigs();
            logger.writeLine();

            this._runner.run(bench);
        }
    }

    public run(): void {
        if (!this.validate()) return;

        const logger = ConsoleLogger.default;

        const benchs = this._benchs.map((bench) => bench.toBenchmarkTask());

        logger.writeLineInfo(`Found ${benchs.length} ${benchs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const bench of benchs) {
            logger.writeLineInfo(`- ${bench.name}`);
        }
        logger.writeLine();

        for (const bench of benchs) {
            bench.setBenchmarkingSettings(this._settings);
        }

        const setup = this._setup[0];
        const cleanup = this._cleanup[0];

        if (!setup || !setup.hasParams()) {
            setup?.fn();
            this.runBenchmark(benchs);
            cleanup?.fn();
        } else {
            for (const args of setup.params) {
                setup.fn(...args);
                this.runBenchmark(benchs);
                cleanup?.fn();
            }
        }

        logger.writeLineHeader('* Summary *\n');

        RuntimeInfo.log();

        const table = new Table();
        table.addStatisticColumns(this._statsColumnOrder.getOrder());
        for (const bench of benchs) {
            table.addStats(bench.stats);
        }
        table.drawSummaryTable();
        table.writeDescription();
    }

    /**
     * Validates this benchmark job.
     * @returns Returns `false` if problems in this benchmark job, otherwise `true`.
     */
    public validate(): boolean {
        const logger = ConsoleLogger.default;

        logger.writeLineInfo('Validating benchmarks...');

        let pass = true;

        for (const bench of this._benchs) {
            if (!bench.validate()) pass = false;
        }

        if (this._setup.length > 1) {
            logger.writeLineError(
                `[No.${this._id} BenchmarkJob] An benchmark job can only have one global setup function`,
            );
            pass = false;
        }

        if (this._cleanup.length > 1) {
            logger.writeLineError(
                `[No.${this._id} BenchmarkJob] An benchmark job can only have one global cleanup function`,
            );
            pass = false;
        }

        return pass;
    }
}
