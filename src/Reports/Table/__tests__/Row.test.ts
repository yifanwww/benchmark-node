import { TimeUnit } from '../../../Tools/TimeUnit';
import { ColumnInfo } from '../ColumnInfo';
import { Row } from '../Row';
import { ColumnAlign } from '../types';

describe(`Test class \`${Row.name}\``, () => {
    function createColumnInfos() {
        const infos: ColumnInfo[] = [];
        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 0));
        infos.push(new ColumnInfo(ColumnAlign.MEDIUM, 0));
        infos.push(new ColumnInfo(ColumnAlign.LEFT, 0));
        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 5));
        infos.push(new ColumnInfo(ColumnAlign.MEDIUM, 5));
        infos.push(new ColumnInfo(ColumnAlign.LEFT, 5));
        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 10));
        infos.push(new ColumnInfo(ColumnAlign.MEDIUM, 10));
        infos.push(new ColumnInfo(ColumnAlign.LEFT, 10));
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

        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 0));
        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 0));
        infos.push(new ColumnInfo(ColumnAlign.RIGHT, 0));
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
