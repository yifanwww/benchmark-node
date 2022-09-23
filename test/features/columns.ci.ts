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
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/* eslint-disable max-len */

/*
BenchmarkNode v0.7.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev | CI50% Margin | CI70% Margin | CI75% Margin | CI80% Margin | CI85% Margin | CI90% Margin | CI92% Margin | CI95% Margin | CI96% Margin | CI97% Margin | CI98% Margin | CI99% Margin | CI99.9% Margin | CI99.99% Margin |
|---------:|----------:|----------:|----------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|-------------:|---------------:|----------------:|
|      md5 | 13.082 us | 0.1043 us | 0.1884 us |    0.0337 us |    0.0524 us |    0.0584 us |    0.0654 us |    0.0741 us |    0.0857 us |    0.0918 us |    0.1043 us |    0.1101 us |    0.1175 us |    0.1277 us |    0.1448 us |      0.2014 us |       0.2609 us |
|   sha256 |  6.475 us | 0.0426 us | 0.0770 us |    0.0138 us |    0.0214 us |    0.0239 us |    0.0267 us |    0.0303 us |    0.0350 us |    0.0375 us |    0.0426 us |    0.0450 us |    0.0480 us |    0.0522 us |    0.0592 us |      0.0823 us |       0.1066 us |
 */
