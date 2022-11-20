import crypto from 'crypto';

import { BenchmarkJob, StatisticIndicator } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    indicators: [
        StatisticIndicator.Min,
        StatisticIndicator.Q1,
        StatisticIndicator.Median,
        StatisticIndicator.Q3,
        StatisticIndicator.Max,
    ],
})
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/*
BenchmarkNode v0.8.0-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |      Mean |     Error |    StdDev |       Min |        Q1 |    Median |        Q3 |       Max |
|---------:|----------:|----------:|----------:|----------:|----------:|----------:|----------:|----------:|
|      md5 | 12.778 us | 0.2586 us | 0.4670 us | 12.314 us | 12.417 us | 12.522 us | 13.288 us | 13.465 us |
|   sha256 |  6.294 us | 0.0689 us | 0.1244 us |  6.215 us |  6.236 us |  6.245 us |  6.284 us |  6.596 us |
 */
