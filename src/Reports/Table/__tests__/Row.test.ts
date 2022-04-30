import { TimeUnit } from '../../../Tools/TimeUnit';
import { UnitType } from '../../../Tools/UnitType';
import { ColumnInfo } from '../ColumnInfo';
import { Row } from '../Row';
import { ColumnAlign } from '../types';

describe(`Test class \`${Row.name}\``, () => {
    function createColumnInfos() {
        const infos: ColumnInfo[] = [
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
            new ColumnInfo(ColumnAlign.MEDIUM, UnitType.String),
            new ColumnInfo(ColumnAlign.LEFT, UnitType.String),
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
            new ColumnInfo(ColumnAlign.MEDIUM, UnitType.String),
            new ColumnInfo(ColumnAlign.LEFT, UnitType.String),
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
            new ColumnInfo(ColumnAlign.MEDIUM, UnitType.String),
            new ColumnInfo(ColumnAlign.LEFT, UnitType.String),
        ];

        infos[3].width = 5;
        infos[4].width = 5;
        infos[5].width = 5;
        infos[6].width = 10;
        infos[7].width = 10;
        infos[8].width = 10;

        return infos;
    }

    it('adds columns', () => {
        const infos = createColumnInfos();

        const row = new Row({ infos, timeUnit: TimeUnit.NS });
        for (let i = 0; i < 9; i++) {
            row.setCell(i, 'asdf');
        }

        expect(row.length).toBe(9);

        const rowStr = row.render();
        expect(rowStr).toBe('| asdf | asdf | asdf |  asdf |  asdf | asdf  |       asdf |    asdf    | asdf       |');

        infos.push(
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
            new ColumnInfo(ColumnAlign.RIGHT, UnitType.String),
        );
        row.expand(12);
        expect(row.render()).toBe(
            '| asdf | asdf | asdf |  asdf |  asdf | asdf  |       asdf |    asdf    | asdf       |  |  |  |',
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
