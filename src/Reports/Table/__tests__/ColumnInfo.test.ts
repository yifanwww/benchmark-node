import { ColumnInfo } from '../ColumnInfo';
import { ColumnAlign } from '../types';

describe(`Test class \`${ColumnInfo.name}\``, () => {
    it('sets a column info', () => {
        const col = new ColumnInfo(ColumnAlign.RIGHT, 0);
        expect(col.align).toStrictEqual(ColumnAlign.RIGHT);
        expect(col.width).toBe(0);
    });

    it('increases width', () => {
        const col = new ColumnInfo(ColumnAlign.RIGHT, 0);
        expect(col.align).toStrictEqual(ColumnAlign.RIGHT);
        expect(col.width).toBe(0);

        col.increaseWidthMaxTo(10);
        expect(col.width).toBe(10);

        col.increaseWidthMaxTo(10);
        expect(col.width).toBe(10);

        col.increaseWidthMaxTo(1);
        expect(col.width).toBe(10);
    });
});
