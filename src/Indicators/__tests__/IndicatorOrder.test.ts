import { IndicatorOrder } from '../IndicatorOrder';
import { StatisticIndicator } from '../StatisticIndicator';

describe(`Test method \`${IndicatorOrder.name}.prototype.${IndicatorOrder.prototype.getOrder.name}\``, () => {
    it('should get the default indicator order', () => {
        expect(new IndicatorOrder().getOrder()).toStrictEqual([
            StatisticIndicator.Mean,
            StatisticIndicator.Error,
            StatisticIndicator.StdDev,
        ]);
    });
});

describe(`Test method \`${IndicatorOrder.name}.prototype.${IndicatorOrder.prototype.add.name}\``, () => {
    it('should change the indicator order', () => {
        const order = new IndicatorOrder();
        order.add(StatisticIndicator.Min);
        order.add([StatisticIndicator.Mean, StatisticIndicator.Error, StatisticIndicator.StdDev]);
        order.add([StatisticIndicator.Median, StatisticIndicator.Min, StatisticIndicator.Max]);
        order.add([StatisticIndicator.Median, StatisticIndicator.Max, StatisticIndicator.Min]);
        order.add([StatisticIndicator.Q1, StatisticIndicator.Median, StatisticIndicator.Q3]);
        expect(order.getOrder()).toStrictEqual([
            StatisticIndicator.Mean,
            StatisticIndicator.Error,
            StatisticIndicator.StdDev,
            StatisticIndicator.Min,
            StatisticIndicator.Median,
            StatisticIndicator.Max,
            StatisticIndicator.Q1,
            StatisticIndicator.Q3,
        ]);
    });
});
