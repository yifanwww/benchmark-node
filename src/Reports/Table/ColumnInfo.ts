import { ColumnAlign } from './types';

export class ColumnInfo {
    private declare readonly _align: ColumnAlign;
    private declare _width: number;

    get align() {
        return this._align;
    }

    get width() {
        return this._width;
    }

    constructor(align: ColumnAlign, width: number) {
        this._align = align;
        this._width = width;
    }

    increaseWidthMaxTo(width: number) {
        this._width = Math.max(this._width, width);
    }
}
