import type { Statistics } from '../../Data';

export type GetValue = (stats: Statistics) => string;

export class Column {
    protected declare readonly _columnName: string;

    protected declare _getValue: GetValue;

    constructor(columnName: string, getValue: GetValue) {
        this._columnName = columnName;

        this._getValue = getValue;
    }

    /**
     * Display column title.
     */
    get columnName(): string {
        return this._columnName;
    }

    get name() {
        return this._columnName;
    }

    /**
     * Formatted value of this column.
     */
    getValue(stats: Statistics): string {
        return this._getValue(stats);
    }
}
