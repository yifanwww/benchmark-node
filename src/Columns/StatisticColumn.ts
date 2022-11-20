import type { Statistics } from '../Data';
import { StatisticIndicator } from '../Indicators';
import type { IIndicator } from '../Indicators';
import type { UnitType } from '../Tools/UnitType';

import { BaseColumn } from './BaseColumn';
import type { ColumnType } from './ColumnType';

export type Calc = (stats: Statistics) => number;

/**
 * @deprecated Use `StatisticIndicator` instead. This will be deleted since `v0.9.0`.
 */
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

    toIndicator(): IIndicator {
        return new StatisticIndicator(this._name, this._desc, this._getData, this._unitType);
    }
}
