import { ArgumentColumn, BaseColumn, Column, ColumnType, ParameterColumn } from '../../Columns';
import type { StatisticColumn } from '../../Columns';
import type { Statistics } from '../../Data';
import { TimeUnitHelper } from '../../Tools/TimeUnit';
import { UnitType } from '../../Tools/UnitType';
import { Report } from '../Report';
import type { ReportOptions } from '../Report';
import { ColumnAlign, createColumnInfo, Table } from '../Table';

export interface SummaryTableOptions extends ReportOptions {}

/**
 * @deprecated The temporary interface to describe data.
 */
export interface SummaryTableData {
    argLen: number;
    columns: readonly StatisticColumn[];
    paramNames: readonly string[];
    statsGroups: ReadonlyArray<readonly Statistics[]>;
}

export class SummaryTable extends Report<string> {
    private static readonly _fnColumn = new BaseColumn(ColumnType.FN, 'Function', (stats) => stats.name);

    generate(): this {
        // TODO

        return this;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    temporary_generate(data: SummaryTableData): this {
        const { argLen, columns, paramNames, statsGroups } = data;

        const table = new Table();
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
        table.setHeader(0, SummaryTable._fnColumn.name);

        const paramColumns: ParameterColumn[] = [];
        const argColumns: ArgumentColumn[] = [];
        const statsColumns: StatisticColumn[] = [...columns];

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

        // setup columns

        const start = table.columnCount;

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, col.unitType));
            table.setHeader(start + i, col.name);
        }

        // setup statistics

        const helpers = [SummaryTable._fnColumn, ...paramColumns, ...argColumns, ...statsColumns];

        for (let groupId = 0; groupId < statsGroups.length; groupId++) {
            const group = statsGroups[groupId];
            for (let i = 0; i < group.length; i++) {
                for (let j = 0; j < helpers.length; j++) {
                    table.setCell([groupId, i], j, helpers[j].getData(group[i]) as never);
                }
            }
        }

        // generate table

        const report: string[] = [];

        table.chooseTimeUnit(table.findColumn(Column.Mean.name));
        report.push(table.render());

        if (this._description) {
            report.push('\nDescription:');
            const maxLen = statsColumns.reduce((prev, curr) => Math.max(prev, curr.name.length), 0);
            for (const column of statsColumns) {
                report.push(`- ${column.name.padEnd(maxLen)}: ${column.desc}`);
            }
            report.push(`- ${TimeUnitHelper.getFullDescription(table.timeUnit, maxLen)}`);
        }

        this._report = report.join('\n');

        return this;
    }
}
