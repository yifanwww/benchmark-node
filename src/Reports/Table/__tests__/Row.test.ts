import { ColumnInfo } from '../ColumnInfo';
import { Row } from '../Row';
import { Align } from '../types';

describe(`Test class \`${Row.name}\``, () => {
    function createColumnInfos() {
        const cols: ColumnInfo[] = [];
        cols.push(new ColumnInfo(Align.RIGHT, 0));
        cols.push(new ColumnInfo(Align.MEDIUM, 0));
        cols.push(new ColumnInfo(Align.LEFT, 0));
        cols.push(new ColumnInfo(Align.RIGHT, 5));
        cols.push(new ColumnInfo(Align.MEDIUM, 5));
        cols.push(new ColumnInfo(Align.LEFT, 5));
        cols.push(new ColumnInfo(Align.RIGHT, 10));
        cols.push(new ColumnInfo(Align.MEDIUM, 10));
        cols.push(new ColumnInfo(Align.LEFT, 10));
        return cols;
    }

    it('adds columns', () => {
        const cols = createColumnInfos();

        const row = new Row(cols);
        for (let i = 0; i < 9; i++) {
            row.setCell(i, 'asdf');
        }

        expect(row.length).toBe(9);

        const rowStr = row.render();
        expect(rowStr).toBe('| asdf | asdf | asdf |  asdf |  asdf | asdf  |       asdf |    asdf    | asdf       |');

        cols.push(new ColumnInfo(Align.RIGHT, 0));
        cols.push(new ColumnInfo(Align.RIGHT, 0));
        cols.push(new ColumnInfo(Align.RIGHT, 0));
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
