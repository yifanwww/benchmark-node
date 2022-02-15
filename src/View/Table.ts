import { ArgumentColumn, StatisticColumn, StatisticColumnExt, TableColumn, TableColumnExt } from '../Columns';
import { Statistics } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';

export class Table {
    private _fnNameColumn = new TableColumn('Function', (stats) => stats.name);

    private _argColumns: ArgumentColumn[] = [];
    private _statisticColumns: StatisticColumn[] = [];

    private _statsArr: Statistics[] = [];

    private _maxLengthMap: Record<string, number> = {};

    public addStatisticColumns(columns: StatisticColumn[]): void {
        for (const column of columns) {
            this._statisticColumns.push(column);
        }
    }

    public addStats(statsArr: Statistics[]): void {
        this._statsArr.push(...statsArr);

        const maxLength = statsArr.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumns.length; i < maxLength; i++) {
            this._argColumns.push(new ArgumentColumn(i));
        }
    }

    public draw(): void {
        const minTime = Math.min(
            ...this._statisticColumns.map((column) => StatisticColumnExt.findMinNumber(column, this._statsArr)),
        );
        const timeUnit = StatisticColumnExt.chooseTimeUnit(minTime);
        for (const column of this._statisticColumns) {
            column.timeUnit = timeUnit;
            column.setFractionDigit(StatisticColumnExt.findFractionDigit(column, this._statsArr));
        }

        const columns = [this._fnNameColumn, ...this._argColumns, ...this._statisticColumns];

        for (const column of columns) {
            this._maxLengthMap[column.columnName] = TableColumnExt.calculateMaxLen(column, this._statsArr);
        }

        const logger = ConsoleLogger.default;

        const columnNameLine = columns
            .map((column) => TableColumnExt.drawColumnName(column, this._maxLengthMap[column.columnName]))
            .join(' | ');
        logger.writeLineStatistic(`| ${columnNameLine} |`);

        const speratorLine = columns
            .map((column) => TableColumnExt.drawSperator(this._maxLengthMap[column.columnName]))
            .join('-|-');
        logger.writeLineStatistic(`|-${speratorLine}-|`);

        for (const stats of this._statsArr) {
            const benchLine = columns
                .map((column) => TableColumnExt.draw(column, this._maxLengthMap[column.columnName], stats))
                .join(' | ');
            logger.writeLineStatistic(`| ${benchLine} |`);
        }
    }
}
