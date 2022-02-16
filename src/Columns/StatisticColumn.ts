import { Statistics } from '../Data';

import { TableColumn } from './TableColumn';
import { UnitType } from './UnitType';

export type Calc = (stats: Statistics) => number;

export class StatisticColumn extends TableColumn<number> {
    private _desc: string;
    private _unit: UnitType;

    public get desc() {
        return this._desc;
    }

    public get unit() {
        return this._unit;
    }

    public constructor(columnName: string, desc: string, calc: Calc, unit: UnitType) {
        super(columnName, calc);

        this._desc = desc;
        this._unit = unit;
    }
}
