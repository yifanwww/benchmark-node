import { ConfidenceInterval, ConfidenceLevel } from '../Mathematics';

import { StatisticColumn } from './StatisticColumn';
import { UnitType } from './UnitType';

export class Column {
    public static readonly Mean = new StatisticColumn(
        'Mean',
        'Arithmetic mean of all measurements',
        (stats) => stats.mean,
        UnitType.Time,
    );

    public static readonly Error = new StatisticColumn(
        'Error',
        'Half of 95% confidence interval',
        (stats) => stats.confidenceInterval.margin,
        UnitType.Time,
    );

    public static readonly StdDev = new StatisticColumn(
        'StdDev',
        'Standard deviation of all measurements',
        (stats) => stats.standardDeviation,
        UnitType.Time,
    );

    public static readonly StdErr = new StatisticColumn(
        'StdErr',
        'Standard error of all measurements',
        (stats) => stats.standardError,
        UnitType.Time,
    );

    public static readonly Min = new StatisticColumn('Min', 'Minimum measurement', (stats) => stats.min, UnitType.Time);

    public static readonly Q1 = new StatisticColumn(
        'Q1',
        'Quartile 1 (25th percentile)',
        (statss) => statss.q1,
        UnitType.Time,
    );

    public static readonly Median = new StatisticColumn(
        'Median',
        'Value separating the higher half of all measurements (50th percentile)',
        (statss) => statss.median,
        UnitType.Time,
    );

    public static readonly Q3 = new StatisticColumn(
        'Q3',
        'Quartile 3 (75th percentile)',
        (stats) => stats.q3,
        UnitType.Time,
    );

    public static readonly Max = new StatisticColumn('Max', 'Maximum measurement', (stats) => stats.max, UnitType.Time);

    public static readonly Ops = new StatisticColumn(
        'Op/s',
        'Operations per second',
        (stats) => stats.ops,
        UnitType.Dimensionless,
    );

    public static CIError(level: ConfidenceLevel = ConfidenceLevel.L95) {
        return new StatisticColumn(
            `CI${level * 100}% Margin`,
            `Half of ${level * 100}% confidence interval`,
            (stats) => new ConfidenceInterval(stats.n, stats.mean, stats.standardError, level).margin,
            UnitType.Time,
        );
    }

    public static readonly Iterations = new StatisticColumn(
        'Iterations',
        'Number of target benchmark iterations',
        (stats) => stats.n,
        UnitType.DimensionlessInteger,
    );
}
