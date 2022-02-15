import { ConfidenceInterval, ConfidenceLevel } from '../Mathematics';

import { StatisticColumn } from './StatisticColumn';
import { UnitType } from './UnitType';

export class Column {
    public static readonly Mean = new StatisticColumn(
        'Mean',
        'Arithmetic mean of all measurements',
        (stats) => stats.mean,
        UnitType.Dimensionless,
    );

    public static readonly Error = new StatisticColumn(
        'Error',
        'Half of 99.9% confidence interval',
        (stats) => new ConfidenceInterval(stats.n, stats.mean, stats.standardError, ConfidenceLevel.L999).margin,
        UnitType.Dimensionless,
    );

    public static readonly StdDev = new StatisticColumn(
        'StdDev',
        'Standard deviation of all measurements',
        (stats) => stats.standardDeviation,
        UnitType.Dimensionless,
    );

    public static readonly StdErr = new StatisticColumn(
        'StdErr',
        'Standard error of all measurements',
        (stats) => stats.standardError,
        UnitType.Dimensionless,
    );

    public static readonly Min = new StatisticColumn(
        'Min',
        'Minimum measurement',
        (stats) => stats.min,
        UnitType.Dimensionless,
    );

    public static readonly Q1 = new StatisticColumn(
        'Q1',
        'Quartile 1 (25th percentile)',
        (statss) => statss.q1,
        UnitType.Dimensionless,
    );

    public static readonly Median = new StatisticColumn(
        'Median',
        'Value separating the higher half of all measurements (50th percentile)',
        (statss) => statss.median,
        UnitType.Dimensionless,
    );

    public static readonly Q3 = new StatisticColumn(
        'Q3',
        'Quartile 3 (75th percentile)',
        (stats) => stats.q3,
        UnitType.Dimensionless,
    );

    public static readonly Max = new StatisticColumn(
        'Max',
        'Maximum measurement',
        (stats) => stats.max,
        UnitType.Dimensionless,
    );
}
