import { TimeUnit } from '../../../Tools/TimeUnit';
import { UnitType } from '../../../Tools/UnitType';
import { createColumnInfo } from '../ColumnInfo';
import { Row } from '../Row';
import { ColumnAlign } from '../types';
import { createColumnInfos } from './utils';

describe(`Test class \`${Row.name}\``, () => {
    it('adds cells', () => {
        const infos = createColumnInfos();

        const row = new Row({ infos, timeUnit: TimeUnit.NS });
        for (let i = 0; i < 9; i += 3) {
            row.setCell(i, 'asdf');
            row.setCell(i + 1, 1.23456);
            row.setCell(i + 2, 1.23456);
        }

        expect(row.length).toBe(9);

        const rowStr = row.render();
        expect(rowStr).toBe(
            '| asdf | 1.235 | 1.235 ns |  asdf | 1.235 | 1.235 ns |       asdf |    1.235   | 1.235 ns   |',
        );

        infos.push(
            createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
            createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
            createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
        );
        row.expand(12);
        expect(row.render()).toBe(
            '| asdf | 1.235 | 1.235 ns |  asdf | 1.235 | 1.235 ns |       asdf |    1.235   | 1.235 ns   |  |  |  |',
        );
    });

    it('render empty row', () => {
        const rowStr = Row.renderEmpty(createColumnInfos());
        expect(rowStr).toBe('|  |  |  |       |       |       |            |            |            |');
    });

    it('render aligment row', () => {
        const rowStr = Row.renderAlignment(createColumnInfos());
        expect(rowStr).toBe('|-:|::|:-|------:|:-----:|:------|-----------:|:----------:|:-----------|');
    });
});
