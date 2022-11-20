import type { Statistics } from '../Data';
import { StatisticIndicator } from '../Indicators';
import type { IIndicator } from '../Indicators';
import type { UnitType } from '../Tools/UnitType';

import type { ColumnType } from './ColumnType';

export type Calc = (stats: Statistics) => number;

/** @deprecated Use `StatisticIndicator` instead. This will be deleted since `v0.9.0`. */
export class StatisticColumn {
    private declare readonly _type: ColumnType;
    private declare readonly _name: string;
    private declare readonly _desc: string;
    private declare readonly _unitType: UnitType;

    protected declare _calc: Calc;

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }

    get desc() {
        return this._desc;
    }

    get unitType() {
        return this._unitType;
    }

    constructor(type: ColumnType, name: string, desc: string, calc: Calc, unit: UnitType) {
        this._type = type;
        this._name = name;
        this._desc = desc;
        this._unitType = unit;

        this._calc = calc;
    }

    toIndicator(): IIndicator {
        return new StatisticIndicator(this._name, this._desc, this._calc, this._unitType);
    }
}
