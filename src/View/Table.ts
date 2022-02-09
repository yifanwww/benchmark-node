import { Column } from '../ConfigOptions';
import { Stats } from '../Data';
import { ConsoleLogger } from '../tools';

import { ArgumentColumn } from './ArgumentColumn';
import { PerfColumn } from './PerfColumn';
import { TableColumn } from './TableColumn';

export class Table {
    private _fnNameColumn = new TableColumn('Function', (stats) => stats.name);

    private _argColumns: ArgumentColumn[] = [];
    private _perfColumns: PerfColumn[] = [];

    private _stats: Stats[] = [];

    public addPerfColumn(column: PerfColumn): void {
        this._perfColumns.push(column);
    }

    public addStats(stats: Stats[]): void {
        this._stats.push(...stats);

        const maxLength = stats.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumns.length; i < maxLength; i++) {
            this._argColumns.push(new ArgumentColumn(i));
        }
    }

    public draw(): void {
        const unit = this._perfColumns.find((column) => column.type === Column.Mean)!.findMinTimeUnit(this._stats);
        for (const type in this._perfColumns) {
            this._perfColumns[type as unknown as Column]!.setUnit(unit);
        }

        const columns = [this._fnNameColumn, ...this._argColumns, ...this._perfColumns];

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
