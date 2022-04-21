import { Statistics } from '../../Data';
import { testConstants } from '../../TestTools/constants.test';
import { ColumnType } from '../ColumnType';
import { StatisticColumn } from '../StatisticColumn';
import { StatisticColumnHelper } from '../StatisticColumnHelper';
import { UnitType } from '../UnitType';

describe(`Test class \`${StatisticColumnHelper.name}\``, () => {
    const formatFnName = StatisticColumnHelper.prototype.format.name;

    it(`calls method ${formatFnName} with dimensionless statistic column`, () => {
        const stats = [new Statistics('name', testConstants.measurements.slice(), testConstants.ops)];

        const helper = new StatisticColumnHelper(
            new StatisticColumn(ColumnType.MEAN, 'name', 'desc', (_stats) => _stats.mean, UnitType.Dimensionless),
        );
        helper.findFractionDigit(stats);

        const output = helper.format(stats[0]);

        expect(output).toMatchSnapshot();
    });

    it(`calls method ${formatFnName} with dimensionless integer statistic column`, () => {
        const stats = [new Statistics('name', testConstants.measurements.slice(), testConstants.ops)];

        const helper = new StatisticColumnHelper(
            new StatisticColumn(ColumnType.MEAN, 'name', 'desc', (_stats) => _stats.n, UnitType.DimensionlessInteger),
        );
        helper.findFractionDigit(stats);

        const output = helper.format(stats[0]);

        expect(output).toMatchSnapshot();
    });

    it(`calls method ${formatFnName} with time statistic column`, () => {
        const stats = [new Statistics('name', testConstants.measurements.slice(), testConstants.ops)];

        const helper = new StatisticColumnHelper(
            new StatisticColumn(ColumnType.MEAN, 'name', 'desc', (_stats) => _stats.mean, UnitType.Time),
        );
        helper.findFractionDigit(stats);

        const output = helper.format(stats[0]);

        expect(output).toMatchSnapshot();
    });
});
