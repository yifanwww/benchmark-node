import crypto from 'crypto';

import { BenchmarkJob, Column } from '../src';

let buffer: Buffer;

new BenchmarkJob({ columns: [Column.Median, Column.Min, Column.Max, Column.Ops] })
    .addSetup(() => {
        buffer = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(buffer).digest('hex'))
    .add('sha1', () => crypto.createHash('sha1').update(buffer).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(buffer).digest('hex'))
    .add('sha384', () => crypto.createHash('sha384').update(buffer).digest('hex'))
    .add('sha512', () => crypto.createHash('sha512').update(buffer).digest('hex'))
    .run();
