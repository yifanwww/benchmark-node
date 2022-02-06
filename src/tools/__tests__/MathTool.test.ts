import { MathTool } from '../MathTool';

describe(`Test method \`${MathTool.name}${MathTool.sum.name}\``, () => {
    it('returns average value', () => {
        expect(MathTool.sum([1, 2, 3, 4, 4])).toBe(14);
    });
});

describe(`Test method \`${MathTool.name}${MathTool.mean.name}\``, () => {
    it('returns average value', () => {
        expect(MathTool.mean([1, 2, 3, 4, 4])).toBe(2.8);
    });
});

describe(`Test method \`${MathTool.name}${MathTool.variance.name}\``, () => {
    it('returns variance value', () => {
        expect(MathTool.variance([1, 2, 3, 4, 4], 2.8)).toBe(1.7);
    });
});
