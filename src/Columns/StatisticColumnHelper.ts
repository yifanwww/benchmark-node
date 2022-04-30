import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { TimeTool } from '../Tools/TimeTool';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';
import { UnitType } from '../Tools/UnitType';
import { BaseColumnHelper } from './BaseColumnHelper';
import { StatisticColumn } from './StatisticColumn';

export class StatisticColumnHelper extends BaseColumnHelper<number> {
    protected declare _column: StatisticColumn;

    private declare _timeUnit: TimeUnit;
    private declare _fractionDigit: number;

    override get column() {
        return this._column;
    }

    get timeUnit() {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }

    constructor(column: StatisticColumn) {
        super(column);

        this._timeUnit = TimeUnit.NS;
        this._fractionDigit = 4;
    }

    setFractionDigit(fractionDigit: number): void {
        this._fractionDigit = fractionDigit;
    }

    /** @deprecated */
    findMinNumber(statsArr: readonly Statistics[]): number {
        let min = Number.MAX_SAFE_INTEGER;

        for (const stats of statsArr) {
            const data = this._column.getData(stats);
            min = Math.min(min, data);
        }

        return min;
    }

    /** @deprecated */
    findFractionDigit(statsArr: readonly Statistics[]): void {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of statsArr) {
            let data = this._column.getData(_stats);
            if (this._column.unitType === UnitType.Time) {
                data = TimeTool.convert(data, TimeUnit.NS, this._timeUnit);
            }
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

    /** @deprecated */
    override format(stats: Statistics): string {
        switch (this._column.unitType) {
            case UnitType.Dimensionless: {
                const data = this._column.getData(stats);
                return Formatter.beautifyNumber(data.toFixed(this._fractionDigit));
            }

            case UnitType.DimensionlessInteger: {
                const data = this._column.getData(stats);
                return Formatter.beautifyNumber(Math.round(data));
            }

            case UnitType.Origin:
                return String(this._column.getData(stats));

            case UnitType.Time: {
                const data = TimeTool.convert(this._column.getData(stats), TimeUnit.NS, this._timeUnit);
                const num = Formatter.beautifyNumber(data.toFixed(this._fractionDigit));
                return `${num} ${TimeUnitHelper.getUnitStr(this._timeUnit)}`;
            }
        }
    }
}
