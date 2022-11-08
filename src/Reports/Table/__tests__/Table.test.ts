import { Column } from '../../../Columns';
import { UnitType } from '../../../Tools/UnitType';
import { createColumnInfo } from '../ColumnInfo';
import { Table } from '../Table';
import { ColumnAlign } from '../types';

describe(`Test class \`${Table.name}\``, () => {
    function createTable() {
        const table = new Table();

        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.ORIGIN));
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.TIME));
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.TIME));
        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.TIME));

        table.setHeader(0, 'Function');
        table.setHeader(1, 'N');
        table.setHeader(2, 'Mean');
        table.setHeader(3, 'Error');
        table.setHeader(4, 'StdDev');

        return table;
    }

    it('news a table', () => {
        const table = createTable();

        expect(table.columnCount).toBe(5);

        expect(table.render()).toBe(
            `
| Function | N | Mean | Error | StdDev |
|---------:|--:|-----:|------:|-------:|
`.trim(),
        );
    });

    it('fills content, no groups', () => {
        const table = createTable();

        table.setCell([0, 0], 0, 'Function 1');
        table.setCell([0, 0], 1, 100);
        table.setCell([0, 0], 2, 123.456);
        table.setCell([0, 0], 3, 1.23456);
        table.setCell([0, 0], 4, 12.3456);

        table.setCell([0, 1], 0, 'Function 1');
        table.setCell([0, 1], 1, 1000);
        table.setCell([0, 1], 2, 1234.56);
        table.setCell([0, 1], 3, 12.3456);
        table.setCell([0, 1], 4, 123.456);

        table.chooseTimeUnit(table.findColumn(Column.Mean.name));

        expect(table.render()).toBe(
            `
|   Function |    N |       Mean |     Error |    StdDev |
|-----------:|-----:|-----------:|----------:|----------:|
| Function 1 |  100 |   123.5 ns |  1.235 ns |  12.35 ns |
| Function 1 | 1000 | 1,234.6 ns | 12.346 ns | 123.46 ns |
`.trim(),
        );
    });

    it('fills content, with groups', () => {
        const table = createTable();

        table.setCell([0, 0], 0, 'Function 1');
        table.setCell([0, 0], 1, 100);
        table.setCell([0, 0], 2, 123.456);
        table.setCell([0, 0], 3, 1.23456);
        table.setCell([0, 0], 4, 12.3456);

        table.setCell([0, 1], 0, 'Function 1');
        table.setCell([0, 1], 1, 1000);
        table.setCell([0, 1], 2, 1234.56);
        table.setCell([0, 1], 3, 12.3456);
        table.setCell([0, 1], 4, 123.456);

        table.setCell([1, 0], 0, 'Function 2');
        table.setCell([1, 0], 1, 100);
        table.setCell([1, 0], 2, 12.3456);
        table.setCell([1, 0], 3, 0.12345);
        table.setCell([1, 0], 4, 1.23456);

        table.setCell([1, 1], 0, 'Function 2');
        table.setCell([1, 1], 1, 1000);
        table.setCell([1, 1], 2, 123.456);
        table.setCell([1, 1], 3, 1.23456);
        table.setCell([1, 1], 4, 12.3456);

        table.chooseTimeUnit(table.findColumn(Column.Mean.name));

        expect(table.render()).toBe(
            `
|   Function |    N |        Mean |      Error |     StdDev |
|-----------:|-----:|------------:|-----------:|-----------:|
| Function 1 |  100 |   123.46 ns |  1.2346 ns |  12.346 ns |
| Function 1 | 1000 | 1,234.56 ns | 12.3456 ns | 123.456 ns |
|            |      |             |            |            |
| Function 2 |  100 |    12.35 ns |  0.1235 ns |   1.235 ns |
| Function 2 | 1000 |   123.46 ns |  1.2346 ns |  12.346 ns |
`.trim(),
        );
    });

    it('appends columns after filling content', () => {
        const table = createTable();

        table.setCell([0, 0], 0, 'Function 1');
        table.setCell([0, 0], 1, 100);
        table.setCell([0, 0], 2, 123.456);
        table.setCell([0, 0], 3, 1.23456);
        table.setCell([0, 0], 4, 12.3456);

        table.appendColumn(createColumnInfo(ColumnAlign.RIGHT, UnitType.TIME));
        table.setHeader(5, 'Max');
        table.setCell([0, 0], 5, 1234.56);

        table.chooseTimeUnit(table.findColumn(Column.Mean.name));

        expect(table.render()).toBe(
            `
|   Function |   N |     Mean |    Error |   StdDev |      Max |
|-----------:|----:|---------:|---------:|---------:|---------:|
| Function 1 | 100 | 123.5 ns | 1.235 ns | 12.35 ns | 1,235 ns |
`.trim(),
        );
    });

    it('find the target column index', () => {
        const table = createTable();
        expect(table.findColumn(Column.Mean.name)).toBe(2);
        expect(table.findColumn('unknown')).toBe(-1);
    });
});
