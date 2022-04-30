import { TimeUnit } from '../../Tools/TimeUnit';
import { ColumnInfo } from './ColumnInfo';
import { Row } from './Row';
import { TableProps } from './TableProps';
import { RowID } from './types';

export class Table {
    private declare readonly _props: TableProps;

    private declare readonly _header: Row;
    private declare readonly _rows: Row[][];

    get columnCount() {
        return this._props.infos.length;
    }

    constructor() {
        this._props = {
            infos: [],
            timeUnit: TimeUnit.NS,
        };

        this._header = new Row(this._props);
        this._rows = [];
    }

    private expandRows() {
        const colLen = this._props.infos.length;
        this._header.expand(colLen);
        for (const rows of this._rows) {
            for (const row of rows) {
                row.expand(colLen);
            }
        }
    }

    appendColumn(col: ColumnInfo) {
        this._props.infos.push(col);
        this.expandRows();
    }

    private extand(rowID: RowID) {
        for (let i = this._rows.length; i <= rowID[0]; i++) {
            this._rows.push([]);
        }

        const rows = this._rows[rowID[0]];
        for (let i = rows.length; i <= rowID[1]; i++) {
            rows.push(new Row(this._props));
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
        this.calculateWidths();

        const lines: string[] = [this._header.render(), Row.renderAlignment(this._props.infos)];

        if (this._rows.length > 0) {
            lines.push(...this._rows[0].map((row) => row.render()));

            for (let i = 1; i < this._rows.length; i++) {
                const insertEmptyRow = this._rows[i - 1].length > 1 || this._rows[i].length > 1;
                if (insertEmptyRow) {
                    lines.push(Row.renderEmpty(this._props.infos));
                }

                lines.push(...this._rows[i].map((row) => row.render()));
            }
        }

        return lines.join('\n');
    }

    private calculateWidths() {
        for (let i = 0; i < this._props.infos.length; i++) {
            let max = 0;
            for (const cell of this.iterateRows(i)) {
                max = Math.max(max, cell.length);
            }
            this._props.infos[i].width = max;
        }
    }

    private *iterateRows(columnIndex: number): Generator<string, void> {
        yield this._header.getCell(columnIndex);
        for (const rows of this._rows) {
            for (const row of rows) {
                yield row.getCell(columnIndex);
            }
        }
    }
}
