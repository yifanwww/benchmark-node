import { Benchmark } from './Benchmark';
import { BenchmarkRunner } from './BenchmarkRunner';
import { StatisticColumn } from './Columns';
import { RuntimeInfo } from './RuntimeInfo';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { BenchmarkOptions, TestFn } from './types';
import { StatisticColumnOrder, Table } from './View';

export interface BenchmarkJobOptions {
    /**
     * The columns to display the statistic data in the summary table.
     *
     * By default the summary table contains the Mean column, Standard Error column and Standard Deviation column,
     * you cannot disable them.
     */
    columns?: (StatisticColumn | (() => StatisticColumn))[];
}

export class BenchmarkJob extends BenchmarkRunner {
    private static id = 0;
    private readonly _id = ++BenchmarkJob.id;

    private benchs: Benchmark<TestFn>[] = [];

    private _setup: Array<() => void | undefined> = [];
    private _cleanup: Array<() => void | undefined> = [];

    private _statsColumnOrder: StatisticColumnOrder = new StatisticColumnOrder();

    public constructor(options?: BenchmarkJobOptions) {
        super();

        const { columns } = options ?? {};

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
            this.benchs.push(args[0]);
        } else {
            this.benchs.push(new Benchmark(...(args as [string, TestFn, BenchmarkOptions<TestFn>?])));
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
    public addSetup(setup: () => void): this {
        this._setup.push(setup);
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
        this._cleanup.push(cleanup);
        return this;
    }

    public run(): void {
        if (!this.validate()) return;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`Found ${this.benchs.length} ${this.benchs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const bench of this.benchs) {
            logger.writeLineInfo(`- ${bench.name}`);
        }
        logger.writeLine();

        this._setup[0]?.();

        for (const bench of this.benchs) {
            logger.writeLineHeader(`* Benchmark: ${bench.name} *`);
            bench.logConfigs();
            logger.writeLine();

            this._run(bench);
        }

        this._cleanup[0]?.();

        logger.writeLineHeader('* Summary *\n');

        RuntimeInfo.log();

        const table = new Table();
        table.addStatisticColumns(this._statsColumnOrder.getOrder());
        for (const bench of this.benchs) {
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

        for (const bench of this.benchs) {
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
