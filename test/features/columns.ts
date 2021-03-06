import crypto from 'crypto';

import { BenchmarkJob, Column, ConfidenceLevel } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    columns: [
        Column.Min,
        Column.Q1,
        Column.Median,
        Column.Q3,
        Column.Max,
        Column.Ops,
        Column.Iterations,
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
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), { measurementCount: 5 })
    .run();
