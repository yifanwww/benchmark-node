import { chooseFractionDigit } from '../../Tools/chooseFractionDigit';
import { renderData } from '../../Tools/renderData';
import { TimeTool } from '../../Tools/TimeTool';
import { TimeUnit, TimeUnitHelper } from '../../Tools/TimeUnit';
import { UnitType } from '../../Tools/UnitType';
import { ColumnInfo } from './ColumnInfo';
import { Header } from './Header';
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

    get timeUnit() {
        return this._props.timeUnit;
    }

    constructor() {
        this._props = {
            infos: [],
            timeUnit: TimeUnit.NS,
        };

        this._header = new Header(this._props);
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

    setCell(rowID: RowID, col: number, value: number | string) {
        this.extand(rowID);
        this._rows[rowID[0]][rowID[1]].setCell(col, value);
    }

    private findMinNumber(columnIndex: number): number {
        let minNum = Number.MAX_SAFE_INTEGER;
        for (const value of this.iterateRows(columnIndex)) {
            minNum = Math.min(minNum, value as number);
        }
        return minNum;
    }

    chooseTimeUnit(baseIndex: number): void {
        const minTime = this.findMinNumber(baseIndex);
        this._props.timeUnit = TimeUnitHelper.chooseUnit(minTime);
    }

    findColumn(header: string): number {
        for (let i = 0; i < this._header.length; i++) {
            const _header = this._header.getCell(i) as string;
            if (_header === header) return i;
        }

        return -1;
    }

    render(): string {
        this.calculateFractions();
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

    private calculateFractions(): void {
        const { infos } = this._props;

        for (let i = 0; i < infos.length; i++) {
            const info = infos[i];
            if (info.type === UnitType.Dimensionless || info.type === UnitType.Time) {
                let minNum = this.findMinNumber(i);
                if (info.type === UnitType.Time) {
                    minNum = TimeTool.convert(minNum, TimeUnit.NS, this._props.timeUnit);
                }
                info.fractionDigit = chooseFractionDigit(minNum);
            }
        }
    }

    private calculateWidths(): void {
        for (let i = 0; i < this._props.infos.length; i++) {
            const info = this._props.infos[i];

            let max = (this._header.getCell(i) as string).length;
            for (const value of this.iterateRows(i)) {
                const cell = renderData(value, info.type, info.fractionDigit, this._props.timeUnit);
                max = Math.max(max, cell.length);
            }
            info.width = max;
        }
    }

    private *iterateRows(columnIndex: number): Generator<number | string, void> {
        for (const rows of this._rows) {
            for (const row of rows) {
                yield row.getCell(columnIndex);
            }
        }
    }
}
