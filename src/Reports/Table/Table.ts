import { ColumnInfo } from './ColumnInfo';
import { Row } from './Row';
import { RowID } from './types';

export class Table {
    private declare readonly _columnInfos: ColumnInfo[];
    private declare readonly _header: Row;
    private declare readonly _rows: Row[][];

    get columnCount() {
        return this._columnInfos.length;
    }

    constructor() {
        this._columnInfos = [];
        this._header = new Row(this._columnInfos);
        this._rows = [];
    }

    private expandRows() {
        const colLen = this._columnInfos.length;
        this._header.expand(colLen);
        for (const rows of this._rows) {
            for (const row of rows) {
                row.expand(colLen);
            }
        }
    }

    appendColumn(col: ColumnInfo) {
        this._columnInfos.push(col);
        this.expandRows();
    }

    private extand(rowID: RowID) {
        for (let i = this._rows.length; i <= rowID[0]; i++) {
            this._rows.push([]);
        }

        const rows = this._rows[rowID[0]];
        for (let i = rows.length; i <= rowID[1]; i++) {
            rows.push(new Row(this._columnInfos));
        }
    }

    setHeader(index: number, value: string) {
        this._header.setCell(index, value);
    }

    setCell(rowID: RowID, col: number, value: string) {
        this.extand(rowID);
        this._rows[rowID[0]][rowID[1]].setCell(col, value);
    }

    render(): string {
        const lines: string[] = [this._header.render(), Row.renderAlignment(this._columnInfos)];

        if (this._rows.length > 0) {
            lines.push(...this._rows[0].map((row) => row.render()));

            for (let i = 1; i < this._rows.length; i++) {
                const insertEmptyRow = this._rows[i - 1].length > 1 || this._rows[i].length > 1;
                if (insertEmptyRow) {
                    lines.push(Row.renderEmpty(this._columnInfos));
                }

                lines.push(...this._rows[i].map((row) => row.render()));
            }
        }

        return lines.join('\n');
    }
}
