import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Min, Column.Q1, Column.Median, Column.Q3, Column.Max] })
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/*
BenchmarkNode v0.6.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev |       Min |        Q1 |    Median |        Q3 |       Max |
|----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
|      md5 | 12.588 us | 0.0512 us | 0.0924 us | 12.402 us | 12.563 us | 12.603 us | 12.640 us | 12.728 us |
|   sha256 |  6.058 us | 0.0292 us | 0.0528 us |  5.989 us |  6.026 us |  6.059 us |  6.097 us |  6.185 us |
 */
