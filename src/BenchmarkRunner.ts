import { Benchmark } from './Benchmark';
import { Statistics } from './Data';
import { Arguments } from './Parameterization';
import { TesterContext } from './Tools/CodeGen';
import { ConsoleLogger } from './Tools/ConsoleLogger';
import { Formatter } from './Tools/Formatter';
import { Time } from './Tools/TimeTool';
import { Nanosecond, TestFn } from './types';

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
    public static logEnvironmentInfos() {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo('// Benchmark Environment Information:');
        logger.writeLineInfo(`//   Node.js ${process.version} (V8 ${process.versions.v8})`);
    }

    public static logConfigs(bench: Benchmark<TestFn>) {
        const { delay, initOps, measurementCount, minMeasurementTime } = bench.settings;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo('// Benchmark Configuration:');
        logger.writeLineInfo(`//   delay               : ${Formatter.beautifyNumber(delay)} ns`);
        logger.writeLineInfo(`//   initial ops         : ${Formatter.beautifyNumber(initOps)}`);
        logger.writeLineInfo(`//   measurement count   : ${Formatter.beautifyNumber(measurementCount)}`);
        logger.writeLineInfo(`//   min measurement time: ${Formatter.beautifyNumber(minMeasurementTime)} ns`);
        logger.writeLineInfo(`//   ${bench.testFunction.setup ? 'Has' : 'No'} callback \`setup\``);
        logger.writeLineInfo(`//   ${bench.testFunction.cleanup ? 'Has' : 'No'} callback \`cleanup\``);
    }

    private static benchmarkJitting(
        bench: Benchmark<TestFn>,
        workload: boolean,
        order: number,
        ops: number,
        argsGenerator?: Generator<Arguments<never[]>, void>,
    ): void {
        const testerContext: TesterContext = {
            ops,
            testFn: bench.testFunction.fn,
            workload,

            setup: bench.setup,
            cleanup: bench.cleanup,
        };

        let used: Nanosecond = 0;
        if (!argsGenerator) {
            used = Time.hrtime2ns(bench.tester(testerContext).elapsed);
        } else {
            for (const args of argsGenerator) {
                testerContext.args = args.args;
                used += Time.hrtime2ns(bench.tester(testerContext).elapsed);
            }
        }

        const elapsed = used / ops;

        BenchmarkRunner.logOpsData(
            bench,
            workload ? Stage.JittingWorkload : Stage.JittingOverhead,
            order,
            ops,
            used,
            elapsed,
        );
    }

    public static benchmarkJitting1(
        bench: Benchmark<TestFn>,
        getArgsGenerator?: () => Generator<Arguments<never[]>, void>,
    ): void {
        BenchmarkRunner.benchmarkJitting(bench, false, 1, 1, getArgsGenerator?.());
        BenchmarkRunner.benchmarkJitting(bench, true, 1, 1, getArgsGenerator?.());
    }

    public static benchmarkJitting2(
        bench: Benchmark<TestFn>,
        getArgsGenerator?: () => Generator<Arguments<never[]>, void>,
    ): void {
        BenchmarkRunner.benchmarkJitting(bench, false, 2, bench.settings.initOps, getArgsGenerator?.());
        BenchmarkRunner.benchmarkJitting(bench, true, 2, bench.settings.initOps, getArgsGenerator?.());
    }

    public static benchmarkPilot(bench: Benchmark<TestFn>, args?: Arguments<never[]>): number {
        const testerContext: TesterContext = {
            args: args?.args,
            ops: bench.settings.initOps,
            testFn: bench.testFunction.fn,
            workload: true,

            setup: bench.setup,
            cleanup: bench.cleanup,
        };

        for (let index = 1; ; index++) {
            const used = Time.hrtime2ns(bench.tester(testerContext).elapsed);

            const elapsed = used / testerContext.ops;

            BenchmarkRunner.logOpsData(bench, Stage.WorkloadPilot, index, testerContext.ops, used, elapsed);

            // Calculate how many more iterations it will take to achieve the `minTime`.
            // After stage Pilot, we should get a good count number.
            if (used <= bench.settings.minMeasurementTime) {
                testerContext.ops += Math.ceil((bench.settings.minMeasurementTime - used) / elapsed);
            } else {
                break;
            }

            Time.sleep(bench.settings.delay);
        }

        return testerContext.ops;
    }

    public static benchmarkWarmup(
        bench: Benchmark<TestFn>,
        workload: boolean,
        ops: number,
        args?: Arguments<never[]>,
    ): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: bench.testFunction.fn,
            workload,

            setup: bench.setup,
            cleanup: bench.cleanup,
        };

        for (let index = 1; index <= bench.settings.warmupCount; index++) {
            const used = Time.hrtime2ns(bench.tester(testerContext).elapsed);
            const elapsed = used / ops;

            BenchmarkRunner.logOpsData(
                bench,
                workload ? Stage.WarmupWorkload : Stage.WarmupOverhead,
                index,
                ops,
                used,
                elapsed,
            );

            Time.sleep(bench.settings.delay);
        }
    }

    public static benchmarkOverheadActual(
        bench: Benchmark<TestFn>,
        ops: number,
        args?: Arguments<never[]>,
    ): Nanosecond {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: bench.testFunction.fn,
            workload: false,

            setup: bench.setup,
            cleanup: bench.cleanup,
        };

        let total: Nanosecond = 0;

        for (let index = 1; index <= bench.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(bench.tester(testerContext).elapsed);

            BenchmarkRunner.logOpsData(bench, Stage.ActualOverhead, index, ops, used, used / ops);

            total += used;

            Time.sleep(bench.settings.delay);
        }

        return total / bench.settings.measurementCount;
    }

    public static benchmarkWorkloadActual(
        bench: Benchmark<TestFn>,
        measurements: Nanosecond[],
        ops: number,
        args?: Arguments<never[]>,
    ): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: bench.testFunction.fn,
            workload: true,

            setup: bench.setup,
            cleanup: bench.cleanup,
        };

        for (let index = 1; index <= bench.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(bench.tester(testerContext).elapsed);

            BenchmarkRunner.logOpsData(bench, Stage.ActualWorkload, index, ops, used, used / ops);

            measurements.push(used);

            Time.sleep(bench.settings.delay);
        }
    }

    public static benchmarkWorkloadResult(
        bench: Benchmark<TestFn>,
        measurements: Nanosecond[],
        overhead: Nanosecond,
        ops: number,
    ): void {
        for (let i = 0; i < measurements.length; i++) {
            measurements[i] = Math.max(measurements[i] - overhead, 0);
            BenchmarkRunner.logOpsData(bench, Stage.WorkloadResult, i + 1, ops, measurements[i], measurements[i] / ops);
        }
    }

    private static logOpsData(
        bench: Benchmark<TestFn>,
        prefix: Stage,
        index: number,
        ops: number,
        used: Nanosecond,
        elapsed: Nanosecond,
    ) {
        const len = bench.settings.measurementCount.toString().length;

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
     * @returns The benchmark instance.
     */
    public static run(bench: Benchmark<TestFn>): void {
        const logger = ConsoleLogger.default;
        logger.writeLineHeader('// *************************');
        logger.writeLineHeader(`// Benchmark: ${bench.name}`);

        BenchmarkRunner.logEnvironmentInfos();
        BenchmarkRunner.logConfigs(bench);
        logger.writeLine();

        if (bench.testFunction.jitArgsCount === 0) {
            BenchmarkRunner.benchmarkJitting1(bench);
            logger.writeLine();
            BenchmarkRunner.benchmarkJitting2(bench);
        } else {
            BenchmarkRunner.benchmarkJitting1(bench, bench.testFunction.getJitArgsGenerator);
            logger.writeLine();
            BenchmarkRunner.benchmarkJitting2(bench, bench.testFunction.getJitArgsGenerator);
        }
        logger.writeLine();

        if (bench.testFunction.argsCount === 0) {
            BenchmarkRunner._run(bench);
        } else {
            for (const args of bench.testFunction.args) {
                BenchmarkRunner._run(bench, args);
            }
        }
    }

    private static _run(bench: Benchmark<TestFn>, args?: Arguments<never[]>): void {
        const logger = ConsoleLogger.default;

        if (args) {
            logger.writeLineInfo(`// arguments: ${args.args.map((arg) => Formatter.limitStringLength(String(arg)))}`);
            logger.writeLine();
        }

        const ops = BenchmarkRunner.benchmarkPilot(bench, args);
        logger.writeLine();

        BenchmarkRunner.benchmarkWarmup(bench, false, ops, args);
        logger.writeLine();

        const overhead = BenchmarkRunner.benchmarkOverheadActual(bench, ops, args);
        logger.writeLine();

        BenchmarkRunner.benchmarkWarmup(bench, true, ops, args);
        logger.writeLine();

        const measurements: Nanosecond[] = [];
        BenchmarkRunner.benchmarkWorkloadActual(bench, measurements, ops, args);
        logger.writeLine();

        BenchmarkRunner.benchmarkWorkloadResult(bench, measurements, overhead, ops);
        logger.writeLine();

        const stats = new Statistics(bench.name, measurements, ops, args);
        bench.stats.push(stats);
        stats.log();
    }
}
