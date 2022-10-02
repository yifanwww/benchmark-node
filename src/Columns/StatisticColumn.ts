import { BaseColumn } from './BaseColumn';

import type { Statistics } from '../Data';
import type { UnitType } from '../Tools/UnitType';
import type { ColumnType } from './ColumnType';

export type Calc = (stats: Statistics) => number;

export class StatisticColumn extends BaseColumn<number> {
    private declare readonly _desc: string;
    private declare readonly _unitType: UnitType;

    get desc() {
        return this._desc;
    }

    get unitType() {
        return this._unitType;
    }

    constructor(type: ColumnType, name: string, desc: string, calc: Calc, unit: UnitType) {
        super(type, name, calc);

        this._desc = desc;
        this._unitType = unit;
    }
}
