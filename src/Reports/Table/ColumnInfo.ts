import { UnitType } from '../../Tools/UnitType';
import { ColumnAlign } from './types';

export class ColumnInfo {
    private declare readonly _align: ColumnAlign;
    private declare readonly _type: UnitType;

    private declare _width: number;

    get align() {
        return this._align;
    }

    get type() {
        return this._type;
    }

    get width() {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    constructor(align: ColumnAlign, type: UnitType) {
        this._align = align;
        this._type = type;

        this._width = 0;
    }

    increaseWidthMaxTo(width: number) {
        this._width = Math.max(this._width, width);
    }
}
