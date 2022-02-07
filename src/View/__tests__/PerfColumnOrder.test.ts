import { Column } from '../../ConfigOptions';
import { PerfColumnOrder } from '../PerfColumnOrder';

describe(`Test class \`${PerfColumnOrder.name}\``, () => {
    it('gets default perf column order', () => {
        const order = new PerfColumnOrder();
        expect(order.getOrder()).toStrictEqual([Column.Mean, Column.StdError, Column.StdDev]);
    });

    it('changes perf column order', () => {
        const order = new PerfColumnOrder();
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
