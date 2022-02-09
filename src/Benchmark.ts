import { BenchmarkJob } from './BenchmarkJob';
import { Column } from './ConfigOptions';
import { ConsoleLogger, LogKind } from './Tools/ConsoleLogger';
import { BenchmarkJobOptions, TestFn } from './types';
import { PerfColumn, PerfColumnOrder, Table } from './View';

export interface BenchmarkOptions {
    order?: Column[];
}

export class Benchmark {
    private jobs: BenchmarkJob<TestFn>[] = [];

    private _setupArr: Array<() => void> = [];
    private _cleanupArr: Array<() => void> = [];

    private _perfColumnOrder: PerfColumnOrder = new PerfColumnOrder();

    public constructor(options?: BenchmarkOptions) {
        const { order } = options ?? {};

        if (order) {
            this.setColumnOrder(order);
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

    public setNoopTest(name: string = 'noop'): this {
        this.jobs.splice(0, 0, new BenchmarkJob(name, () => {}));
        return this;
    }

    public addSetup(setup: () => void): this {
        this._setupArr.push(setup);
        return this;
    }

    public addCleanup(cleanup: () => void): this {
        this._cleanupArr.push(cleanup);
        return this;
    }

    public setColumnOrder(order: Column[]): this {
        this._perfColumnOrder.setOrder(order);
        return this;
    }

    public run(): void {
        for (const setup of this._setupArr) {
            setup();
        }

        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`// Found ${this.jobs.length} ${this.jobs.length > 1 ? 'benchmarks' : 'benchmark'}:`);
        for (const job of this.jobs) {
            logger.writeLine(LogKind.Info, `//   ${job.name}`);
        }
        logger.writeLine();

        for (const job of this.jobs) job.run();

        const table = new Table();
        for (const column of this._perfColumnOrder.getOrder()) {
            table.addPerfColumn(PerfColumn.column(column));
        }
        for (const job of this.jobs) table.addStats(job.stats);
        table.draw();

        for (const cleanup of this._cleanupArr) {
            cleanup();
        }
    }
}
