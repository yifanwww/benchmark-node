import { StagePrefix } from './Enums';
import { Settings, TestFnOptions } from './options';
import { CodeGen, Tester, TesterContext } from './tools/CodeGen';
import { ConsoleLogger } from './tools/ConsoleLogger';
import { Formatter } from './tools/Formatter';
import { Time } from './tools/TimeTool';
import { BenchmarkJobCallbacks, BenchmarkJobOptions, TestFn } from './types';
import { _Arguments, _Nanosecond } from './types.internal';

export class BenchmarkRunner {
    protected _name: string;
    protected testFn: TestFn;
    protected tester: Tester;

    protected onComplete: Optional<BenchmarkJobCallbacks['onComplete']>;
    protected onStart: Optional<BenchmarkJobCallbacks['onStart']>;

    protected settings: Settings;
    protected testFnOptions: TestFnOptions;

    public get name(): string {
        return this._name;
    }

    /**
     * @param name The name used to identify this test.
     * @param testFn The function to benchmark.
     * @param options The options of benchmark.
     */
    constructor(name: string, testFn: TestFn, options: BenchmarkJobOptions = {}) {
        this._name = name;
        this.testFn = testFn;

        const { onComplete = null, onStart = null } = options;

        this.onComplete = onComplete;
        this.onStart = onStart;

        this.settings = new Settings(options);

        this.testFnOptions = new TestFnOptions(options);

        // Gets a totally new function to test the performance of `testFn`.
        // Passing different callbacks into one same function who calls the callbacks will cause a optimization problem.
        // See "src/test/dynamicCall.ts".
        this.tester = CodeGen.createTester({
            argument: { count: this.testFnOptions.argsLength },
        });
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
        prefix: StagePrefix,
        order: number,
        ops: number,
        argsGenerator?: Generator<_Arguments, void>,
    ): void {
        const testerContext: TesterContext = {
            ops,
            testFn: this.testFn,
        };

        if (!argsGenerator) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);
            const elapsed = Time.ns(used / ops);

            this.logOpsData(prefix, order, ops, used, elapsed);
        } else {
            let used: _Nanosecond = Time.ns(0);
            for (const args of argsGenerator) {
                testerContext.args = args;
                used = Time.hrtime2ns(this.tester(testerContext).elapsed);
            }
            const elapsed = Time.ns(used / ops);

            this.logOpsData(prefix, order, ops, used, elapsed);
        }
    }

    protected benchmarkJitting1(prefix: StagePrefix, argsGenerator?: Generator<_Arguments, void>): void {
        this.benchmarkJitting(prefix, 1, 1, argsGenerator);
    }

    protected benchmarkJitting2(prefix: StagePrefix, argsGenerator?: Generator<_Arguments, void>): void {
        this.benchmarkJitting(prefix, 2, this.settings.initOps, argsGenerator);
    }

    protected benchmarkPilot(prefix: StagePrefix, args?: _Arguments): number {
        const testerContext: TesterContext = {
            args,
            ops: this.settings.initOps,
            testFn: this.testFn,
        };

        for (let index = 1; ; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);

            const elapsed = Time.ns(used / testerContext.ops);

            this.logOpsData(prefix, index, testerContext.ops, used, elapsed);

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

    protected benchmarkFormal(prefix: StagePrefix, measurements: _Nanosecond[], ops: number, args?: _Arguments): void {
        const testerContext: TesterContext = {
            args,
            ops,
            testFn: this.testFn,
        };

        for (let index = 1; index <= this.settings.measurementCount; index++) {
            const used = Time.hrtime2ns(this.tester(testerContext).elapsed);
            const elapsed = Time.ns(used / ops);

            this.logOpsData(prefix, index, ops, used, elapsed);

            measurements.push(elapsed);

            Time.sleep(this.settings.delay);
        }
    }

    private logOpsData(prefix: StagePrefix, index: number, ops: number, used: _Nanosecond, elapsed: _Nanosecond) {
        const len = this.settings.measurementCount.toString().length;

        ConsoleLogger.default.writeLine(
            [
                prefix,
                `${index.toString().padStart(len)}: `,
                `${ops} op, `,
                `${used} ns, `,
                `${elapsed.toFixed(4)} ns/op`,
            ].join(''),
        );
    }
}
