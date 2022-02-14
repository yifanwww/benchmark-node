import { Mathematics } from '../Mathematics';

describe(`Test method \`${Mathematics.name}${Mathematics.sum.name}\``, () => {
    it('returns average value', () => {
        expect(Mathematics.sum([1, 2, 3, 4, 4])).toBe(14);
    });
});

describe(`Test method \`${Mathematics.name}${Mathematics.mean.name}\``, () => {
    it('returns average value', () => {
        expect(Mathematics.mean([1, 2, 3, 4, 4])).toBe(2.8);
    });
});

describe(`Test method \`${Mathematics.name}${Mathematics.variance.name}\``, () => {
    it('returns variance value', () => {
        expect(Mathematics.variance([1, 2, 3, 4, 4], 2.8)).toBe(1.7);
    });
});
