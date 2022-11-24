import { createClassJestHelper } from '../../__tests__/class';
import { TimeTool } from '../TimeTool';
import { TimeUnit } from '../TimeUnit';

const { buildStaticMethodName } = createClassJestHelper(TimeTool);

describe(`Test static method \`${buildStaticMethodName('convert')}\``, () => {
    it('should convert time from a unit to another unit', () => {
        expect(TimeTool.convert(1, TimeUnit.NS, TimeUnit.NS)).toBe(1);
        expect(TimeTool.convert(1, TimeUnit.NS, TimeUnit.US)).toBe(0.001);
        expect(TimeTool.convert(1, TimeUnit.NS, TimeUnit.MS)).toBe(0.000_001);
        expect(TimeTool.convert(1, TimeUnit.NS, TimeUnit.S)).toBe(0.000_000_001);

        expect(TimeTool.convert(1, TimeUnit.US, TimeUnit.NS)).toBe(1_000);
        expect(TimeTool.convert(1, TimeUnit.US, TimeUnit.US)).toBe(1);
        expect(TimeTool.convert(1, TimeUnit.US, TimeUnit.MS)).toBe(0.001);
        expect(TimeTool.convert(1, TimeUnit.US, TimeUnit.S)).toBe(0.000_001);

        expect(TimeTool.convert(1, TimeUnit.MS, TimeUnit.NS)).toBe(1_000_000);
        expect(TimeTool.convert(1, TimeUnit.MS, TimeUnit.US)).toBe(1_000);
        expect(TimeTool.convert(1, TimeUnit.MS, TimeUnit.MS)).toBe(1);
        expect(TimeTool.convert(1, TimeUnit.MS, TimeUnit.S)).toBe(0.001);

        expect(TimeTool.convert(1, TimeUnit.S, TimeUnit.NS)).toBe(1_000_000_000);
        expect(TimeTool.convert(1, TimeUnit.S, TimeUnit.US)).toBe(1_000_000);
        expect(TimeTool.convert(1, TimeUnit.S, TimeUnit.MS)).toBe(1_000);
        expect(TimeTool.convert(1, TimeUnit.S, TimeUnit.S)).toBe(1);
    });
});

describe(`Test static method \`${buildStaticMethodName('ms2ns')}\``, () => {
    it('should convert ms time to ns time', () => {
        expect(TimeTool.ms2ns(1)).toBe(1_000_000);
    });
});

describe(`Test static method \`${buildStaticMethodName('hrtime2ns')}\``, () => {
    it('should convert hrtime to ns time', () => {
        expect(TimeTool.hrtime2ns([0, 1000])).toBe(1_000);
        expect(TimeTool.hrtime2ns([1, 1])).toBe(1_000_000_001);
    });
});

describe(`Test static method \`${buildStaticMethodName('sleep')}\``, () => {
    it('should sleep for some time', () => {
        const begin = process.hrtime();

        TimeTool.sleep(10_000);

        expect(TimeTool.hrtime2ns(process.hrtime(begin))).toBeGreaterThan(10_000);
    });
});
