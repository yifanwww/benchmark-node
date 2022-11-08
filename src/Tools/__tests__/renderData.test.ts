import { renderData } from '../renderData';
import { TimeUnit } from '../TimeUnit';
import { UnitType } from '../UnitType';

describe(`Test class \`${renderData.name}\``, () => {
    it('renders dimensionless', () => {
        expect(renderData(1.23456, UnitType.DIMENSIONLESS, 1, TimeUnit.NS)).toBe('1.2');
        expect(renderData(1.23456, UnitType.DIMENSIONLESS, 2, TimeUnit.NS)).toBe('1.23');
        expect(renderData(1.23456, UnitType.DIMENSIONLESS, 3, TimeUnit.NS)).toBe('1.235');
        expect(renderData(1.23456, UnitType.DIMENSIONLESS, 4, TimeUnit.NS)).toBe('1.2346');
        expect(renderData(1.23456, UnitType.DIMENSIONLESS, 5, TimeUnit.NS)).toBe('1.23456');
    });

    it('renders dimensionlessInteger', () => {
        expect(renderData(100, UnitType.DIMENSIONLESS_INTEGER, 0, TimeUnit.NS)).toBe('100');
    });

    it('renders string', () => {
        expect(renderData('1.23456', UnitType.ORIGIN, 0, TimeUnit.NS)).toBe('1.23456');
    });

    it('renders Time', () => {
        expect(renderData(1.23456, UnitType.TIME, 1, TimeUnit.NS)).toBe('1.2 ns');
        expect(renderData(1.23456, UnitType.TIME, 2, TimeUnit.NS)).toBe('1.23 ns');
        expect(renderData(1.23456, UnitType.TIME, 3, TimeUnit.NS)).toBe('1.235 ns');
        expect(renderData(1.23456, UnitType.TIME, 4, TimeUnit.NS)).toBe('1.2346 ns');
        expect(renderData(1.23456, UnitType.TIME, 5, TimeUnit.NS)).toBe('1.23456 ns');

        expect(renderData(1234.56, UnitType.TIME, 1, TimeUnit.US)).toBe('1.2 us');
        expect(renderData(1234.56, UnitType.TIME, 2, TimeUnit.US)).toBe('1.23 us');
        expect(renderData(1234.56, UnitType.TIME, 3, TimeUnit.US)).toBe('1.235 us');
        expect(renderData(1234.56, UnitType.TIME, 4, TimeUnit.US)).toBe('1.2346 us');
        expect(renderData(1234.56, UnitType.TIME, 5, TimeUnit.US)).toBe('1.23456 us');

        expect(renderData(1234560, UnitType.TIME, 1, TimeUnit.MS)).toBe('1.2 ms');
        expect(renderData(1234560, UnitType.TIME, 2, TimeUnit.MS)).toBe('1.23 ms');
        expect(renderData(1234560, UnitType.TIME, 3, TimeUnit.MS)).toBe('1.235 ms');
        expect(renderData(1234560, UnitType.TIME, 4, TimeUnit.MS)).toBe('1.2346 ms');
        expect(renderData(1234560, UnitType.TIME, 5, TimeUnit.MS)).toBe('1.23456 ms');

        expect(renderData(1234560000, UnitType.TIME, 1, TimeUnit.S)).toBe('1.2 s');
        expect(renderData(1234560000, UnitType.TIME, 2, TimeUnit.S)).toBe('1.23 s');
        expect(renderData(1234560000, UnitType.TIME, 3, TimeUnit.S)).toBe('1.235 s');
        expect(renderData(1234560000, UnitType.TIME, 4, TimeUnit.S)).toBe('1.2346 s');
        expect(renderData(1234560000, UnitType.TIME, 5, TimeUnit.S)).toBe('1.23456 s');
    });
});
