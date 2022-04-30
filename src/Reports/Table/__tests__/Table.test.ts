import { UnitType } from '../../../Tools/UnitType';
import { ColumnInfo } from '../ColumnInfo';
import { Table } from '../Table';
import { ColumnAlign } from '../types';

describe(`Test class \`${Table.name}\``, () => {
    function createTable() {
        const table = new Table();

        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));
        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, UnitType.String));

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
        table.setCell([0, 0], 1, '100');
        table.setCell([0, 0], 2, '123.456 ns');
        table.setCell([0, 0], 3, '1.23456 ns');
        table.setCell([0, 0], 4, '12.3456 ns');

        table.setCell([0, 1], 0, 'Function 1');
        table.setCell([0, 1], 1, '1000');
        table.setCell([0, 1], 2, '1234.56 ns');
        table.setCell([0, 1], 3, '12.3456 ns');
        table.setCell([0, 1], 4, '123.456 ns');

        expect(table.render()).toBe(
            `
|   Function |    N |       Mean |      Error |     StdDev |
|-----------:|-----:|-----------:|-----------:|-----------:|
| Function 1 |  100 | 123.456 ns | 1.23456 ns | 12.3456 ns |
| Function 1 | 1000 | 1234.56 ns | 12.3456 ns | 123.456 ns |
`.trim(),
        );
    });

    it('fills content, with groups', () => {
        const table = createTable();

        table.setCell([0, 0], 0, 'Function 1');
        table.setCell([0, 0], 1, '100');
        table.setCell([0, 0], 2, '123.456 ns');
        table.setCell([0, 0], 3, '1.23456 ns');
        table.setCell([0, 0], 4, '12.3456 ns');

        table.setCell([0, 1], 0, 'Function 1');
        table.setCell([0, 1], 1, '1000');
        table.setCell([0, 1], 2, '1234.56 ns');
        table.setCell([0, 1], 3, '12.3456 ns');
        table.setCell([0, 1], 4, '123.456 ns');

        table.setCell([1, 0], 0, 'Function 2');
        table.setCell([1, 0], 1, '100');
        table.setCell([1, 0], 2, '12.3456 ns');
        table.setCell([1, 0], 3, '0.12345 ns');
        table.setCell([1, 0], 4, '1.23456 ns');

        table.setCell([1, 1], 0, 'Function 2');
        table.setCell([1, 1], 1, '1000');
        table.setCell([1, 1], 2, '123.456 ns');
        table.setCell([1, 1], 3, '1.23456 ns');
        table.setCell([1, 1], 4, '12.3456 ns');

        expect(table.render()).toBe(
            `
|   Function |    N |       Mean |      Error |     StdDev |
|-----------:|-----:|-----------:|-----------:|-----------:|
| Function 1 |  100 | 123.456 ns | 1.23456 ns | 12.3456 ns |
| Function 1 | 1000 | 1234.56 ns | 12.3456 ns | 123.456 ns |
|            |      |            |            |            |
| Function 2 |  100 | 12.3456 ns | 0.12345 ns | 1.23456 ns |
| Function 2 | 1000 | 123.456 ns | 1.23456 ns | 12.3456 ns |
`.trim(),
        );
    });

    it('appends columns after filling content', () => {
        const table = createTable();

        table.setCell([0, 0], 0, 'Function 1');
        table.setCell([0, 0], 1, '100');
        table.setCell([0, 0], 2, '123.456 ns');
        table.setCell([0, 0], 3, '1.23456 ns');
        table.setCell([0, 0], 4, '12.3456 ns');

        table.appendColumn(new ColumnInfo(ColumnAlign.RIGHT, 0));

        expect(table.render()).toBe(
            `
|   Function |   N |       Mean |      Error |     StdDev |  |
|-----------:|----:|-----------:|-----------:|-----------:|-:|
| Function 1 | 100 | 123.456 ns | 1.23456 ns | 12.3456 ns |  |
`.trim(),
        );
    });
});
