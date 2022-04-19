import { Statistics } from '../Data';

import { TableColumn } from './TableColumn';
import { UnitType } from './UnitType';

export type Calc = (stats: Statistics) => number;

export class StatisticColumn extends TableColumn<number> {
    private declare readonly _desc: string;
    private declare readonly _unit: UnitType;

    get desc() {
        return this._desc;
    }

    get unit() {
        return this._unit;
    }

    constructor(columnName: string, desc: string, calc: Calc, unit: UnitType) {
        super(columnName, calc);

        this._desc = desc;
        this._unit = unit;
    }
}
