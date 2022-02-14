import { Mathematics } from '../Mathematics';

describe(`Test class ${Mathematics}`, () => {
    it(`tests static method ${Mathematics.sum.name}`, () => {
        expect(Mathematics.sum([1, 2, 3, 4, 4])).toBe(14);
    });

    it(`tests static method ${Mathematics.mean.name}`, () => {
        expect(Mathematics.mean([1, 2, 3, 4, 4])).toBe(2.8);
    });

    it(`tests static method ${Mathematics.variance.name}`, () => {
        expect(Mathematics.variance([1, 2, 3, 4, 4], 2.8)).toBe(1.7);
    });
});
