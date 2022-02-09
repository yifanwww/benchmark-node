import { Column } from '../ConfigOptions';
import { Stats } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { TimeTool, TimeUnit, TimeUnitStr } from '../Tools/TimeTool';

import { TableColumn, GetData } from './TableColumn';

const perfColumnHeader = {
    [Column.Mean]: 'Mean',
    [Column.StdError]: 'StdErr',
    [Column.StdDev]: 'StdDev',

    [Column.Min]: 'Min',
    [Column.Q1]: 'Q1',
    [Column.Median]: 'Median',
    [Column.Q3]: 'Q3',
    [Column.Max]: 'Max',
};

export class PerfColumn extends TableColumn<number> {
    private _type: Column;

    private _unit: TimeUnit = TimeUnit.NS;
    private _fractionDigit: number = 4;

    public get type() {
        return this._type;
    }

    public setUnit(value: TimeUnit): void {
        this._unit = value;
    }

    public constructor(type: Column, getData: GetData<number>) {
        super(perfColumnHeader[type], getData);

        this._type = type;
    }

    public static column(column: Column): PerfColumn {
        let never: never;
        switch (column) {
            case Column.Mean:
                return new PerfColumn(column, (stats) => stats.mean);
            case Column.StdError:
                return new PerfColumn(column, (stats) => stats.standardError);
            case Column.StdDev:
                return new PerfColumn(column, (stats) => stats.standardDeviation);

            case Column.Min:
                return new PerfColumn(column, (stats) => stats.min);
            case Column.Q1:
                return new PerfColumn(column, (stats) => stats.q1);
            case Column.Median:
                return new PerfColumn(column, (stats) => stats.median);
            case Column.Q3:
                return new PerfColumn(column, (stats) => stats.q3);
            case Column.Max:
                return new PerfColumn(column, (stats) => stats.max);

            default:
                never = column;
                return never;
        }
    }

    protected override getDataWrapper(stats: Stats): string {
        const data = TimeTool.convert(this._getData!(stats), TimeUnit.NS, this._unit);
        return `${Formatter.beautifyNumber(data.toFixed(this._fractionDigit))} ${TimeUnitStr[this._unit]}`;
    }

    public findMinTimeUnit(stats: Stats[]): TimeUnit {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of stats) {
            const data = this._getData!(_stats);
            min = Math.min(min, data);
        }

        if (min <= 1e3) {
            return TimeUnit.NS;
        } else if (min <= 1e6) {
            return TimeUnit.US;
        } else if (min <= 1e9) {
            return TimeUnit.MS;
        } else {
            return TimeUnit.S;
        }
    }

    public findFractionDigit(stats: Stats[]): void {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of stats) {
            const data = TimeTool.convert(this._getData!(_stats), TimeUnit.NS, this._unit);
            min = Math.min(min, data);
        }

        if (min <= 1) {
            this._fractionDigit = 4;
        } else if (min <= 10) {
            this._fractionDigit = 3;
        } else if (min <= 100) {
            this._fractionDigit = 2;
        } else if (min <= 1000) {
            this._fractionDigit = 1;
        } else {
            this._fractionDigit = 0;
        }
    }
}
