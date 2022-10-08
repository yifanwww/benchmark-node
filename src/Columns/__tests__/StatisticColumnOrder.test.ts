import { Column } from '../Column';
import { StatisticColumnOrder } from '../StatisticColumnOrder';

describe(`Test class \`${StatisticColumnOrder.name}\``, () => {
    it('should get default statistic column order', () => {
        const order = new StatisticColumnOrder();
        expect(order.getOrder()).toStrictEqual([Column.Mean, Column.Error, Column.StdDev]);
    });

    it('should change statistic column order', () => {
        const order = new StatisticColumnOrder();
        order.addOrder(Column.Min);
        order.addOrder([Column.Median, Column.Min, Column.Max]);
        order.addOrder([Column.Median, Column.Max, Column.Min]);
        order.addOrder([Column.Q1, Column.Median, Column.Q3]);
        expect(order.getOrder()).toStrictEqual([
            Column.Mean,
            Column.Error,
            Column.StdDev,
            Column.Max,
            Column.Min,
            Column.Q1,
            Column.Median,
            Column.Q3,
        ]);
    });
});
