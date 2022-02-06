import { TimeTool, TimeUnit } from '../TimeTool';

describe(`Test class \`${TimeTool.name}\``, () => {
    it(TimeTool.convert.name, () => {
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

    it(TimeTool.ms2ns.name, () => {
        expect(TimeTool.ms2ns(1)).toBe(1_000_000);
    });
});
