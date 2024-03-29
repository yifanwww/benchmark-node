import crypto from 'crypto';

import { BenchmarkJob, Params, StatisticIndicator } from '../src';

let buffer: Buffer;

new BenchmarkJob({
    indicators: [StatisticIndicator.Median, StatisticIndicator.Min, StatisticIndicator.Max, StatisticIndicator.Ops],
})
    .setSetup(
        (size: number) => {
            buffer = crypto.randomBytes(size);
        },
        [new Params(1000, 10_000)],
    )
    .add('md5', () => crypto.createHash('md5').update(buffer).digest('hex'))
    .add('sha1', () => crypto.createHash('sha1').update(buffer).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(buffer).digest('hex'))
    .add('sha384', () => crypto.createHash('sha384').update(buffer).digest('hex'))
    .add('sha512', () => crypto.createHash('sha512').update(buffer).digest('hex'))
    .run();
