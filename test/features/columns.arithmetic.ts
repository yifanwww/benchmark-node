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
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |    Error |   StdDev |       Min |        Q1 |    Median |        Q3 |       Max |
|----------|-----------|----------|----------|-----------|-----------|-----------|-----------|-----------|
|      md5 | 12,491 ns | 49.47 ns | 89.33 ns | 12,303 ns | 12,484 ns | 12,509 ns | 12,537 ns | 12,638 ns |
|   sha256 |  6,026 ns | 21.68 ns | 39.16 ns |  5,969 ns |  6,001 ns |  6,042 ns |  6,056 ns |  6,094 ns |
 */
