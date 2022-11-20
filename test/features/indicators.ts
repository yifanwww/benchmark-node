import crypto from 'crypto';

import { BenchmarkJob, ConfidenceLevel, StatisticIndicator } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    indicators: [
        StatisticIndicator.Min,
        StatisticIndicator.Q1,
        StatisticIndicator.Median,
        StatisticIndicator.Q3,
        StatisticIndicator.Max,
        StatisticIndicator.Ops,
        StatisticIndicator.Iterations,
        StatisticIndicator.CIError(ConfidenceLevel.L50),
        StatisticIndicator.CIError(ConfidenceLevel.L70),
        StatisticIndicator.CIError(ConfidenceLevel.L75),
        StatisticIndicator.CIError(ConfidenceLevel.L80),
        StatisticIndicator.CIError(ConfidenceLevel.L85),
        StatisticIndicator.CIError(ConfidenceLevel.L90),
        StatisticIndicator.CIError(ConfidenceLevel.L92),
        StatisticIndicator.CIError(ConfidenceLevel.L95),
        StatisticIndicator.CIError(ConfidenceLevel.L96),
        StatisticIndicator.CIError(ConfidenceLevel.L97),
        StatisticIndicator.CIError(ConfidenceLevel.L98),
        StatisticIndicator.CIError(ConfidenceLevel.L99),
        StatisticIndicator.CIError(ConfidenceLevel.L999),
        StatisticIndicator.CIError(ConfidenceLevel.L9999),
    ],
})
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), { measurementCount: 5 })
    .run();
