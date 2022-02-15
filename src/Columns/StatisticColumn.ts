import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { TimeTool, TimeUnit, TimeUnitStr } from '../Tools/TimeTool';

import { GetData, TableColumn } from './TableColumn';
import { UnitType } from './UnitType';

export class StatisticColumn extends TableColumn<number> {
    private _desc: string;
    private _unit: UnitType;

    private _timeUnit: TimeUnit = TimeUnit.NS;
    private _fractionDigit: number = 4;

    public get columnName() {
        return this._columnName;
    }

    public get desc() {
        return this._desc;
    }

    public get getData() {
        return this._getData;
    }

    public get unit() {
        return this._unit;
    }

    public constructor(columnName: string, desc: string, getData: GetData<number>, unit: UnitType) {
        super(columnName, getData);

        this._desc = desc;
        this._unit = unit;
    }

    public setUnit(value: TimeUnit): void {
        this._timeUnit = value;
    }

    protected override getDataWrapper(stats: Statistics): string {
        const data = TimeTool.convert(this._getData!(stats), TimeUnit.NS, this._timeUnit);
        return `${Formatter.beautifyNumber(data.toFixed(this._fractionDigit))} ${TimeUnitStr[this._timeUnit]}`;
    }

    public findMinTimeUnit(statsArr: Statistics[]): TimeUnit {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of statsArr) {
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

    public findFractionDigit(statsArr: Statistics[]): void {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of statsArr) {
            const data = TimeTool.convert(this._getData!(_stats), TimeUnit.NS, this._timeUnit);
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
