import { Statistics } from '../../Data';
import { TableColumn } from '../TableColumn';
import { TableColumnHelper } from '../TableColumnHelper';

describe(`Test class \`${TableColumnHelper.name}\``, () => {
    it(`calls method ${TableColumnHelper.prototype.calculateMaxLen.name}`, () => {
        const stats = [
            new Statistics('name', [], 1),
            new Statistics('long-name', [], 1),
            new Statistics('long-long-name', [], 1),
            new Statistics('long-long-long-long-name', [], 1),
        ];

        const helper = new TableColumnHelper(new TableColumn('Function', (_stats) => _stats.name));
        helper.calculateMaxLen(stats);

        expect(helper.maxLength).toBe(24);
    });
});
