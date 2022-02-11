import { BenchmarkJob } from './BenchmarkJob';
import { ConsoleLogger, LogKind } from './tools';
import { BenchmarkJobOptions, TestFn } from './types';
import { PerfColumn, PerfColumnType, Table } from './View';

export class Benchmark {
    private jobs: BenchmarkJob<TestFn>[] = [];

    private _setupArr: Array<() => void> = [];
    private _cleanupArr: Array<() => void> = [];

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

    public setNoopTest(name: string = 'noop'): this {
        this.jobs.splice(0, 0, new BenchmarkJob(name, () => {}));
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

    public run(): void {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`// Found ${this.jobs.length} ${this.jobs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const job of this.jobs) {
            logger.writeLine(LogKind.Info, `//   ${job.name}`);
        }
        logger.writeLine();

        for (const setup of this._setupArr) setup();

        for (const job of this.jobs) job.run();

        for (const cleanup of this._cleanupArr) cleanup();

        const table = new Table();
        table.addPerfColumn(new PerfColumn(PerfColumnType.StdErr, (stats) => stats.standardError));
        table.addPerfColumn(new PerfColumn(PerfColumnType.StdDev, (stats) => stats.standardDeviation));
        table.addPerfColumn(new PerfColumn(PerfColumnType.Median, (stats) => stats.median));
        table.addPerfColumn(new PerfColumn(PerfColumnType.Min, (stats) => stats.min));
        table.addPerfColumn(new PerfColumn(PerfColumnType.Max, (stats) => stats.max));
        for (const job of this.jobs) table.addStats(job.stats);
        table.draw();
    }
}
