import {
    ArgumentColumn,
    ArgumentColumnHelper,
    BaseColumn,
    BaseColumnHelper,
    ColumnType,
    StatisticColumn,
    StatisticColumnHelper,
} from '../Columns';
import { Statistics } from '../Data';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { TimeUnit, TimeUnitHelper } from '../Tools/TimeUnit';
import { UnitType } from '../Tools/UnitType';
import { ColumnAlign, ColumnInfo, Table } from './Table';

export interface SummaryTableOptions {
    argLen: number;
    paramLen: number;
}

export class SummaryTable {
    private declare readonly _table: Table;

    private static readonly _fnColumn = new BaseColumn(ColumnType.Fn, 'Function', (stats) => stats.name);

    private declare readonly _paramColumns: unknown[];
    private declare readonly _argColumns: ArgumentColumn[];

    private declare readonly _fnNameColumnHelper: BaseColumnHelper<string>;
    private declare readonly _argColumnHelpers: ArgumentColumnHelper[];
    private declare readonly _statsColumnHelpers: StatisticColumnHelper[];

    private declare _timeUnit: TimeUnit;

    private declare _rowGroupId: number;

    constructor(options: SummaryTableOptions) {
        this._table = new Table();

        this._fnNameColumnHelper = new BaseColumnHelper(SummaryTable._fnColumn);
        this._table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
        this._table.setHeader(0, SummaryTable._fnColumn.name);

        this._paramColumns = [];

        this._argColumns = [];
        this._argColumnHelpers = [];
        for (let i = 0; i < options.argLen; i++) {
            const col = new ArgumentColumn(i);
            this._argColumns.push(col);
            this._argColumnHelpers.push(new ArgumentColumnHelper(col));
            this._table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
            this._table.setHeader(i + 1, col.name);
        }

        this._statsColumnHelpers = [];

        this._timeUnit = TimeUnit.NS;

        this._rowGroupId = 0;
    }

    addStatisticColumns(columns: StatisticColumn[]): void {
        const start = this._table.columnCount;

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            this._statsColumnHelpers.push(new StatisticColumnHelper(col));
            this._table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, col.unitType));
            this._table.setHeader(start + i, col.name);
        }
    }

    addStats(statsArr: readonly Statistics[]): void {
        const helpers = [this._fnNameColumnHelper, ...this._argColumnHelpers, ...this._statsColumnHelpers];

        for (let i = 0; i < statsArr.length; i++) {
            for (let j = 0; j < helpers.length; j++) {
                this._table.setCell([this._rowGroupId, i], j, helpers[j].draw(statsArr[i]));
            }
        }

        this._rowGroupId++;
    }

    draw(): void {
        const logger = ConsoleLogger.default;
        logger.writeLineStatistic(this._table.render());
        logger.writeLine();
    }

    drawDescription(): void {
        const logger = ConsoleLogger.default;

        logger.writeLineStatistic('Description:');
        const maxLen = this._statsColumnHelpers.reduce((prev, curr) => Math.max(prev, curr.column.name.length), 0);
        for (const helper of this._statsColumnHelpers) {
            logger.writeLineStatistic(`- ${helper.column.name.padEnd(maxLen)}: ${helper.column.desc}`);
        }
        logger.writeLineStatistic(`- ${TimeUnitHelper.getFullDescription(this._timeUnit, maxLen)}`);
    }
}
