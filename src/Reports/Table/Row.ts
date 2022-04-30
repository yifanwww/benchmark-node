import { ColumnInfo } from './ColumnInfo';
import { ColumnAlign } from './types';

export class Row {
    private declare readonly _cols: readonly ColumnInfo[];
    private declare readonly _cells: string[];

    get length() {
        return this._cells.length;
    }

    constructor(colInfos: readonly ColumnInfo[]) {
        this._cols = colInfos;
        this._cells = colInfos.map(() => '');
    }

    expand(len: number) {
        for (let i = this._cells.length; i < len; i++) {
            this._cells.push('');
        }
    }

    setCell(index: number, value: string) {
        this._cols[index].increaseWidthMaxTo(value.length);
        this._cells[index] = value;
    }

    private static renderContent(col: ColumnInfo, content: string) {
        const { align, width } = col;

        const len = content.length;

        switch (align) {
            case ColumnAlign.LEFT:
                return content.padEnd(width, ' ');

            case ColumnAlign.MEDIUM: {
                const right = Math.floor((width - len) / 2);
                return content.padEnd(len + right, ' ').padStart(width, ' ');
            }

            case ColumnAlign.RIGHT:
                return content.padStart(width, ' ');
        }
    }

    render() {
        const arr: string[] = [];
        for (let i = 0; i < this._cols.length; i++) {
            arr.push(Row.renderContent(this._cols[i], this._cells[i]));
        }
        return `| ${arr.join(' | ')} |`;
    }

    static renderEmpty(cols: readonly ColumnInfo[]): string {
        return `| ${cols.map((info) => ''.padEnd(info.width, ' ')).join(' | ')} |`;
    }

    private static renderAlignmentCell(col: ColumnInfo) {
        const { align, width } = col;

        switch (align) {
            case ColumnAlign.LEFT:
                return ':'.padEnd(width + 2, '-');

            case ColumnAlign.MEDIUM:
                return `${':'.padEnd(width + 1, '-')}:`;

            case ColumnAlign.RIGHT:
                return ':'.padStart(width + 2, '-');
        }
    }

    static renderAlignment(cols: readonly ColumnInfo[]): string {
        return `|${cols.map((info) => Row.renderAlignmentCell(info)).join('|')}|`;
    }
}
