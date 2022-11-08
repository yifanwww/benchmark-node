import { Statistics } from '../Data';
import type { Arguments } from '../Parameterization';
import type { TesterContext } from '../Tools/CodeGen';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { Time } from '../Tools/TimeTool';
import type { Nanosecond } from '../types';
import type { Optional } from '../types.internal';

import type { BenchmarkTask } from './BenchmarkTask';

enum Stage {
    ACTUAL_OVERHEAD /*  */ = 'OverheadActual  ',
    ACTUAL_WORKLOAD /*  */ = 'WorkloadActual  ',
    JITTING_OVERHEAD /* */ = 'OverheadJitting ',
    JITTING_WORKLOAD /* */ = 'WorkloadJitting ',
    WARMUP_OVERHEAD /*  */ = 'OverheadWarmup  ',
    WARMUP_WORKLOAD /*  */ = 'WorkloadWarmup  ',
    WORKLOAD_PILOT /*   */ = 'WorkloadPilot   ',
    WORKLOAD_RESULT /*  */ = 'WorkloadResult  ',
}

export class BenchmarkRunner {
    private declare _current: Optional<BenchmarkTask>;

    constructor() {
        this._current = null;
    }

    private benchmarkJitting(
        workload: boolean,
        order: number,
        ops: number,
        jitArgsIter?: Generator<Arguments, void>,
    ): void {
        const testerContext: TesterContext = {
            ops,
            testFn: this._current!.context.testFn,
            workload,

            setup: this._current!.context.setup,
            cleanup: this._current!.context.cleanup,
        };

        let used: Nanosecond = 0;
        if (!jitArgsIter) {
            used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
        } else {
            for (const args of jitArgsIter) {
                testerContext.args = args.args;
                used += Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
            }
        }

        const elapsed = used / ops;

        this.logOpsData(workload ? Stage.JITTING_WORKLOAD : Stage.JITTING_OVERHEAD, order, ops, used, elapsed);
    }

    private benchmarkJitting1(getJitArgsIter?: () => Generator<Arguments, void>): void {
        this.benchmarkJitting(false, 1, 1, getJitArgsIter?.());
        this.benchmarkJitting(true, 1, 1, getJitArgsIter?.());
    }

    private benchmarkJitting2(getJitArgsIter?: () => Generator<Arguments, void>): void {
        this.benchmarkJitting(false, 2, this._current!.settings.initOps, getJitArgsIter?.());
        this.benchmarkJitting(true, 2, this._current!.settings.initOps, getJitArgsIter?.());
    }

    private benchmarkPilot(args?: Arguments): number {
        const testerContext: TesterContext = {
            args: args?.args,
            ops: this._current!.settings.initOps,
            testFn: this._current!.context.testFn,
            workload: true,

            setup: this._current!.context.setup,
            cleanup: this._current!.context.cleanup,
        };

        for (let index = 1; ; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            const elapsed = used / testerContext.ops;

            this.logOpsData(Stage.WORKLOAD_PILOT, index, testerContext.ops, used, elapsed);

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

    private benchmarkWarmup(workload: boolean, ops: number, args?: Arguments): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.context.testFn,
            workload,

            setup: this._current!.context.setup,
            cleanup: this._current!.context.cleanup,
        };

        for (let index = 1; index <= this._current!.settings.warmupCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);
            const elapsed = used / ops;

            this.logOpsData(workload ? Stage.WARMUP_WORKLOAD : Stage.WARMUP_OVERHEAD, index, ops, used, elapsed);

            Time.sleep(this._current!.settings.delay);
        }
    }

    private benchmarkOverheadActual(ops: number, args?: Arguments): Nanosecond {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.context.testFn,
            workload: false,

            setup: this._current!.context.setup,
            cleanup: this._current!.context.cleanup,
        };

        let total: Nanosecond = 0;

        for (let index = 1; index <= this._current!.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            this.logOpsData(Stage.ACTUAL_OVERHEAD, index, ops, used, used / ops);

            total += used;

            Time.sleep(this._current!.settings.delay);
        }

        return total / this._current!.settings.measurementCount;
    }

    private benchmarkWorkloadActual(measurements: Nanosecond[], ops: number, args?: Arguments): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this._current!.context.testFn,
            workload: true,

            setup: this._current!.context.setup,
            cleanup: this._current!.context.cleanup,
        };

        for (let index = 1; index <= this._current!.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this._current!.tester(testerContext).elapsed);

            this.logOpsData(Stage.ACTUAL_WORKLOAD, index, ops, used, used / ops);

            measurements.push(used);

            Time.sleep(this._current!.settings.delay);
        }
    }

    private benchmarkWorkloadResult(measurements: Nanosecond[], overhead: Nanosecond, ops: number): void {
        for (let i = 0; i < measurements.length; i++) {
            measurements[i] = Math.max(measurements[i] - overhead, 0);
            this.logOpsData(Stage.WORKLOAD_RESULT, i + 1, ops, measurements[i], measurements[i] / ops);
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
     * Runs the benchmark task.
     */
    run(task: BenchmarkTask): void {
        this._current = task;

        this._runJitting();

        if (!task.testFnArgStore.hasArgs()) {
            this._runFormal(task.params ?? []);
        } else {
            this._runFormal(task.params ?? [], task.testFnArgStore.args);
        }

        this._current = null;
    }

    private _runJitting(): void {
        const logger = ConsoleLogger.default;

        if (!this._current!.testFnArgStore.hasJitArgs()) {
            this.benchmarkJitting1();
            logger.writeLine();
            this.benchmarkJitting2();
        } else {
            this.benchmarkJitting1(() => this._current!.testFnArgStore.jitArgsList);
            logger.writeLine();
            this.benchmarkJitting2(() => this._current!.testFnArgStore.jitArgsList);
        }
        logger.writeLine();
    }

    private _runFormal(params: readonly unknown[], args?: Arguments): void {
        const logger = ConsoleLogger.default;

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

        const stats = new Statistics(this._current!.context.name, measurements, ops, params, args);
        this._current!.stats.push(stats);
        stats.log();
    }
}
