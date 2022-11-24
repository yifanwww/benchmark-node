import { createClassJestHelper } from '../../__tests__/class';
import { Mathematics } from '../Mathematics';

const { buildStaticMethodName } = createClassJestHelper(Mathematics);

describe(`Test static method \`${buildStaticMethodName('sum')}\``, () => {
    it('should sum the numbers', () => {
        expect(Mathematics.sum([1, 2, 3, 4, 4])).toBe(14);
    });
});

describe(`Test static method \`${buildStaticMethodName('mean')}\``, () => {
    it('should calculate the mean of the numbers', () => {
        expect(Mathematics.mean([1, 2, 3, 4, 4])).toBe(2.8);
    });
});

describe(`Test static method \`${buildStaticMethodName('variance')}\``, () => {
    it('should calculate the variance of the numbers', () => {
        expect(Mathematics.variance([1, 2, 3, 4, 4], 2.8)).toBe(1.7);
    });
});
