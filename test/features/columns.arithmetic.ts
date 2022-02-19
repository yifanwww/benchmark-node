import crypto from 'crypto';

import { Benchmark, Column } from '../../src';

let testStr: Buffer;

new Benchmark({ columns: [Column.Min, Column.Q1, Column.Median, Column.Q3, Column.Max] })
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();
