import crypto from 'crypto';

import { BenchmarkJob, StatisticIndicator } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ indicators: [StatisticIndicator.Ops] })
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

| Function |      Mean |     Error |    StdDev |    Op/s |
|---------:|----------:|----------:|----------:|--------:|
|      md5 | 12.757 us | 0.2680 us | 0.4840 us |  78,390 |
|   sha256 |  6.277 us | 0.0189 us | 0.0341 us | 159,309 |
 */
