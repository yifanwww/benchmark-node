import { UnitType } from '../../../Tools/UnitType';
import { ColumnInfo } from '../ColumnInfo';
import { ColumnAlign } from '../types';

describe(`Test class \`${ColumnInfo.name}\``, () => {
    it('sets a column info', () => {
        const info = new ColumnInfo(ColumnAlign.RIGHT, UnitType.String);
        expect(info.align).toStrictEqual(ColumnAlign.RIGHT);
        expect(info.width).toBe(0);
    });

    it('increases width', () => {
        const info = new ColumnInfo(ColumnAlign.RIGHT, UnitType.String);
        expect(info.align).toStrictEqual(ColumnAlign.RIGHT);
        expect(info.width).toBe(0);

        info.increaseWidthMaxTo(10);
        expect(info.width).toBe(10);

        info.increaseWidthMaxTo(10);
        expect(info.width).toBe(10);

        info.increaseWidthMaxTo(1);
        expect(info.width).toBe(10);
    });
});
