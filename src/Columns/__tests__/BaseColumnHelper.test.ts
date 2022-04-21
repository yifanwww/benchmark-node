import { Statistics } from '../../Data';
import { BaseColumn } from '../BaseColumn';
import { BaseColumnHelper } from '../BaseColumnHelper';
import { ColumnType } from '../ColumnType';

describe(`Test class \`${BaseColumnHelper.name}\``, () => {
    it(`calls method ${BaseColumnHelper.prototype.calculateMaxLen.name}`, () => {
        const stats = [
            new Statistics('name', [], 1),
            new Statistics('long-name', [], 1),
            new Statistics('long-long-name', [], 1),
            new Statistics('long-long-long-long-name', [], 1),
        ];

        const helper = new BaseColumnHelper(new BaseColumn(ColumnType.Fn, 'Function', (_stats) => _stats.name));
        helper.calculateMaxLen(stats);

        expect(helper.maxLength).toBe(24);
    });
});
