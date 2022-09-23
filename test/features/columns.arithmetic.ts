import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Min, Column.Q1, Column.Median, Column.Q3, Column.Max] })
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/*
BenchmarkNode v0.7.2-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev |       Min |        Q1 |    Median |        Q3 |       Max |
|---------:|----------:|----------:|----------:|----------:|----------:|----------:|----------:|----------:|
|      md5 | 13.121 us | 0.1362 us | 0.2460 us | 12.610 us | 13.143 us | 13.255 us | 13.298 us | 13.340 us |
|   sha256 |  6.460 us | 0.0498 us | 0.0899 us |  6.372 us |  6.393 us |  6.459 us |  6.486 us |  6.672 us |
 */
