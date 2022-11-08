import { constantsTestTool } from '../../../__tests__/constantsTestTool';
import { Column } from '../../../Columns';
import { Statistics } from '../../../Data';
import { SummaryTable } from '../index';

describe(`Test class \`${SummaryTable.name}\``, () => {
    it('renders a simple table 1', () => {
        const table = new SummaryTable();
        table.temporary_generate({
            argLen: 0,
            columns: [Column.Mean, Column.Error, Column.StdDev],
            paramNames: [],
            statsGroups: [
                [new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, [])],
                [new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, [])],
            ],
        });
        table.generate();

        expect(table.report).toBe(
            `| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|     fn 1 | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|     fn 2 | 0.2401 ns | 0.0038 ns | 0.0068 ns |

Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 ns  : 1 Nanosecond (0.000000001 sec)`,
        );
    });

    it('renders a simple table 2', () => {
        const table = new SummaryTable();
        table.temporary_generate({
            argLen: 0,
            columns: [Column.Mean, Column.Error, Column.StdDev],
            paramNames: [],
            statsGroups: [
                [
                    new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                    new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                ],
            ],
        });
        table.generate();

        expect(table.report).toBe(`| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|     fn 1 | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|     fn 2 | 0.2401 ns | 0.0038 ns | 0.0068 ns |

Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 ns  : 1 Nanosecond (0.000000001 sec)`);
    });

    it('renders a complex table', () => {
        const table = new SummaryTable();
        table.temporary_generate({
            argLen: 2,
            columns: [Column.Mean, Column.Error, Column.StdDev],
            paramNames: [],
            statsGroups: [
                [
                    new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                    new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                ],
                [
                    new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                    new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                ],
                [
                    new Statistics('fn 1', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                    new Statistics('fn 2', constantsTestTool.measurements.slice(), constantsTestTool.ops, []),
                ],
            ],
        });
        table.generate();

        expect(table.report).toBe(`| Function | arg 0 | arg 1 |      Mean |     Error |    StdDev |
|---------:|------:|------:|----------:|----------:|----------:|
|     fn 1 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|     fn 2 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|          |       |       |           |           |           |
|     fn 1 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|     fn 2 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|          |       |       |           |           |           |
|     fn 1 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |
|     fn 2 |     ? |     ? | 0.2401 ns | 0.0038 ns | 0.0068 ns |

Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 ns  : 1 Nanosecond (0.000000001 sec)`);
    });
});
