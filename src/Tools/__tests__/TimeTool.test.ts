import { TimeTool } from '../TimeTool';
import { TimeUnit } from '../TimeUnit';

describe(`Test class \`${TimeTool.name}\``, () => {
    it(`calls static method ${TimeTool.convert.name}`, () => {
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

    it(`calls static method ${TimeTool.ms2ns.name}`, () => {
        expect(TimeTool.ms2ns(1)).toBe(1_000_000);
    });

    it(`calls static method ${TimeTool.hrtime2ns.name}`, () => {
        expect(TimeTool.hrtime2ns([0, 1000])).toBe(1_000);
        expect(TimeTool.hrtime2ns([1, 1])).toBe(1_000_000_001);
    });

    it(`calls static method ${TimeTool.sleep.name}`, () => {
        const begin = process.hrtime();

        TimeTool.sleep(10_000);

        expect(TimeTool.hrtime2ns(process.hrtime(begin))).toBeGreaterThan(10_000);
    });
});
