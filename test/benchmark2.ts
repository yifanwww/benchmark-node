import crypto from 'crypto';

import { Benchmark } from '../src';

class RandomGenerator {
    private static _chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \\';
    private static _charbytes = Buffer.from(RandomGenerator._chars, 'ascii');

    public string(length: number): string {
        const bytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = RandomGenerator._charbytes[bytes[i] % 64];
        }
        return bytes.toString('ascii');
    }
}

let testStr: string;

const benchmark = new Benchmark();

benchmark.addSetup(() => {
    const rg = new RandomGenerator();
    testStr = rg.string(10_000);
});

benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));
benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));

benchmark.run();
