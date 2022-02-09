import { Column } from '../../ConfigOptions';
import { StatisticColumnOrder } from '../StatisticColumnOrder';

describe(`Test class \`${StatisticColumnOrder.name}\``, () => {
    it('gets default statistic column order', () => {
        const order = new StatisticColumnOrder();
        expect(order.getOrder()).toStrictEqual([Column.Mean, Column.StdError, Column.StdDev]);
    });

    it('changes statistic column order', () => {
        const order = new StatisticColumnOrder();
        order.setOrder([Column.Median, Column.Min, Column.Max]);
        order.setOrder([Column.Median, Column.Max, Column.Min]);
        order.setOrder([Column.Q1, Column.Median, Column.Q3]);
        expect(order.getOrder()).toStrictEqual([
            Column.Mean,
            Column.StdError,
            Column.StdDev,
            Column.Max,
            Column.Min,
            Column.Q1,
            Column.Median,
            Column.Q3,
        ]);
    });
});
