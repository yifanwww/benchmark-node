import { StatisticIndicator } from '../../Indicators';
import type { IIndicator } from '../../Indicators';
import { RuntimeInfo } from '../../RuntimeInfo';
import { TimeUnitHelper } from '../../Tools/TimeUnit';
import type { TimeUnit } from '../../Tools/TimeUnit';
import { UnitType } from '../../Tools/UnitType';
import { Report } from '../Report';
import type { BenchmarkResult, ReportOptions } from '../Report';
import { ColumnAlign, createColumnInfo, Table } from '../Table';

import { ArgumentColumn } from './ArgumentColumn';
import { Column } from './Column';
import { ParameterColumn } from './ParameterColumn';

export interface SummaryTableOptions extends ReportOptions {}

export interface SummaryTableReport {
    description: string | undefined;
    runtime: string | undefined;
    table: string;
}

export class SummaryTable extends Report<SummaryTableReport> {
    private static readonly fnColumn = new Column('Function', (stats) => stats.fnName);

    private generateRuntimeInfo(): string {
        return [
            `BenchmarkNode v${RuntimeInfo.version}, ${RuntimeInfo.platform}`,
            RuntimeInfo.cpu.toString(),
            `Node.JS ${RuntimeInfo.versions.node} (V8 ${RuntimeInfo.versions.v8})`,
        ].join('\n');
    }

    private generateDescription(indicators: readonly IIndicator[], timeUnit: TimeUnit): string {
        const maxLen = indicators.reduce((prev, curr) => Math.max(prev, curr.indicatorName.length), 0);

        const description = [
            'Description:',
            ...indicators.map((indicator) => `- ${indicator.indicatorName.padEnd(maxLen)}: ${indicator.legend}`),
            `- ${TimeUnitHelper.getFullDescription(timeUnit, maxLen)}`,
        ];

        return description.join('\n');
    }

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

        table.chooseTimeUnit(table.findColumn(StatisticIndicator.Mean.indicatorName));

        // generate report

        this._report = {
            description: !this.descriptionFlag ? undefined : this.generateDescription(indicators, table.timeUnit),
            runtime: !this.runtimeFlag ? undefined : this.generateRuntimeInfo(),
            table: table.render(),
        };

        return this;
    }
}
