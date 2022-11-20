import type { Statistics } from '../Data';
import { ConfidenceInterval, ConfidenceLevel } from '../Mathematics';
import { UnitType } from '../Tools/UnitType';

import type { IIndicator } from './IIndicator';
import { Indicator } from './Indicator';

export type Calc = (stats: Statistics) => number;

export class StatisticIndicator implements IIndicator {
    static readonly Mean = new StatisticIndicator(
        Indicator.MEAN,
        'Arithmetic mean of all measurements',
        (stats) => stats.mean,
    );

    static readonly Error = new StatisticIndicator(
        Indicator.ERROR,
        'Half of 95% confidence interval',
        (stats) => stats.confidenceInterval.margin,
    );

    static readonly StdDev = new StatisticIndicator(
        Indicator.STD_DEV,
        'Standard deviation of all measurements',
        (stats) => stats.standardDeviation,
    );

    static readonly StdErr = new StatisticIndicator(
        Indicator.STD_ERR,
        'Standard error of all measurements',
        (stats) => stats.standardError,
    );

    static readonly Min = new StatisticIndicator(Indicator.MIN, 'Minimum measurement', (stats) => stats.min);

    static readonly Q1 = new StatisticIndicator(Indicator.Q1, 'Quartile 1 (25th percentile)', (stats) => stats.q1);

    static readonly Median = new StatisticIndicator(
        Indicator.MEDIAN,
        'Value separating the higher half of all measurements (50th percentile)',
        (stats) => stats.median,
    );

    static readonly Q3 = new StatisticIndicator(Indicator.Q3, 'Quartile 3 (75th percentile)', (stats) => stats.q3);

    static readonly Max = new StatisticIndicator(Indicator.MAX, 'Maximum measurement', (stats) => stats.max);

    static readonly Ops = new StatisticIndicator(
        Indicator.OPS,
        'Operations per second',
        (stats) => stats.ops,
        UnitType.DIMENSIONLESS,
    );

    static readonly Iterations = new StatisticIndicator(
        Indicator.ITERATIONS,
        'Number of target benchmark iterations',
        (stats) => stats.n,
        UnitType.DIMENSIONLESS_INTEGER,
    );

    static CIError(level: ConfidenceLevel = ConfidenceLevel.L95) {
        return new StatisticIndicator(
            `CI${level * 100}% Margin`,
            `Half of ${level * 100}% confidence interval`,
            (stats) => new ConfidenceInterval(stats.n, stats.mean, stats.standardError, level).margin,
        );
    }

    private declare readonly _indicatorName: string;
    private declare readonly _legend: string;
    private declare readonly _unitType: UnitType;

    protected declare _calc: Calc;

    constructor(indicatorName: string, legend: string, calc: Calc, unit: UnitType = UnitType.TIME) {
        this._indicatorName = indicatorName;

        this._legend = legend;
        this._unitType = unit;

        this._calc = calc;
    }

    get id(): string {
        return `${this.constructor.name}.${this._indicatorName}`;
    }

    get indicatorName(): string {
        return this._indicatorName;
    }

    get legend(): string {
        return this._legend;
    }

    get unitType(): UnitType {
        return this._unitType;
    }

    getValue(stats: Statistics): number {
        return this._calc(stats);
    }
}
