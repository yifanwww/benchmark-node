import { BenchmarkJob } from './BenchmarkJob';
import { ConsoleLogger, LogKind } from './tools';
import { BenchmarkJobOptions, TestFn } from './types';
import { PerfColumn, PerfColumnType, Table } from './View';

export class Benchmark {
    private jobs: BenchmarkJob[] = [];

    public add(job: BenchmarkJob): this;
    public add(testFn: TestFn, options?: BenchmarkJobOptions): this;
    public add(name: string, testFn: TestFn, options?: BenchmarkJobOptions): this;

    public add(
        ...args: [BenchmarkJob] | [TestFn, BenchmarkJobOptions?] | [string, TestFn, BenchmarkJobOptions?]
    ): this {
        if (args[0] instanceof BenchmarkJob) {
            this.jobs.push(args[0]);
        } else {
            this.jobs.push(new BenchmarkJob(...(args as [string, TestFn, BenchmarkJobOptions?])));
        }
        return this;
    }

    public setNoopTest(name: string = 'noop'): this {
        this.jobs.splice(0, 0, new BenchmarkJob(name, () => {}));
        return this;
    }

    public run(): void {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`// Found ${this.jobs.length} ${this.jobs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const job of this.jobs) {
            logger.writeLine(LogKind.Info, `//   ${job.name}`);
        }
        logger.writeLine();

        for (const job of this.jobs) job.run();

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
