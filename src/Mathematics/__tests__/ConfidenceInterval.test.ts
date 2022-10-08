import { ConfidenceInterval } from '../ConfidenceInterval';
import { ConfidenceLevel } from '../ConfidenceLevel';

describe(`Test class ${ConfidenceInterval.name}`, () => {
    it('should get numbers if degree of freedom is a positive number', () => {
        const ci = new ConfidenceInterval(2, 5, 1, ConfidenceLevel.L999);

        expect(ci.margin).not.toBeNaN();
        expect(ci.marginPercent).not.toBeNaN();
        expect(ci.lower).not.toBeNaN();
        expect(ci.upper).not.toBeNaN();

        expect(ci.level).toBe(ConfidenceLevel.L999);
    });

    it('should get NaN if degree of freedom is a non-positive number', () => {
        const ci = new ConfidenceInterval(1, 5, 1, ConfidenceLevel.L999);

        expect(ci.margin).toBeNaN();
        expect(ci.marginPercent).toBeNaN();
        expect(ci.lower).toBeNaN();
        expect(ci.upper).toBeNaN();

        expect(ci.level).toBe(ConfidenceLevel.L999);
    });
});
