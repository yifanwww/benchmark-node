import { createClassJestHelper } from '../../__tests__/class';
import { IndicatorOrder } from '../IndicatorOrder';
import { StatisticIndicator } from '../StatisticIndicator';

const { buildMethodName } = createClassJestHelper(IndicatorOrder);

describe(`Test method \`${buildMethodName('getOrder')}\``, () => {
    it('should get the default indicator order', () => {
        expect(new IndicatorOrder().getOrder()).toStrictEqual([
            StatisticIndicator.Mean,
            StatisticIndicator.Error,
            StatisticIndicator.StdDev,
        ]);
    });
});

describe(`Test method \`${buildMethodName('add')}\``, () => {
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
