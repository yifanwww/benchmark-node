import crypto from 'crypto';

import { Benchmark, Column, ConfidenceLevel } from '../../src';

let testStr: Buffer;

const benchmark = new Benchmark({
    order: [Column.Median, Column.Min, Column.Max, Column.CIError(ConfidenceLevel.L80), Column.Ops],
});

benchmark.addSetup(() => {
    testStr = crypto.randomBytes(10_000);
});

benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));
benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));

benchmark.run();
