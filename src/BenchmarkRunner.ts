import { BenchmarkTask } from './BenchmarkTask';
import { Statistics } from './Data';
import { Arguments } from './Parameterization';
import { TesterContext } from './Tools/CodeGen';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { Formatter } from './Tools/Formatter';
import { Time } from './Tools/TimeTool';
import { Nanosecond } from './types';
import { Optional } from './types.internal';

enum Stage {
    ActualOverhead /*  */ = 'OverheadActual  ',
    ActualWorkload /*  */ = 'WorkloadActual  ',
    JittingOverhead /* */ = 'OverheadJitting ',
    JittingWorkload /* */ = 'WorkloadJitting ',
    WarmupOverhead /*  */ = 'OverheadWarmup  ',
    WarmupWorkload /*  */ = 'WorkloadWarmup  ',
    WorkloadPilot /*   */ = 'WorkloadPilot   ',
    WorkloadResult /*  */ = 'WorkloadResult  ',
}

export class BenchmarkRunner {
    private declare _current: Optional<BenchmarkTask>;

    public constructor() {
        this._current = null;
    }

    private benchmarkJitting(
        workload: boolean,
        order: number,
        ops: number,
        argsGenerator?: Generator<Arguments<never[]>, void>,
    ): void {
        const testerContext: TesterContext = {
            ops,
            testFn: this._current!.testFn,
            workload,

            setup: this._current!.setup,
            cleanup: this._current!.cleanup,
        };

        let used: Nanosecond = 0;
        if (!argsGenerator) {
            used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
        } else {
            for (const args of argsGenerator) {
                testerContext.args = args.args;
                used += Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
            }
        }

        const elapsed = used / ops;

        this.logOpsData(workload ? Stage.JittingWorkload : Stage.JittingOverhead, order, ops, used, elapsed);
    }

    private benchmarkJitting1(getArgsGenerator?: () => Generator<Arguments<never[]>, void>): void {
        this.benchmarkJitting(false, 1, 1, getArgsGenerator?.());
        this.benchmarkJitting(true, 1, 1, getArgsGenerator?.());
    }

    private benchmarkJitting2(getArgsGenerator?: () => Generator<Arguments<never[]>, void>): void {
        this.benchmarkJitting(false, 2, this._current!.settings.initOps, getArgsGenerator?.());
        this.benchmarkJitting(true, 2, this._current!.settings.initOps, getArgsGenerator?.());
    }

    private benchmarkPilot(args?: Arguments<never[]>): number {
        const testerContext: TesterContext = {
            args: args?.args,
            ops: this._current!.settings.initOps,
            testFn: this._current!.testFn,
            workload: true,

            setup: this._current!.setup,
            cleanup: this._current!.cleanup,
        };

        for (let index = 1; ; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            const elapsed = used / testerContext.ops;

            this.logOpsData(Stage.WorkloadPilot, index, testerContext.ops, used, elapsed);

            // Calculate how many more iterations it will take to achieve the `minTime`.
            // After stage Pilot, we should get a good count number.
            if (used <= this._current!.settings.minMeasurementTime) {
                testerContext.ops += Math.ceil((this._current!.settings.minMeasurementTime - used) / elapsed);
            } else {
                break;
            }

            Time.sleep(this._current!.settings.delay);
        }

        return testerContext.ops;
    }

    private benchmarkWarmup(workload: boolean, ops: number, args?: Arguments<never[]>): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.testFn,
            workload,

            setup: this._current!.setup,
            cleanup: this._current!.cleanup,
        };

        for (let index = 1; index <= this._current!.settings.warmupCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
            const elapsed = used / ops;

            this.logOpsData(workload ? Stage.WarmupWorkload : Stage.WarmupOverhead, index, ops, used, elapsed);

            Time.sleep(this._current!.settings.delay);
        }
    }

    private benchmarkOverheadActual(ops: number, args?: Arguments<never[]>): Nanosecond {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.testFn,
            workload: false,

            setup: this._current!.setup,
            cleanup: this._current!.cleanup,
        };

        let total: Nanosecond = 0;

        for (let index = 1; index <= this._current!.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            this.logOpsData(Stage.ActualOverhead, index, ops, used, used / ops);

            total += used;

            Time.sleep(this._current!.settings.delay);
        }

        return total / this._current!.settings.measurementCount;
    }

    private benchmarkWorkloadActual(measurements: Nanosecond[], ops: number, args?: Arguments<never[]>): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.testFn,
            workload: true,

            setup: this._current!.setup,
            cleanup: this._current!.cleanup,
        };

        for (let index = 1; index <= this._current!.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            this.logOpsData(Stage.ActualWorkload, index, ops, used, used / ops);

            measurements.push(used);

            Time.sleep(this._current!.settings.delay);
        }
    }

    private benchmarkWorkloadResult(measurements: Nanosecond[], overhead: Nanosecond, ops: number): void {
        for (let i = 0; i < measurements.length; i++) {
            measurements[i] = Math.max(measurements[i] - overhead, 0);
            this.logOpsData(Stage.WorkloadResult, i + 1, ops, measurements[i], measurements[i] / ops);
        }
    }

    private logOpsData(prefix: Stage, index: number, ops: number, used: Nanosecond, elapsed: Nanosecond) {
        const len = this._current!.settings.measurementCount.toString().length;

        ConsoleLogger.default.writeLine(
            [
                prefix,
                `${index.toString().padStart(len)}: `,
                `${ops} op, `,
                `${used.toFixed(0)} ns, `,
                `${elapsed.toFixed(4)} ns/op`,
            ].join(''),
        );
    }

    /**
     * Runs the benchmark.
     */
    public run(bench: BenchmarkTask): void {
        this._current = bench;

        this._runJitting();

        if (bench.testFunction.argsCount === 0) {
            this._runFormal();
        } else {
            for (const args of bench.testFunction.args) {
                this._runFormal(args);
            }
        }

        this._current = null;
    }

    private _runJitting(): void {
        const logger = ConsoleLogger.default;

        if (this._current!.testFunction.jitArgsCount === 0) {
            this.benchmarkJitting1();
            logger.writeLine();
            this.benchmarkJitting2();
        } else {
            this.benchmarkJitting1(() => this._current!.testFunction.jitArgs);
            logger.writeLine();
            this.benchmarkJitting2(() => this._current!.testFunction.jitArgs);
        }
        logger.writeLine();
    }

    private _runFormal(args?: Arguments<never[]>): void {
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

        const stats = new Statistics(this._current!.name, measurements, ops, args);
        this._current!.stats.push(stats);
        stats.log();
    }
}
