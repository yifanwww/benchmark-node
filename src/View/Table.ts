import { Stats } from '../Data';
import { ConsoleLogger } from '../tools';

import { ArgumentColumn } from './ArgumentColumn';
import { Column } from './Column';
import { PerfColumn, PerfColumnType } from './PerfColumn';

export class Table {
    private _argColumns: ArgumentColumn[] = [];

    private _fnNameColumn = new Column('Function', (stats) => stats.name);

    private _perfColumns: Partial<Record<PerfColumnType, PerfColumn>> = {
        [PerfColumnType.Mean]: new PerfColumn(PerfColumnType.Mean, (stats) => stats.mean),
    };

    private _stats: Stats[] = [];

    public addPerfColumn(column: PerfColumn): void {
        this._perfColumns[column.type] = column;
    }

    public addStats(stats: Stats[]): void {
        this._stats.push(...stats);

        const maxLength = stats.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumns.length; i < maxLength; i++) {
            this._argColumns.push(new ArgumentColumn(i));
        }
    }

    private getColumns(): Column<unknown>[] {
        const columns: Column<unknown>[] = [];

        columns.push(this._fnNameColumn);
        columns.push(...this._argColumns);

        for (const type in this._perfColumns) {
            columns.push(this._perfColumns[type as PerfColumnType]!);
        }

        return columns;
    }

    public draw(): void {
        const unit = this._perfColumns[PerfColumnType.Mean]!.findMinTimeUnit(this._stats);
        for (const type in this._perfColumns) {
            this._perfColumns[type as PerfColumnType]!.setUnit(unit);
        }

        const columns = this.getColumns();

        for (const column of columns) {
            column.calculateMaxLen(this._stats);
        }

        const logger = ConsoleLogger.default;
        logger.writeLineStatistic(`| ${columns.map((column) => column.drawHeader()).join(' | ')} |`);
        logger.writeLineStatistic(`|-${columns.map((column) => column.drawSperator()).join('-|-')}-|`);
        for (const stats of this._stats) {
            logger.writeLineStatistic(`| ${columns.map((column) => column.draw(stats)).join(' | ')} |`);
        }
    }
}
