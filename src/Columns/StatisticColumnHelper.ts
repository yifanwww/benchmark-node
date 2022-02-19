import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { TimeTool } from '../Tools/TimeTool';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';

import { StatisticColumn } from './StatisticColumn';
import { TableColumnHelper } from './TableColumnHelper';
import { UnitType } from './UnitType';

export class StatisticColumnHelper extends TableColumnHelper<number> {
    protected declare _column: StatisticColumn;

    private _timeUnit: TimeUnit = TimeUnit.NS;
    private _fractionDigit: number = 4;

    public override get column() {
        return this._column;
    }

    public get timeUnit() {
        return this._timeUnit;
    }

    public set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }

    public setFractionDigit(fractionDigit: number): void {
        this._fractionDigit = fractionDigit;
    }

    public constructor(column: StatisticColumn) {
        super(column);
    }

    public findMinNumber(statsArr: Statistics[]): number {
        let min = Number.MAX_SAFE_INTEGER;

        for (const stats of statsArr) {
            const data = this._column.getData(stats);
            min = Math.min(min, data);
        }

        return min;
    }

    public findFractionDigit(statsArr: Statistics[]): void {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of statsArr) {
            const data = TimeTool.convert(this._column.getData(_stats), TimeUnit.NS, this._timeUnit);
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

    public override format(stats: Statistics): string {
        let never: never;
        switch (this._column.unit) {
            case UnitType.Dimensionless: {
                const data = this._column.getData(stats);
                return Formatter.beautifyNumber(data.toFixed(this._fractionDigit));
            }

            case UnitType.Time: {
                const data = TimeTool.convert(this._column.getData(stats), TimeUnit.NS, this._timeUnit);
                const num = Formatter.beautifyNumber(data.toFixed(this._fractionDigit));
                return `${num} ${TimeUnitHelper.getUnitStr(this._timeUnit)}`;
            }

            default:
                never = this._column.unit;
                return never;
        }
    }
}
