import { UnitType } from '../../Tools/UnitType';
import { ColumnAlign } from './types';

export interface ColumnInfo {
    align: ColumnAlign;
    type: UnitType;

    fractionDigit: number;
    width: number;
}

export function createColumnInfo(align: ColumnAlign, type: UnitType) {
    return {
        align,
        type,
        fractionDigit: 1,
        width: 0,
    };
}
