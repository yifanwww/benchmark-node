import { Benchmark, BenchmarkOptions } from './Benchmark';
import { BenchmarkRunner } from './BenchmarkRunner';
import { StatisticColumn } from './Columns';
import { Cleanup, Setup } from './Function';
import { MapToParams } from './Parameterization';
import { RuntimeInfo } from './RuntimeInfo';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { BenchmarkingSettings, TestFn } from './types';
import { StatisticColumnOrder, Table } from './View';

export interface BenchmarkJobOptions extends BenchmarkingSettings {
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
    private declare readonly _id: number;

    private declare readonly _benchs: Benchmark<TestFn>[];

    private declare readonly _setup: Array<Setup | undefined>;
    private declare readonly _cleanup: Array<Cleanup | undefined>;

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
        this._setup.push(new Setup(setup as (...args: readonly unknown[]) => void, params ?? []));
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
        this._cleanup.push(new Cleanup(cleanup));
        return this;
    }

    private runBenchmark() {
        const logger = ConsoleLogger.default;

        for (const bench of this._benchs) {
            logger.writeLineHeader(`* Benchmark: ${bench.name} *`);
            bench.logConfigs();
            logger.writeLine();

            this._run(bench);
        }
    }

    public run(): void {
        if (!this.validate()) return;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`Found ${this._benchs.length} ${this._benchs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const bench of this._benchs) {
            logger.writeLineInfo(`- ${bench.name}`);
        }
        logger.writeLine();

        for (const bench of this._benchs) {
            bench.setBenchmarkingSettings(this._settings);
        }

        if (!this._setup[0] || !this._setup[0].hasParams()) {
            this.runBenchmark();
            this._cleanup[0]?.fn();
        } else {
            const setup = this._setup[0];
            const cleanup = this._cleanup[0];

            for (const args of setup.params) {
                setup.fn(...args);
                this.runBenchmark();
                cleanup?.fn();
            }
        }

        logger.writeLineHeader('* Summary *\n');

        RuntimeInfo.log();

        const table = new Table();
        table.addStatisticColumns(this._statsColumnOrder.getOrder());
        for (const bench of this._benchs) {
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
