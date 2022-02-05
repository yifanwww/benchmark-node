import { BenchmarkRunner } from './BenchmarkRunner';
import { Stats } from './Data';
import { ConsoleLogger } from './tools';
import { Nanosecond } from './types';
import { _Arguments } from './types.internal';

export class BenchmarkJob extends BenchmarkRunner {
    private _stats: Stats[] = [];

    public get stats() {
        return this._stats;
    }

    /**
     * Runs the benchmark.
     * @returns The benchmark instance.
     */
    public run(): this {
        const logger = ConsoleLogger.default;
        logger.writeLineHeader('// *************************');
        logger.writeLineHeader(`// Benchmark: ${this._name}`);

        this.logEnvironmentInfos();
        this.logConfigs();
        logger.writeLine();

        this.onStart?.();

        if (this.testFnOptions.jitArgsCount === 0) {
            this.benchmarkJitting1();
            logger.writeLine();
            this.benchmarkJitting2();
        } else {
            this.benchmarkJitting1(this.testFnOptions.jitArgs);
            logger.writeLine();
            this.benchmarkJitting2(this.testFnOptions.jitArgs);
        }
        logger.writeLine();

        if (this.testFnOptions.argsCount === 0) {
            this._run();
        } else {
            for (const args of this.testFnOptions.args) {
                this._run(args);
            }
        }

        this.onComplete?.();

        return this;
    }

    private _run(args?: _Arguments): void {
        const logger = ConsoleLogger.default;

        if (args) {
            logger.writeLineInfo(`// arguments: ${args.toString()}`);
            logger.writeLine();
        }

        const ops = this.benchmarkPilot(args);
        logger.writeLine();

        this.benchmarkWarmup(false, ops, args);
        logger.writeLine();

        const overhead = this.benchmarkOverheadActual(ops, args);
        logger.writeLine();

        this.benchmarkWarmup(true, ops, args);
        logger.writeLine();

        const measurements: Nanosecond[] = [];
        this.benchmarkWorkloadActual(measurements, ops, args);
        logger.writeLine();

        this.benchmarkWorkloadResult(measurements, overhead, ops);
        logger.writeLine();

        const stats = new Stats(this._name, measurements, ops, args);
        this._stats.push(stats);
        stats.log();
    }
}
