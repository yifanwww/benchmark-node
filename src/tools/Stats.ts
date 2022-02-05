import { ConfidenceInterval, _Nanosecond } from '../types.internal';

import { ConsoleLogger } from './ConsoleLogger';
import { Formatter } from './Formatter';
import { MathTool } from './MathTool';
import { Time } from './TimeTool';

/**
 * Class for stats including mean, margin or error, and standard deviation.
 */
export class Stats {
    private _name: string;

    private _n: number;

    private _mean: _Nanosecond;
    private _variance: number;
    private _standardDeviation: _Nanosecond;
    private _standardError: _Nanosecond;
    private _standardErrorPercent: number;

    private _confidenceInterval: ConfidenceInterval;
    private _ciMargin: _Nanosecond;
    private _ciMarginPercent: number;

    private _q0: _Nanosecond;
    private _q1: _Nanosecond;
    private _q2: _Nanosecond;
    private _q3: _Nanosecond;
    private _q4: _Nanosecond;

    private _ops: number;

    public get name() {
        return this._name;
    }

    /**
     * The measurements count.
     */
    public get n() {
        return this._n;
    }

    /**
     * The arithmetic mean of measurements in nanoseconds.
     */
    public get mean() {
        return this._mean;
    }

    /**
     * The variance of measurements.
     */
    public get variance() {
        return this._variance;
    }

    /**
     * The standard deviation of measurements.
     */
    public get standardDeviation() {
        return this._standardDeviation;
    }

    /**
     * The standard error of measurements in nanoseconds.
     */
    public get standardError() {
        return this._standardError;
    }

    /**
     * The margin of error in nanoseconds.
     */
    public get margin() {
        return this._ciMargin;
    }

    public get confidenceInterval() {
        return this._confidenceInterval;
    }

    public get min() {
        return this._q0;
    }

    public get q1() {
        return this._q1;
    }

    public get median() {
        return this._q2;
    }

    public get q3() {
        return this._q3;
    }

    public get max() {
        return this._q4;
    }

    /**
     * The number of executions per second.
     */
    public get ops(): number {
        return this._ops;
    }

    public constructor(name: string, measurements: _Nanosecond[], ops: number) {
        this._name = name;

        measurements.sort((a, b) => a - b);
        measurements = measurements.map((used) => Time.ns(used / ops));

        this._n = measurements.length;

        this._mean = MathTool.mean(measurements);
        this._variance = MathTool.variance(measurements, this._mean);
        this._standardDeviation = Math.sqrt(this._variance) as _Nanosecond;
        this._standardError = (this._standardDeviation / Math.sqrt(this._n)) as _Nanosecond;
        this._standardErrorPercent = (this._standardError / this._mean) * 100;

        const criticalValue = MathTool.getTDistributionCriticalValue(this._n - 1);
        this._ciMargin = (this._standardError * criticalValue) as _Nanosecond;
        this._confidenceInterval = [this._mean - this._ciMargin, this._mean + this._ciMargin] as ConfidenceInterval;
        this._ciMarginPercent = (this._ciMargin / this._mean) * 100;

        this._q0 = measurements[0];
        this._q1 = measurements[Math.round(this._n * 0.25)];
        this._q2 = measurements[Math.round(this._n * 0.5)];
        this._q3 = measurements[Math.round(this._n * 0.75)];
        this._q4 = measurements[this._n - 1];

        this._ops = 1e9 / this._mean;
    }

    public toString(order?: number): string {
        const opsStr = Formatter.beautifyNumber(this._ops.toFixed(this._ops < 100 ? 2 : 0));
        const rmeStr = this._ciMarginPercent.toFixed(2);

        return [
            order === undefined ? '' : `${order}: `,
            `${opsStr} ops/sec`,
            ` ${rmeStr}%`,
            ` (${this._n} sample${this._n > 1 ? 's' : ''})`,
        ].join('');
    }

    public log(): void {
        const logger = ConsoleLogger.default;

        logger.writeLineStatistic(
            [
                `Mean = ${this._mean.toFixed(3)} ns`,
                `StdErr = ${this._standardError.toFixed(3)} ns (${this._standardErrorPercent.toFixed(2)}%)`,
                `N = ${this._n}`,
                `StdDev = ${this._standardDeviation.toFixed(3)} ns`,
            ].join(', '),
        );

        logger.writeLineStatistic(
            [
                `Min = ${this._q0.toFixed(3)} ns`,
                `Q1 = ${this._q1.toFixed(3)} ns`,
                `Median = ${this._q2.toFixed(3)}`,
                `Q3 = ${this._q3.toFixed(3)} ns`,
                `Max = ${this._q4.toFixed(3)} ns`,
            ].join(', '),
        );

        const [left, right] = this._confidenceInterval;
        logger.writeLineStatistic(
            [
                `ConfidenceInterval = [${left.toFixed(3)} ns; ${right.toFixed(3)} ns] (CI 95%)`,
                `Margin = ${this._ciMargin.toFixed(3)} ns (${this._ciMarginPercent.toFixed(2)}% of Mean)`,
            ].join(', '),
        );

        logger.writeLine();
    }
}
