import { ArgumentColumn, BaseColumn, Column, ColumnType, ParameterColumn } from '../Columns';
import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { TimeUnitHelper } from '../Tools/TimeUnit';
import { UnitType } from '../Tools/UnitType';

import { ColumnAlign, createColumnInfo, Table } from './Table';

import type { StatisticColumn } from '../Columns';
import type { Statistics } from '../Data';

export interface SummaryTableOptions {
    argLen: number;
    paramNames: readonly string[];
}

export class SummaryTable {
    private declare readonly _table: Table;

    private static readonly _fnColumn = new BaseColumn(ColumnType.Fn, 'Function', (stats) => stats.name);

    private declare readonly _paramColumns: ParameterColumn[];
    private declare readonly _argColumns: ArgumentColumn[];
    private declare readonly _statsColumns: StatisticColumn[];

    /** @deprecated */
    private declare _rowGroupId: number;

    constructor(options: SummaryTableOptions) {
        const { argLen, paramNames } = options;

        this._table = new Table();

        this._table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin));
        this._table.setHeader(0, SummaryTable._fnColumn.name);

        this._paramColumns = [];
        for (let i = 0; i < paramNames.length; i++) {
            const col = new ParameterColumn(paramNames[i], i);
            this._paramColumns.push(col);
            this._table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin));
            this._table.setHeader(i + 1, col.name);
        }

        this._argColumns = [];
        for (let i = 0; i < argLen; i++) {
            const col = new ArgumentColumn(i);
            this._argColumns.push(col);
            this._table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin));
            this._table.setHeader(i + this._paramColumns.length + 1, col.name);
        }

        this._statsColumns = [];

        this._rowGroupId = 0;
    }

    addStatisticColumns(columns: StatisticColumn[]): void {
        this._statsColumns.push(...columns);

        const start = this._table.columnCount;

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            this._table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, col.unitType));
            this._table.setHeader(start + i, col.name);
        }
    }

    addStats(statsArr: readonly Statistics[]): void {
        const helpers = [SummaryTable._fnColumn, ...this._paramColumns, ...this._argColumns, ...this._statsColumns];

        for (let i = 0; i < statsArr.length; i++) {
            for (let j = 0; j < helpers.length; j++) {
                this._table.setCell([this._rowGroupId, i], j, helpers[j].getData(statsArr[i]) as never);
            }
        }

        this._rowGroupId++;
    }

    draw(): void {
        this._table.chooseTimeUnit(this._table.findColumn(Column.Mean.name));
        const output = this._table.render();

        const logger = ConsoleLogger.default;
        logger.writeLineStatistic(output);
        logger.writeLine();
    }

    drawDescription(): void {
        const logger = ConsoleLogger.default;

        logger.writeLineStatistic('Description:');
        const maxLen = this._statsColumns.reduce((prev, curr) => Math.max(prev, curr.name.length), 0);
        for (const column of this._statsColumns) {
            logger.writeLineStatistic(`- ${column.name.padEnd(maxLen)}: ${column.desc}`);
        }
        logger.writeLineStatistic(`- ${TimeUnitHelper.getFullDescription(this._table.timeUnit, maxLen)}`);
    }
}
