import { Statistics } from '../Data';
import { BaseColumn } from './BaseColumn';

export class BaseColumnHelper<T> {
    protected declare _column: BaseColumn<T>;

    protected declare _maxLength: number;

    get column() {
        return this._column;
    }

    get maxLength() {
        return this._maxLength;
    }

    constructor(column: BaseColumn<T>) {
        this._column = column;

        this._maxLength = 0;
    }

    calculateMaxLen(statsArr: Statistics[]): void {
        let maxLen = this._column.name.length;

        for (const _stats of statsArr) {
            const data = this.format(_stats);
            maxLen = Math.max(maxLen, data.length);
        }

        this._maxLength = maxLen;
    }

    drawColumnName = () => this._column.name.padStart(this._maxLength);

    drawSperator = () => ''.padEnd(this._maxLength, '-');

    draw = (stats: Statistics) => this.format(stats).padStart(this._maxLength);

    format(stats: Statistics): string {
        const data = this.column.getData(stats);
        return String(data);
    }
}
