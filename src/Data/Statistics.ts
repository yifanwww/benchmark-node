import { Arguments } from '../ConfigOptions';
import { ConfidenceInterval, ConfidenceLevel, Mathematics } from '../Mathematics';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { Nanosecond } from '../types';

/**
 * Class for stats including mean, margin or error, and standard deviation.
 */
export class Statistics {
    private _name: string;

    private _args?: Arguments<ReadonlyArray<unknown>>;

    private _n: number;

    private _mean: Nanosecond;
    private _variance: number;
    private _standardDeviation: Nanosecond;
    private _standardError: Nanosecond;
    private _standardErrorPercent: number;

    private _confidenceInterval: ConfidenceInterval;

    private _q0: Nanosecond;
    private _q1: Nanosecond;
    private _q2: Nanosecond;
    private _q3: Nanosecond;
    private _q4: Nanosecond;

    private _ops: number;

    public get name() {
        return this._name;
    }

    public get args() {
        return this._args;
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
        return this._confidenceInterval.margin;
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

    public constructor(
        name: string,
        measurements: Nanosecond[],
        ops: number,
        args?: Arguments<ReadonlyArray<unknown>>,
    ) {
        this._name = name;
        this._args = args;

        measurements.sort((a, b) => a - b);
        measurements = measurements.map((used) => used / ops);

        this._n = measurements.length;

        this._mean = Mathematics.mean(measurements);
        this._variance = Mathematics.variance(measurements, this._mean);
        this._standardDeviation = Math.sqrt(this._variance);
        this._standardError = this._standardDeviation / Math.sqrt(this._n);
        this._standardErrorPercent = (this._standardError / this._mean) * 100;

        this._confidenceInterval = new ConfidenceInterval(
            this._n,
            this._mean,
            this._standardError,
            ConfidenceLevel.L95,
        );

        this._q0 = measurements[0];
        this._q1 = measurements[Math.round(this._n * 0.25)];
        this._q2 = measurements[Math.round(this._n * 0.5)];
        this._q3 = measurements[Math.round(this._n * 0.75)];
        this._q4 = measurements[this._n - 1];

        this._ops = 1e9 / this._mean;
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

        const [lower, upper] = [this._confidenceInterval.lower, this._confidenceInterval.upper];
        const margin = this._confidenceInterval.margin.toFixed(3);
        const marginPercent = this._confidenceInterval.marginPercent.toFixed(2);
        logger.writeLineStatistic(
            [
                `ConfidenceInterval = [${lower.toFixed(3)} ns; ${upper.toFixed(3)} ns] (CI 95%)`,
                `Margin = ${margin} ns (${marginPercent}% of Mean)`,
            ].join(', '),
        );

        logger.writeLine();
    }
}
