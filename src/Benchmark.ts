import { BenchmarkJob } from './BenchmarkJob';
import { StatisticColumn } from './Columns';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { BenchmarkJobOptions, TestFn } from './types';
import { StatisticColumnOrder, Table } from './View';

export interface BenchmarkOptions {
    /**
     * The columns that Benchmark displays the statistic data in summary table.
     *
     * By default Benchmark will display the Mean column, Standard Error column and Standard Deviation column,
     * you cannot disable them.
     */
    columns?: (StatisticColumn | (() => StatisticColumn))[];
}

export class Benchmark {
    private jobs: BenchmarkJob<TestFn>[] = [];

    private _setupArr: Array<() => void> = [];
    private _cleanupArr: Array<() => void> = [];

    private _statisticColumnOrder: StatisticColumnOrder = new StatisticColumnOrder();

    public constructor(options?: BenchmarkOptions) {
        const { columns } = options ?? {};

        if (columns) {
            this.setColumnOrder(columns.map((column) => (typeof column === 'function' ? column() : column)));
        }
    }

    public add<T extends TestFn>(job: BenchmarkJob<T>): this;
    public add<T extends TestFn>(testFn: T, options?: BenchmarkJobOptions<T>): this;
    public add<T extends TestFn>(name: string, testFn: T, options?: BenchmarkJobOptions<T>): this;

    public add(
        ...args:
            | [BenchmarkJob<TestFn>]
            | [TestFn, BenchmarkJobOptions<TestFn>?]
            | [string, TestFn, BenchmarkJobOptions<TestFn>?]
    ): this {
        if (args[0] instanceof BenchmarkJob) {
            this.jobs.push(args[0]);
        } else {
            this.jobs.push(new BenchmarkJob(...(args as [string, TestFn, BenchmarkJobOptions<TestFn>?])));
        }
        return this;
    }

    /**
     * Adds global setup.
     * The global setup function will be executed only once before all the benchmark function invocations.
     *
     * @param setup A callback function that does some setup work.
     * @returns The benchmark instance itself.
     */
    public addSetup(setup: () => void): this {
        this._setupArr.push(setup);
        return this;
    }

    /**
     * Adds global cleanup.
     * The global cleanup function will be executed only once after all the benchmark function invocations.
     *
     * @param cleanup A callback function that does some cleanup work.
     * @returns The benchmark instance itself.
     */
    public addCleanup(cleanup: () => void): this {
        this._cleanupArr.push(cleanup);
        return this;
    }

    public setColumnOrder(order: StatisticColumn[]): this {
        this._statisticColumnOrder.setOrder(order);
        return this;
    }

    public run(): void {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`// Found ${this.jobs.length} ${this.jobs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const job of this.jobs) {
            logger.writeLineInfo(`//   ${job.name}`);
        }
        logger.writeLine();

        for (const setup of this._setupArr) setup();
        for (const job of this.jobs) job.run();
        for (const cleanup of this._cleanupArr) cleanup();

        const table = new Table();
        table.addStatisticColumns(this._statisticColumnOrder.getOrder());
        for (const job of this.jobs) {
            table.addStats(job.stats);
        }
        table.drawSummaryTable();
        table.writeDescription();
    }
}
