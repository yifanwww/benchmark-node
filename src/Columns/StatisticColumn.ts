import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { TimeTool } from '../Tools/TimeTool';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';

import { TableColumn } from './TableColumn';
import { UnitType } from './UnitType';

export type Calc = (stats: Statistics) => number;

export class StatisticColumn extends TableColumn<number> {
    private _desc: string;
    private _unit: UnitType;

    private _timeUnit: TimeUnit = TimeUnit.NS;
    private _fractionDigit: number = 4;

    public get desc() {
        return this._desc;
    }

    public get unit() {
        return this._unit;
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

    public constructor(columnName: string, desc: string, calc: Calc, unit: UnitType) {
        super(columnName, calc);

        this._desc = desc;
        this._unit = unit;
    }

    public override format(stats: Statistics): string {
        const data = TimeTool.convert(this._getData!(stats), TimeUnit.NS, this._timeUnit);
        return Formatter.beautifyNumber(data.toFixed(this._fractionDigit)) + TimeUnitHelper.getUnitStr(this._timeUnit);
    }
}
