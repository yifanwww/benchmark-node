import { renderData } from '../../Tools/renderData';

import type { ColumnInfo } from './ColumnInfo';
import type { TableProps } from './TableProps';
import { ColumnAlign } from './types';

export class Row {
    protected declare readonly _props: TableProps;
    protected declare readonly _cells: (number | string)[];

    get length() {
        return this._cells.length;
    }

    constructor(props: TableProps) {
        this._props = props;
        this._cells = props.infos.map(() => '');
    }

    expand(len: number): void {
        for (let i = this._cells.length; i < len; i++) {
            this._cells.push('');
        }
    }

    getCell(index: number): number | string {
        return this._cells[index];
    }

    setCell(index: number, value: number | string): void {
        this._cells[index] = value;
    }

    protected static _renderContent(value: string, col: ColumnInfo) {
        const { align, width } = col;

        const len = value.length;

        switch (align) {
            case ColumnAlign.LEFT:
                return value.padEnd(width, ' ');

            case ColumnAlign.MEDIUM: {
                const right = Math.floor((width - len) / 2);
                return value.padEnd(len + right, ' ').padStart(width, ' ');
            }

            case ColumnAlign.RIGHT:
                return value.padStart(width, ' ');
        }
    }

    render(): string {
        const { infos } = this._props;

        const arr: string[] = [];
        for (let i = 0; i < infos.length; i++) {
            const content = renderData(this._cells[i], infos[i].type, infos[i].fractionDigit, this._props.timeUnit);
            arr.push(Row._renderContent(content, infos[i]));
        }
        return `| ${arr.join(' | ')} |`;
    }

    static renderEmpty(cols: readonly ColumnInfo[]): string {
        return `| ${cols.map((info) => ''.padEnd(info.width, ' ')).join(' | ')} |`;
    }

    private static _renderAlignmentCell(col: ColumnInfo) {
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
        return `|${cols.map((info) => Row._renderAlignmentCell(info)).join('|')}|`;
    }
}
