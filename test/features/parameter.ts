import crypto from 'crypto';

import { BenchmarkJob, Params } from '../../src';

let testStr: Buffer;

new BenchmarkJob()
    .addSetup(
        (_: number, size: number) => {
            testStr = crypto.randomBytes(size);
        },
        [new Params(1000, 10_000), new Params(1000, 10_000)],
    )
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), { measurementCount: 5 })
    .run();
