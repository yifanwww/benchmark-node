import { createClassJestHelper } from '../../__tests__/class';
import { Formatter } from '../Formatter';

const { buildStaticMethodName } = createClassJestHelper(Formatter);

describe(`Test static method \`${buildStaticMethodName('beautifyNumber')}\``, () => {
    it('beautifies numbers', () => {
        expect(Formatter.beautifyNumber(100)).toBe('100');
        expect(Formatter.beautifyNumber(100.01)).toBe('100.01');
        expect(Formatter.beautifyNumber(1_000_000)).toBe('1,000,000');
        expect(Formatter.beautifyNumber(1_000_000.001_001_001)).toBe('1,000,000.001001001');

        expect(Formatter.beautifyNumber(100, true)).toBe('100');
        expect(Formatter.beautifyNumber(100.01, true)).toBe('100.01');
        expect(Formatter.beautifyNumber(1_000_000, true)).toBe('1,000,000');
        expect(Formatter.beautifyNumber(1_000_000.001_001_001, true)).toBe('1,000,000.001,001,001');
    });

    it('beautifies number strings', () => {
        expect(Formatter.beautifyNumber('100')).toBe('100');
        expect(Formatter.beautifyNumber('100.01')).toBe('100.01');
        expect(Formatter.beautifyNumber('1000000')).toBe('1,000,000');
        expect(Formatter.beautifyNumber('1000000.001001001')).toBe('1,000,000.001001001');

        expect(Formatter.beautifyNumber('100', true)).toBe('100');
        expect(Formatter.beautifyNumber('100.01', true)).toBe('100.01');
        expect(Formatter.beautifyNumber('1000000', true)).toBe('1,000,000');
        expect(Formatter.beautifyNumber('1000000.001001001', true)).toBe('1,000,000.001,001,001');
    });
});

describe(`Test static method \`${buildStaticMethodName('limitStringLength')}\``, () => {
    it('limit string length', () => {
        expect(Formatter.limitStringLength('Hello!')).toBe('Hello!');
        expect(Formatter.limitStringLength('Hello world!')).toBe('Hello worl...');
    });
});
