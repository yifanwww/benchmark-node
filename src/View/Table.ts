import { Column } from '../ConfigOptions';
import { Stats } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';

import { ArgumentColumn } from './ArgumentColumn';
import { StatisticColumn } from './StatisticColumn';
import { TableColumn } from './TableColumn';

export class Table {
    private _fnNameColumn = new TableColumn('Function', (stats) => stats.name);

    private _argColumns: ArgumentColumn[] = [];
    private _statisticColumns: StatisticColumn[] = [];

    private _stats: Stats[] = [];

    public addStatisticColumn(column: StatisticColumn): void {
        this._statisticColumns.push(column);
    }

    public addStats(stats: Stats[]): void {
        this._stats.push(...stats);

        const maxLength = stats.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumns.length; i < maxLength; i++) {
            this._argColumns.push(new ArgumentColumn(i));
        }
    }

    public draw(): void {
        // "test/perfs/array-find.ts"
        const unit = this._statisticColumns.find((column) => column.type === Column.Mean)!.findMinTimeUnit(this._stats);
        for (const column of this._statisticColumns) {
            column.setUnit(unit);
            column.findFractionDigit(this._stats);
        }

        const columns = [this._fnNameColumn, ...this._argColumns, ...this._statisticColumns];

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
