import { StatisticIndicator } from '../../Indicators';
import { TimeUnitHelper } from '../../Tools/TimeUnit';
import { UnitType } from '../../Tools/UnitType';
import { Report } from '../Report';
import type { BenchmarkResult, ReportOptions } from '../Report';
import { ColumnAlign, createColumnInfo, Table } from '../Table';

import { ArgumentColumn } from './ArgumentColumn';
import { Column } from './Column';
import { ParameterColumn } from './ParameterColumn';

export interface SummaryTableOptions extends ReportOptions {}

export class SummaryTable extends Report<string> {
    private static readonly fnColumn = new Column('Function', (stats) => stats.fnName);

    generate(result: BenchmarkResult): this {
        const { argLen, indicators, paramNames, statisticGroups } = result;

        const table = new Table();
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
        table.setHeader(0, SummaryTable.fnColumn.name);

        const paramColumns: ParameterColumn[] = [];
        const argColumns: ArgumentColumn[] = [];

        // FIXME: should not be `appending columns`

        for (let i = 0; i < paramNames.length; i++) {
            const col = new ParameterColumn(paramNames[i], i);
            paramColumns.push(col);
            table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
            table.setHeader(i + 1, col.name);
        }

        for (let i = 0; i < argLen; i++) {
            const col = new ArgumentColumn(i);
            argColumns.push(col);
            table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
            table.setHeader(i + paramColumns.length + 1, col.name);
        }

        // setup indicator columns

        const start = table.columnCount;

        for (let i = 0; i < indicators.length; i++) {
            const indicator = indicators[i];
            table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, indicator.unitType));
            table.setHeader(start + i, indicator.indicatorName);
        }

        // setup statistics

        const helpers = [SummaryTable.fnColumn, ...paramColumns, ...argColumns, ...indicators];

        for (let groupId = 0; groupId < statisticGroups.length; groupId++) {
            const group = statisticGroups[groupId];
            for (let i = 0; i < group.length; i++) {
                for (let j = 0; j < helpers.length; j++) {
                    table.setCell([groupId, i], j, helpers[j].getValue(group[i]));
                }
            }
        }

        // generate report

        const report: string[] = [];

        table.chooseTimeUnit(table.findColumn(StatisticIndicator.Mean.indicatorName));
        report.push(table.render());

        if (this._description) {
            report.push('\nDescription:');
            const maxLen = indicators.reduce((prev, curr) => Math.max(prev, curr.indicatorName.length), 0);
            for (const indicator of indicators) {
                report.push(`- ${indicator.indicatorName.padEnd(maxLen)}: ${indicator.legend}`);
            }
            report.push(`- ${TimeUnitHelper.getFullDescription(table.timeUnit, maxLen)}`);
        }

        this._report = report.join('\n');

        return this;
    }
}
