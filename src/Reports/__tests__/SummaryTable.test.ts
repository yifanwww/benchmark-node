import { mockConsoleLogger } from '../../__tests__/ConsoleLoggerTestTool';
import { constantsTestTool } from '../../__tests__/constantsTestTool';
import { Column } from '../../Columns';
import { Statistics } from '../../Data';
import { SummaryTable } from '../SummaryTable';

describe(`Test class \`${SummaryTable.name}\``, () => {
    beforeEach(() => mockConsoleLogger());

    it('renders a simple table 1', () => {
        const table = new SummaryTable({ argLen: 0, paramNames: [] });

        table.addStatisticColumns([Column.Mean, Column.Error, Column.StdDev]);
        table.addStats([new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, [])]);
        table.addStats([new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, [])]);

        table.draw();
        table.drawDescription();
    });

    it('renders a simple table 2', () => {
        const table = new SummaryTable({ argLen: 0, paramNames: [] });

        table.addStatisticColumns([Column.Mean, Column.Error, Column.StdDev]);
        table.addStats([
            new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
            new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
        ]);

        table.draw();
        table.drawDescription();
    });

    it('renders a complex table', () => {
        const table = new SummaryTable({ argLen: 2, paramNames: [] });

        table.addStatisticColumns([Column.Mean, Column.Error, Column.StdDev]);
        table.addStats([
            new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
            new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
        ]);
        table.addStats([
            new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
            new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
        ]);
        table.addStats([
            new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
            new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
        ]);

        table.draw();
        table.drawDescription();
    });
});
