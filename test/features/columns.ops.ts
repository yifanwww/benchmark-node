import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Ops] })
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();
