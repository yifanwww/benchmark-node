import { Statistics } from '../Data';

import { TableColumn } from './TableColumn';

export class TableColumnHelper<T> {
    protected declare _column: TableColumn<T>;

    protected declare _maxLength: number;

    public get column() {
        return this._column;
    }

    public get maxLength() {
        return this._maxLength;
    }

    public constructor(column: TableColumn<T>) {
        this._column = column;

        this._maxLength = 0;
    }

    public calculateMaxLen(statsArr: Statistics[]): void {
        let maxLen = this._column.columnName.length;

        for (const _stats of statsArr) {
            const data = this.format(_stats);
            maxLen = Math.max(maxLen, data.length);
        }

        this._maxLength = maxLen;
    }

    public drawColumnName = () => this._column.columnName.padStart(this._maxLength);

    public drawSperator = () => ''.padEnd(this._maxLength, '-');

    public draw = (stats: Statistics) => this.format(stats).padStart(this._maxLength);

    public format(stats: Statistics): string {
        const data = this.column.getData(stats);
        return String(data);
    }
}
