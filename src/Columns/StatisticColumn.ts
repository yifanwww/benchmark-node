import { Statistics } from '../Data';
import { UnitType } from '../Tools/UnitType';
import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export type Calc = (stats: Statistics) => number;

export class StatisticColumn extends BaseColumn<number> {
    private declare readonly _desc: string;
    private declare readonly _unit: UnitType;

    get desc() {
        return this._desc;
    }

    get unit() {
        return this._unit;
    }

    constructor(type: ColumnType, name: string, desc: string, calc: Calc, unit: UnitType) {
        super(type, name, calc);

        this._desc = desc;
        this._unit = unit;
    }
}
