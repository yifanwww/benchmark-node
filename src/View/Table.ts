import { Stats } from '../Data';
import { ConsoleLogger } from '../tools';

import { ArgumentColumn } from './ArgumentColumn';
import { Column } from './Column';

export class Table {
    private _argColumns: ArgumentColumn[] = [];
    private _fnNameColumn: Column;

    private _perfColumns: Column[] = [];

    private _stats: Stats[] = [];

    public constructor() {
        this._fnNameColumn = new Column('Function', (stats) => stats.name);
    }

    public addColumn(column: Column): void {
        this._perfColumns.push(column);
    }

    public addStats(stats: Stats[]): void {
        this._stats.push(...stats);

        const maxLength = stats.reduce((prev, curr) => Math.max(prev, curr.args.length), 0);
        for (let i = this._argColumns.length; i < maxLength; i++) {
            this._argColumns.push(new ArgumentColumn(i));
        }
    }

    public draw(): void {
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
