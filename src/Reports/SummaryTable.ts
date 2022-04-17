import {
    ArgumentColumn,
    ArgumentColumnHelper,
    Column,
    StatisticColumn,
    StatisticColumnHelper,
    TableColumn,
    TableColumnHelper,
} from '../Columns';
import { Statistics } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';

export class SummaryTable {
    private static readonly fnNameColumn = new TableColumn('Function', (stats) => stats.name);
    private static readonly argColumn: ArgumentColumn[] = [];

    private declare readonly _fnNameColumnHelper;
    private declare readonly _argColumnHelpers: ArgumentColumnHelper[];
    private declare readonly _statsColumnHelpers: StatisticColumnHelper[];

    private declare readonly _statsArr: Statistics[];

    private declare _timeUnit: TimeUnit;

    public constructor() {
        this._fnNameColumnHelper = new TableColumnHelper(SummaryTable.fnNameColumn);
        this._argColumnHelpers = [];
        this._statsColumnHelpers = [];

        this._statsArr = [];

        this._timeUnit = TimeUnit.NS;
    }

    public addStatisticColumns(columns: StatisticColumn[]): void {
        for (const column of columns) {
            this._statsColumnHelpers.push(new StatisticColumnHelper(column));
        }
    }

    public addStats(statsArr: Statistics[]): void {
        this._statsArr.push(...statsArr);

        const maxLength = statsArr.reduce((prev, curr) => Math.max(prev, curr.args?.args.length ?? 0), 0);
        for (let i = this._argColumnHelpers.length; i < maxLength; i++) {
            if (i >= SummaryTable.argColumn.length) {
                SummaryTable.argColumn.push(new ArgumentColumn(i));
            }
            this._argColumnHelpers.push(new ArgumentColumnHelper(SummaryTable.argColumn[i]));
        }
    }

    private setFractionDigit(): void {
        let minTime: number;

        for (const helper of this._statsColumnHelpers) {
            if (helper.column.columnName === Column.Mean.columnName) {
                minTime = helper.findMinNumber(this._statsArr);
                break;
            }
        }

        this._timeUnit = TimeUnitHelper.chooseUnit(minTime!);
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
