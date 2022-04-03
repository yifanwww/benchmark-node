import { Statistics } from '../../Data';
import { Arguments } from '../../Parameterization';
import { testConstants } from '../../TestTools/constants.test';
import { ArgumentColumn } from '../ArgumentColumn';
import { ArgumentColumnHelper } from '../ArgumentColumnHelper';

describe(`Test class \`${ArgumentColumnHelper.name}\``, () => {
    const formatFnName = ArgumentColumnHelper.prototype.format.name;

    it(`calls method ${formatFnName} with no args`, () => {
        const stats = new Statistics('name', testConstants.measurements.slice(), testConstants.ops);

        const helper = new ArgumentColumnHelper(new ArgumentColumn(0));
        expect(helper.format(stats)).toBe('?');
    });

    it(`calls method ${formatFnName} with short args`, () => {
        const stats = new Statistics(
            'name',
            testConstants.measurements.slice(),
            testConstants.ops,
            new Arguments('Hello', 123.456),
        );

        const helper1 = new ArgumentColumnHelper(new ArgumentColumn(0));
        expect(helper1.format(stats)).toBe('Hello');

        const helper2 = new ArgumentColumnHelper(new ArgumentColumn(1));
        expect(helper2.format(stats)).toBe('123.456');

        const helper3 = new ArgumentColumnHelper(new ArgumentColumn(2));
        expect(helper3.format(stats)).toBe('?');
    });

    it(`calls method ${formatFnName} with long args`, () => {
        const stats = new Statistics(
            'name',
            testConstants.measurements.slice(),
            testConstants.ops,
            new Arguments('Hello benchmark-node'),
        );

        const helper = new ArgumentColumnHelper(new ArgumentColumn(0));
        expect(helper.format(stats)).toBe('Hello benc...');
    });
});
