import { ConfidenceInterval, ConfidenceLevel } from '../Mathematics';
import { UnitType } from '../Tools/UnitType';

import { ColumnType } from './ColumnType';
import { StatisticColumn } from './StatisticColumn';

function getColumnType(level: ConfidenceLevel): ColumnType {
    let never: never;
    // prettier-ignore
    switch (level) {
        case ConfidenceLevel.L50: return ColumnType.CI_ERROR_L50
        case ConfidenceLevel.L70: return ColumnType.CI_ERROR_L70
        case ConfidenceLevel.L75: return ColumnType.CI_ERROR_L75
        case ConfidenceLevel.L80: return ColumnType.CI_ERROR_L80
        case ConfidenceLevel.L85: return ColumnType.CI_ERROR_L85
        case ConfidenceLevel.L90: return ColumnType.CI_ERROR_L90
        case ConfidenceLevel.L92: return ColumnType.CI_ERROR_L92
        case ConfidenceLevel.L95: return ColumnType.CI_ERROR_L95
        case ConfidenceLevel.L96: return ColumnType.CI_ERROR_L96
        case ConfidenceLevel.L97: return ColumnType.CI_ERROR_L97
        case ConfidenceLevel.L98: return ColumnType.CI_ERROR_L98
        case ConfidenceLevel.L99: return ColumnType.CI_ERROR_L99
        case ConfidenceLevel.L999: return ColumnType.CI_ERROR_L999
        case ConfidenceLevel.L9999: return ColumnType.CI_ERROR_L9999

        default:
            never = level;
            return never;
    }
}

export class Column {
    static readonly Mean = new StatisticColumn(
        ColumnType.MEAN,
        'Mean',
        'Arithmetic mean of all measurements',
        (stats) => stats.mean,
        UnitType.TIME,
    );

    static readonly Error = new StatisticColumn(
        ColumnType.ERROR,
        'Error',
        'Half of 95% confidence interval',
        (stats) => stats.confidenceInterval.margin,
        UnitType.TIME,
    );

    static readonly StdDev = new StatisticColumn(
        ColumnType.STD_DEV,
        'StdDev',
        'Standard deviation of all measurements',
        (stats) => stats.standardDeviation,
        UnitType.TIME,
    );

    static readonly StdErr = new StatisticColumn(
        ColumnType.STD_ERR,
        'StdErr',
        'Standard error of all measurements',
        (stats) => stats.standardError,
        UnitType.TIME,
    );

    static readonly Min = new StatisticColumn(
        ColumnType.MIN,
        'Min',
        'Minimum measurement',
        (stats) => stats.min,
        UnitType.TIME,
    );

    static readonly Q1 = new StatisticColumn(
        ColumnType.Q1,
        'Q1',
        'Quartile 1 (25th percentile)',
        (statss) => statss.q1,
        UnitType.TIME,
    );

    static readonly Median = new StatisticColumn(
        ColumnType.MEDIAN,
        'Median',
        'Value separating the higher half of all measurements (50th percentile)',
        (statss) => statss.median,
        UnitType.TIME,
    );

    static readonly Q3 = new StatisticColumn(
        ColumnType.Q3,
        'Q3',
        'Quartile 3 (75th percentile)',
        (stats) => stats.q3,
        UnitType.TIME,
    );

    static readonly Max = new StatisticColumn(
        ColumnType.MAX,
        'Max',
        'Maximum measurement',
        (stats) => stats.max,
        UnitType.TIME,
    );

    static readonly Ops = new StatisticColumn(
        ColumnType.OPS,
        'Op/s',
        'Operations per second',
        (stats) => stats.ops,
        UnitType.DIMENSIONLESS,
    );

    static CIError(level: ConfidenceLevel = ConfidenceLevel.L95) {
        return new StatisticColumn(
            getColumnType(level),
            `CI${level * 100}% Margin`,
            `Half of ${level * 100}% confidence interval`,
            (stats) => new ConfidenceInterval(stats.n, stats.mean, stats.standardError, level).margin,
            UnitType.TIME,
        );
    }

    static readonly Iterations = new StatisticColumn(
        ColumnType.ITERATIONS,
        'Iterations',
        'Number of target benchmark iterations',
        (stats) => stats.n,
        UnitType.DIMENSIONLESS_INTEGER,
    );
}
