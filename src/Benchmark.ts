import { BenchmarkJob } from './BenchmarkJob';
import { ConsoleLogger, LogKind } from './tools/ConsoleLogger';
import { BenchmarkJobOptions, TestFn } from './types';
import { Column, Table } from './View';

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

    public setEmptyTest(name: string = 'EmptyTest'): this {
        this.jobs = [new BenchmarkJob(name, () => {}), ...this.jobs];
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
        table.addColumn(new Column('Function', (stats) => stats.name));
        table.addColumn(new Column('Mean', (stats) => stats.mean));
        table.addColumn(new Column('StdErr', (stats) => stats.standardError));
        table.addColumn(new Column('StdDev', (stats) => stats.standardDeviation));
        table.addColumn(new Column('Median', (stats) => stats.median));
        table.addColumn(new Column('Min', (stats) => stats.min));
        table.addColumn(new Column('Max', (stats) => stats.max));
        for (const job of this.jobs) table.addStats(job.stats);
        table.draw();
    }
}
