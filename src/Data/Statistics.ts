import { ConfidenceInterval, ConfidenceLevel, Mathematics } from '../Mathematics';
import { Arguments } from '../Parameterization';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { Nanosecond } from '../types';
import { Optional } from '../types.internal';

/**
 * Class for stats including mean, margin or error, and standard deviation.
 */
export class Statistics {
    private declare _name: string;

    private declare _params: Optional<readonly unknown[]>;
    private declare _args?: Arguments;

    private declare _n: number;

    private declare _mean: Nanosecond;
    private declare _variance: number;
    private declare _standardDeviation: Nanosecond;
    private declare _standardError: Nanosecond;
    private declare _standardErrorPercent: number;

    private declare _ci: ConfidenceInterval;

    private declare _q0: Nanosecond;
    private declare _q1: Nanosecond;
    private declare _q2: Nanosecond;
    private declare _q3: Nanosecond;
    private declare _q4: Nanosecond;

    private declare _ops: number;

    get name() {
        return this._name;
    }

    get params() {
        return this._params;
    }

    get args() {
        return this._args;
    }

    /**
     * The measurements count.
     */
    get n() {
        return this._n;
    }

    /**
     * The arithmetic mean of measurements in nanoseconds.
     */
    get mean() {
        return this._mean;
    }

    /**
     * The variance of measurements.
     */
    get variance() {
        return this._variance;
    }

    /**
     * The standard deviation of measurements.
     */
    get standardDeviation() {
        return this._standardDeviation;
    }

    /**
     * The standard error of measurements in nanoseconds.
     */
    get standardError() {
        return this._standardError;
    }

    get confidenceInterval() {
        return this._ci;
    }

    get min() {
        return this._q0;
    }

    get q1() {
        return this._q1;
    }

    get median() {
        return this._q2;
    }

    get q3() {
        return this._q3;
    }

    get max() {
        return this._q4;
    }

    /**
     * The number of executions per second.
     */
    get ops(): number {
        return this._ops;
    }

    constructor(
        name: string,
        measurements: Nanosecond[],
        ops: number,
        params: Optional<readonly unknown[]>,
        args?: Arguments,
    ) {
        this._name = name;

        this._params = params;
        this._args = args;

        measurements.sort((a, b) => a - b);
        measurements = measurements.map((used) => used / ops);

        this._n = measurements.length;

        this._mean = Mathematics.mean(measurements);
        this._variance = Mathematics.variance(measurements, this._mean);
        this._standardDeviation = Math.sqrt(this._variance);
        this._standardError = this._standardDeviation / Math.sqrt(this._n);
        this._standardErrorPercent = (this._standardError / this._mean) * 100;

        this._ci = new ConfidenceInterval(this._n, this._mean, this._standardError, ConfidenceLevel.L95);

        this._q0 = measurements[0];
        this._q1 = measurements[Math.round(this._n * 0.25)];
        this._q2 = measurements[Math.round(this._n * 0.5)];
        this._q3 = measurements[Math.round(this._n * 0.75)];
        this._q4 = measurements[this._n - 1];

        this._ops = 1e9 / this._mean;
    }

    log(): void {
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

        const [lower, upper] = [this._ci.lower, this._ci.upper];
        const margin = this._ci.margin.toFixed(3);
        const marginPercent = this._ci.marginPercent.toFixed(2);
        logger.writeLineStatistic(
            [
                `ConfidenceInterval = [${lower.toFixed(3)} ns; ${upper.toFixed(3)} ns] (CI ${this._ci.level * 100}%)`,
                `Margin = ${margin} ns (${marginPercent}% of Mean)`,
            ].join(', '),
        );

        logger.writeLine();
    }
}
