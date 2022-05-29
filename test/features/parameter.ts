import crypto, { BinaryToTextEncoding } from 'crypto';

import { Arguments, BenchmarkJob, Params } from '../../src';

let testStr: Buffer;

new BenchmarkJob()
    .setSetup(
        (size: number) => {
            testStr = crypto.randomBytes(size);
        },
        [new Params(1000, 10_000)],
    )
    .add('md5', (encoding: BinaryToTextEncoding) => crypto.createHash('md5').update(testStr).digest(encoding), {
        args: [new Arguments<[BinaryToTextEncoding]>('hex'), new Arguments<[BinaryToTextEncoding]>('base64')],
        measurementCount: 5,
    })
    .add('sha256', (encoding: BinaryToTextEncoding) => crypto.createHash('sha256').update(testStr).digest(encoding), {
        args: [new Arguments<[BinaryToTextEncoding]>('hex'), new Arguments<[BinaryToTextEncoding]>('base64')],
        measurementCount: 5,
    })
    .run();
