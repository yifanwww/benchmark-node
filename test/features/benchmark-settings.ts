import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Min, Column.Q1, Column.Median, Column.Q3, Column.Max] })
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), {
        delay: 10,
        initOps: 1_000,
        measurementCount: 5,
        minMeasurementTime: 100,
        warmupCount: 3,
    })
    .run();
