import {
    ArgumentColumn,
    ArgumentColumnHelper,
    StatisticColumn,
    StatisticColumnHelper,
    TableColumn,
    TableColumnHelper,
    UnitType,
} from '../Columns';
import { Statistics } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';

export class Table {
    private static readonly fnNameColumn = new TableColumn('Function', (stats) => stats.name);
    private static readonly argColumn: ArgumentColumn[] = [];

    private _fnNameColumnHelper = new TableColumnHelper(Table.fnNameColumn);
    private _argColumnHelpers: ArgumentColumnHelper[] = [];
    private _statsColumnHelpers: StatisticColumnHelper[] = [];

    private _statsArr: Statistics[] = [];

    private _timeUnit: TimeUnit = TimeUnit.NS;

    public addStatisticColumns(columns: StatisticColumn[]): void {
        for (const column of columns) {
            this._statsColumnHelpers.push(new StatisticColumnHelper(column));
        }
    }

    public addStats(statsArr: Statistics[]): void {
        this._statsArr.push(...statsArr);

        const maxLength = statsArr.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumnHelpers.length; i < maxLength; i++) {
            if (i >= Table.argColumn.length) {
                Table.argColumn.push(new ArgumentColumn(i));
            }
            this._argColumnHelpers.push(new ArgumentColumnHelper(Table.argColumn[i]));
        }
    }

    private setFractionDigit(): void {
        let minTime = Number.MAX_SAFE_INTEGER;

        for (const helper of this._statsColumnHelpers) {
            if (helper.column.unit === UnitType.Time) {
                minTime = Math.min(minTime, helper.findMinNumber(this._statsArr));
            }
        }

        this._timeUnit = TimeUnitHelper.chooseUnit(minTime);
        for (const helper of this._statsColumnHelpers) {
            helper.timeUnit = this._timeUnit;
            helper.findFractionDigit(this._statsArr);
        }
    }

    public drawSummaryTable(): void {
        this.setFractionDigit();

        const helpers = [this._fnNameColumnHelper, ...this._argColumnHelpers, ...this._statsColumnHelpers];

        for (const helper of helpers) {
            helper.calculateMaxLen(this._statsArr);
        }

        const logger = ConsoleLogger.default;

        logger.writeLineStatistic(`| ${helpers.map((helper) => helper.drawColumnName()).join(' | ')} |`);
        logger.writeLineStatistic(`|-${helpers.map((helper) => helper.drawSperator()).join('-|-')}-|`);
        for (const stats of this._statsArr) {
            logger.writeLineStatistic(`| ${helpers.map((helper) => helper.draw(stats)).join(' | ')} |`);
        }

        logger.writeLine();
    }

    public writeDescription(): void {
        const logger = ConsoleLogger.default;

        logger.writeLineStatistic('Description:');
        const maxLen = this._statsColumnHelpers.reduce(
            (prev, curr) => Math.max(prev, curr.column.columnName.length),
            0,
        );
        for (const helper of this._statsColumnHelpers) {
            logger.writeLineStatistic(`- ${helper.column.columnName.padEnd(maxLen)}: ${helper.column.desc}`);
        }
        logger.writeLineStatistic(`- ${TimeUnitHelper.getFullDescription(this._timeUnit, maxLen)}`);
    }
}
