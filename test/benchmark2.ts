import crypto from 'crypto';

import { Benchmark, Column } from '../src';

let testStr: Buffer;

const benchmark = new Benchmark({ columns: [Column.Median, Column.Min, Column.Max] });

benchmark.addSetup(() => {
    testStr = crypto.randomBytes(10_000);
});

benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));
benchmark.add('sha1', () => crypto.createHash('sha1').update(testStr).digest('hex'));
benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));
benchmark.add('sha384', () => crypto.createHash('sha384').update(testStr).digest('hex'));
benchmark.add('sha512', () => crypto.createHash('sha512').update(testStr).digest('hex'));

benchmark.run();
