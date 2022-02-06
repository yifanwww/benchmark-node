import { Arguments } from './ConfigOptions';
import { TestFunction } from './Data';
import { Settings, TestFnOptions } from './options';
import { CodeGen, ConsoleLogger, Formatter, Tester, TesterContext, Time } from './tools';
import { BenchmarkJobCallbacks, BenchmarkJobOptions, Nanosecond, TestFn } from './types';

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

interface BenchmarkRunnerConstructorProps {
    name: string;
    options: BenchmarkJobOptions;
    testFn: TestFn;
}

export class BenchmarkRunner {
    protected _name: string;
    protected testFunction: TestFunction;
    protected tester: Tester;

    protected onComplete: Optional<BenchmarkJobCallbacks['onComplete']>;
    protected onStart: Optional<BenchmarkJobCallbacks['onStart']>;

    protected settings: Settings;
    protected testFnOptions: TestFnOptions;

    public get name(): string {
        return this._name;
    }

    /**
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    constructor(testFn: TestFn, options?: BenchmarkJobOptions);
    /**
     * @param name The name used to identify this test.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    constructor(name: string, testFn: TestFn, options?: BenchmarkJobOptions);

    constructor(...args: [TestFn, BenchmarkJobOptions?] | [string, TestFn, BenchmarkJobOptions?]) {
        const { name, options, testFn } = this.parseArgs(args);

        this._name = name;
        this.testFunction = new TestFunction(testFn);

        const { onComplete = null, onStart = null } = options;

        this.onComplete = onComplete;
        this.onStart = onStart;

        this.settings = new Settings(options);

        this.testFnOptions = new TestFnOptions(options);

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "src/test/perf-DynamicFnCall.ts".
        this.tester = CodeGen.createTester({
            argument: { count: this.testFnOptions.maxArgsLength },
        });
    }

    private parseArgs(
        args: [TestFn, BenchmarkJobOptions?] | [string, TestFn, BenchmarkJobOptions?],
    ): BenchmarkRunnerConstructorProps {
        if (typeof args[0] === 'string') {
            const _args = args as [string, TestFn, BenchmarkJobOptions?];
            return {
                name: _args[0],
                options: _args[2] ?? {},
                testFn: _args[1],
            };
        } else {
            const _args = args as [TestFn, BenchmarkJobOptions?];
            const props: BenchmarkRunnerConstructorProps = {
                name: _args[0].name,
                options: _args[1] ?? {},
                testFn: _args[0],
            };

            if (props.name === '') {
                ConsoleLogger.default.writeLineError('Cannot get name from test fn.');
                throw new Error('Cannot get name from test fn.');
            }

            return props;
        }
    }

    protected logEnvironmentInfos() {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo('// Benchmark Environment Information:');
        logger.writeLineInfo(`//   Node.js ${process.version} (V8 ${process.versions.v8})`);
    }

    protected logConfigs() {
        const { delay, initOps, measurementCount, minMeasurementTime } = this.settings;

        const logger = ConsoleLogger.default;
        logger.writeLineInfo('// Benchmark Configuration:');
        logger.writeLineInfo(`//   delay               : ${Formatter.beautifyNumber(delay)} ns`);
        logger.writeLineInfo(`//   initial ops         : ${Formatter.beautifyNumber(initOps)}`);
        logger.writeLineInfo(`//   measurement count   : ${Formatter.beautifyNumber(measurementCount)}`);
        logger.writeLineInfo(`//   min measurement time: ${Formatter.beautifyNumber(minMeasurementTime)} ns`);
        logger.writeLineInfo(`//   ${this.onComplete ? 'Has' : 'No'} callback \`onComplete\``);
        logger.writeLineInfo(`//   ${this.onStart ? 'Has' : 'No'} callback \`onStart\``);
    }

    private benchmarkJitting(
        workload: boolean,
        order: number,
        ops: number,
        argsGenerator?: Generator<Arguments, void>,
    ): void {
        const testerContext: TesterContext = {
            ops,
            testFn: this.testFunction.fn,
            workload,
        };

        let used: Nanosecond = 0;
        if (!argsGenerator) {
            used = Time.hrtime2ns(this.tester(testerContext).elapsed);
        } else {
            for (const args of argsGenerator) {
                testerContext.args = args.args;
                used += Time.hrtime2ns(this.tester(testerContext).elapsed);
            }
        }

        const elapsed = used / ops;

        this.logOpsData(workload ? Stage.JittingWorkload : Stage.JittingOverhead, order, ops, used, elapsed);
    }

    protected benchmarkJitting1(getArgsGenerator?: () => Generator<Arguments, void>): void {
        this.benchmarkJitting(false, 1, 1, getArgsGenerator?.());
        this.benchmarkJitting(true, 1, 1, getArgsGenerator?.());
    }

    protected benchmarkJitting2(getArgsGenerator?: () => Generator<Arguments, void>): void {
        this.benchmarkJitting(false, 2, this.settings.initOps, getArgsGenerator?.());
        this.benchmarkJitting(true, 2, this.settings.initOps, getArgsGenerator?.());
    }

    protected benchmarkPilot(args?: Arguments): number {
        const testerContext: TesterContext = {
            args: args?.args,
            ops: this.settings.initOps,
            testFn: this.testFunction.fn,
            workload: true,
        };

        for (let index = 1; ; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);

            const elapsed = used / testerContext.ops;

            this.logOpsData(Stage.WorkloadPilot, index, testerContext.ops, used, elapsed);

            // Calculate how many more iterations it will take to achieve the `minTime`.
            // After stage Pilot, we should get a good count number.
            if (used <= this.settings.minMeasurementTime) {
                testerContext.ops += Math.ceil((this.settings.minMeasurementTime - used) / elapsed);
            } else {
                break;
            }

            Time.sleep(this.settings.delay);
        }

        return testerContext.ops;
    }

    protected benchmarkWarmup(workload: boolean, ops: number, args?: Arguments): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this.testFunction.fn,
            workload,
        };

        for (let index = 1; index <= this.settings.warmupCount; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);
            const elapsed = used / ops;

            this.logOpsData(workload ? Stage.WarmupWorkload : Stage.WarmupOverhead, index, ops, used, elapsed);

            Time.sleep(this.settings.delay);
        }
    }

    protected benchmarkOverheadActual(ops: number, args?: Arguments): Nanosecond {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this.testFunction.fn,
            workload: false,
        };

        let total: Nanosecond = 0;

        for (let index = 1; index <= this.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);

            this.logOpsData(Stage.ActualOverhead, index, ops, used, used / ops);

            total += used;

            Time.sleep(this.settings.delay);
        }

        return total / this.settings.measurementCount;
    }

    protected benchmarkWorkloadActual(measurements: Nanosecond[], ops: number, args?: Arguments): void {
        const testerContext: TesterContext = {
            args: args?.args,
            ops,
            testFn: this.testFunction.fn,
            workload: true,
        };

        for (let index = 1; index <= this.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);

            this.logOpsData(Stage.ActualWorkload, index, ops, used, used / ops);

            measurements.push(used);

            Time.sleep(this.settings.delay);
        }
    }

    protected benchmarkWorkloadResult(measurements: Nanosecond[], overhead: Nanosecond, ops: number): void {
        for (let i = 0; i < measurements.length; i++) {
            measurements[i] = Math.max(measurements[i] - overhead, 0);
            this.logOpsData(Stage.WorkloadResult, i + 1, ops, measurements[i], measurements[i] / ops);
        }
    }

    private logOpsData(prefix: Stage, index: number, ops: number, used: Nanosecond, elapsed: Nanosecond) {
        const len = this.settings.measurementCount.toString().length;

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
}
