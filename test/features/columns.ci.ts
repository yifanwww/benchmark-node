import crypto from 'crypto';

import { BenchmarkJob, Column, ConfidenceLevel } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    columns: [
        Column.CIError(ConfidenceLevel.L50),
        Column.CIError(ConfidenceLevel.L70),
        Column.CIError(ConfidenceLevel.L75),
        Column.CIError(ConfidenceLevel.L80),
        Column.CIError(ConfidenceLevel.L85),
        Column.CIError(ConfidenceLevel.L90),
        Column.CIError(ConfidenceLevel.L92),
        Column.CIError(ConfidenceLevel.L95),
        Column.CIError(ConfidenceLevel.L96),
        Column.CIError(ConfidenceLevel.L97),
        Column.CIError(ConfidenceLevel.L98),
        Column.CIError(ConfidenceLevel.L99),
        Column.CIError(ConfidenceLevel.L999),
        Column.CIError(ConfidenceLevel.L9999),
    ],
})
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/* eslint-disable max-len */

/*
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |    Error |    StdDev | CI50% Margin | CI70% Margin | CI75% Margin | CI80% Margin | CI85% Margin | CI90% Margin | CI92% Margin | CI95% Margin | CI96% Margin | CI97% Margin | CI98% Margin | CI99% Margin | CI99.9% Margin | CI99.99% Margin |
|----------|-----------|----------|-----------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|----------------|-----------------|
|      md5 | 12,645 ns | 70.98 ns | 128.17 ns |     22.91 ns |     35.62 ns |     39.72 ns |     44.51 ns |     50.40 ns |     58.29 ns |     62.46 ns |     70.98 ns |     74.91 ns |     79.92 ns |     86.85 ns |     98.51 ns |      137.02 ns |       177.49 ns |
|   sha256 |  6,010 ns | 32.70 ns |  59.05 ns |     10.56 ns |     16.41 ns |     18.30 ns |     20.51 ns |     23.22 ns |     26.86 ns |     28.78 ns |     32.70 ns |     34.52 ns |     36.82 ns |     40.02 ns |     45.39 ns |       63.13 ns |        81.78 ns |
 */
