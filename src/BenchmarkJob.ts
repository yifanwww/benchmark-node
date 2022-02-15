import { BenchmarkRunner } from './BenchmarkRunner';
import { Statistics } from './Data';
import { Arguments } from './Parameterization';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { Formatter } from './Tools/Formatter';
import { Nanosecond, TestFn } from './types';

export class BenchmarkJob<T extends TestFn> extends BenchmarkRunner<T> {
    private _stats: Statistics[] = [];

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

        if (this.testFunction.jitArgsCount === 0) {
            this.benchmarkJitting1();
            logger.writeLine();
            this.benchmarkJitting2();
        } else {
            this.benchmarkJitting1(this.testFunction.getJitArgsGenerator);
            logger.writeLine();
            this.benchmarkJitting2(this.testFunction.getJitArgsGenerator);
        }
        logger.writeLine();

        if (this.testFunction.argsCount === 0) {
            this._run();
        } else {
            for (const args of this.testFunction.args) {
                this._run(args);
            }
        }

        return this;
    }

    private _run(args?: Arguments<Parameters<T>>): void {
        const logger = ConsoleLogger.default;

        if (args) {
            logger.writeLineInfo(`// arguments: ${args.args.map((arg) => Formatter.limitStringLength(String(arg)))}`);
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

        const stats = new Statistics(this._name, measurements, ops, args);
        this._stats.push(stats);
        stats.log();
    }
}
