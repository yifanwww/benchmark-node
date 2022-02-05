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
        table.addColumn(new Column('Mean', (stats) => Column.drawTime(stats.mean)));
        table.addColumn(new Column('StdErr', (stats) => Column.drawTime(stats.standardError)));
        table.addColumn(new Column('StdDev', (stats) => Column.drawTime(stats.standardDeviation)));
        table.addColumn(new Column('Median', (stats) => Column.drawTime(stats.median)));
        table.addColumn(new Column('Min', (stats) => Column.drawTime(stats.min)));
        table.addColumn(new Column('Max', (stats) => Column.drawTime(stats.max)));
        for (const job of this.jobs) table.addStats(job.stats);
        table.draw();
    }
}
