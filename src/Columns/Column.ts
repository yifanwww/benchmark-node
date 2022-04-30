import { ConfidenceInterval, ConfidenceLevel } from '../Mathematics';
import { UnitType } from '../Tools/UnitType';
import { ColumnType } from './ColumnType';
import { StatisticColumn } from './StatisticColumn';

function getColumnType(level: ConfidenceLevel): ColumnType {
    let never: never;
    // prettier-ignore
    switch (level) {
        case ConfidenceLevel.L50: return ColumnType.CIErrorL50
        case ConfidenceLevel.L70: return ColumnType.CIErrorL70
        case ConfidenceLevel.L75: return ColumnType.CIErrorL75
        case ConfidenceLevel.L80: return ColumnType.CIErrorL80
        case ConfidenceLevel.L85: return ColumnType.CIErrorL85
        case ConfidenceLevel.L90: return ColumnType.CIErrorL90
        case ConfidenceLevel.L92: return ColumnType.CIErrorL92
        case ConfidenceLevel.L95: return ColumnType.CIErrorL95
        case ConfidenceLevel.L96: return ColumnType.CIErrorL96
        case ConfidenceLevel.L97: return ColumnType.CIErrorL97
        case ConfidenceLevel.L98: return ColumnType.CIErrorL98
        case ConfidenceLevel.L99: return ColumnType.CIErrorL99
        case ConfidenceLevel.L999: return ColumnType.CIErrorL999
        case ConfidenceLevel.L9999: return ColumnType.CIErrorL9999

        default:
            never = level;
            return never;
    }
}

export class Column {
    static readonly Mean = new StatisticColumn(
        ColumnType.Mean,
        'Mean',
        'Arithmetic mean of all measurements',
        (stats) => stats.mean,
        UnitType.Time,
    );

    static readonly Error = new StatisticColumn(
        ColumnType.Error,
        'Error',
        'Half of 95% confidence interval',
        (stats) => stats.confidenceInterval.margin,
        UnitType.Time,
    );

    static readonly StdDev = new StatisticColumn(
        ColumnType.StdDev,
        'StdDev',
        'Standard deviation of all measurements',
        (stats) => stats.standardDeviation,
        UnitType.Time,
    );

    static readonly StdErr = new StatisticColumn(
        ColumnType.StdErr,
        'StdErr',
        'Standard error of all measurements',
        (stats) => stats.standardError,
        UnitType.Time,
    );

    static readonly Min = new StatisticColumn(
        ColumnType.Min,
        'Min',
        'Minimum measurement',
        (stats) => stats.min,
        UnitType.Time,
    );

    static readonly Q1 = new StatisticColumn(
        ColumnType.Q1,
        'Q1',
        'Quartile 1 (25th percentile)',
        (statss) => statss.q1,
        UnitType.Time,
    );

    static readonly Median = new StatisticColumn(
        ColumnType.Median,
        'Median',
        'Value separating the higher half of all measurements (50th percentile)',
        (statss) => statss.median,
        UnitType.Time,
    );

    static readonly Q3 = new StatisticColumn(
        ColumnType.Q3,
        'Q3',
        'Quartile 3 (75th percentile)',
        (stats) => stats.q3,
        UnitType.Time,
    );

    static readonly Max = new StatisticColumn(
        ColumnType.Max,
        'Max',
        'Maximum measurement',
        (stats) => stats.max,
        UnitType.Time,
    );

    static readonly Ops = new StatisticColumn(
        ColumnType.Ops,
        'Op/s',
        'Operations per second',
        (stats) => stats.ops,
        UnitType.Dimensionless,
    );

    static CIError(level: ConfidenceLevel = ConfidenceLevel.L95) {
        return new StatisticColumn(
            getColumnType(level),
            `CI${level * 100}% Margin`,
            `Half of ${level * 100}% confidence interval`,
            (stats) => new ConfidenceInterval(stats.n, stats.mean, stats.standardError, level).margin,
            UnitType.Time,
        );
    }

    static readonly Iterations = new StatisticColumn(
        ColumnType.Iterations,
        'Iterations',
        'Number of target benchmark iterations',
        (stats) => stats.n,
        UnitType.DimensionlessInteger,
    );
}
