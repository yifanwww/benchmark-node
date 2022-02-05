import { BenchmarkRunner } from './BenchmarkRunner';
import { StagePrefix } from './Enums';
import { ConsoleLogger } from './tools/ConsoleLogger';
import { Stats } from './tools/Stats';
import { _Nanosecond } from './types.internal';

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
            this.benchmarkJitting1(StagePrefix.Jitting);
            this.benchmarkJitting2(StagePrefix.Jitting);
        } else {
            this.benchmarkJitting1(StagePrefix.Jitting, this.testFnOptions.jitArgs);
            this.benchmarkJitting2(StagePrefix.Jitting, this.testFnOptions.jitArgs);
        }
        ConsoleLogger.default.writeLine();

        if (this.testFnOptions.argsCount === 0) {
            const ops = this.benchmarkPilot(StagePrefix.Pilot);
            ConsoleLogger.default.writeLine();

            const measurements: _Nanosecond[] = [];
            this.benchmarkFormal(StagePrefix.Formal, measurements, ops);
            ConsoleLogger.default.writeLine();

            const stats = new Stats(this._name, measurements);
            this._stats.push(stats);
            stats.log();
        } else {
            for (const args of this.testFnOptions.args) {
                ConsoleLogger.default.writeLineInfo(`// arguments: ${args.toString()}`);
                ConsoleLogger.default.writeLine();

                const ops = this.benchmarkPilot(StagePrefix.Pilot, args);
                ConsoleLogger.default.writeLine();

                const measurements: _Nanosecond[] = [];
                this.benchmarkFormal(StagePrefix.Formal, measurements, ops, args);
                ConsoleLogger.default.writeLine();

                const stats = new Stats(this._name, measurements);
                this._stats.push(stats);
                stats.log();
            }
        }

        this.onComplete?.();

        return this;
    }
}
