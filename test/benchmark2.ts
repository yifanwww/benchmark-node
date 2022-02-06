import crypto from 'crypto';

import { Arguments, Benchmark } from '../src';

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

const benchmark = new Benchmark();

const rg = new RandomGenerator();
const testStr = rg.string(10_000);

benchmark.add(
    function sha256(str: string) {
        const hash = crypto.createHash('sha256');
        return hash.update(str).digest('hex');
    },
    {
        args: new Arguments(testStr),
    },
);

benchmark.add(
    function md5(str: string) {
        const hash = crypto.createHash('md5');
        return hash.update(str).digest('hex');
    },
    {
        args: new Arguments(testStr),
    },
);

benchmark.run();
