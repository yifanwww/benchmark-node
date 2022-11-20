import crypto from 'crypto';

import { BenchmarkJob, ConfidenceLevel, StatisticIndicator } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    indicators: [
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
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/* eslint-disable max-len */

/*
BenchmarkNode v0.8.0-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |      Mean |     Error |    StdDev | CI50% Margin | CI70% Margin | CI75% Margin | CI80% Margin | CI85% Margin | CI90% Margin | CI92% Margin | CI95% Margin | CI96% Margin | CI97% Margin | CI98% Margin | CI99% Margin | CI99.9% Margin | CI99.99% Margin |
|---------:|----------:|----------:|----------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|---------------:|----------------:|
|      md5 | 12.847 us | 0.2537 us | 0.4581 us |    0.0819 us |    0.1273 us |    0.1420 us |    0.1591 us |    0.1802 us |    0.2083 us |    0.2233 us |    0.2537 us |    0.2678 us |    0.2856 us |    0.3104 us |    0.3521 us |      0.4897 us |       0.6344 us |
|   sha256 |  6.324 us | 0.0552 us | 0.0997 us |    0.0178 us |    0.0277 us |    0.0309 us |    0.0346 us |    0.0392 us |    0.0453 us |    0.0486 us |    0.0552 us |    0.0583 us |    0.0622 us |    0.0675 us |    0.0766 us |      0.1066 us |       0.1380 us |
 */
