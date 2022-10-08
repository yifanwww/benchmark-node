import { Mathematics } from '../Mathematics';

describe(`Test class static method \`${Mathematics.name}.${Mathematics.sum.name}\``, () => {
    it('should sum the numbers', () => {
        expect(Mathematics.sum([1, 2, 3, 4, 4])).toBe(14);
    });
});

describe(`Test class static method \`${Mathematics.name}.${Mathematics.mean.name}\``, () => {
    it('should calculate the mean of the numbers', () => {
        expect(Mathematics.mean([1, 2, 3, 4, 4])).toBe(2.8);
    });
});

describe(`Test class static method \`${Mathematics.name}.${Mathematics.variance.name}\``, () => {
    it('should calculate the variance of the numbers', () => {
        expect(Mathematics.variance([1, 2, 3, 4, 4], 2.8)).toBe(1.7);
    });
});
