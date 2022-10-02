import { TimeUnit } from '../TimeUnit';
import { UnitType } from '../UnitType';
import { renderData } from '../renderData';

describe(`Test class \`${renderData.name}\``, () => {
    it('renders dimensionless', () => {
        expect(renderData(1.23456, UnitType.Dimensionless, 1, TimeUnit.NS)).toBe('1.2');
        expect(renderData(1.23456, UnitType.Dimensionless, 2, TimeUnit.NS)).toBe('1.23');
        expect(renderData(1.23456, UnitType.Dimensionless, 3, TimeUnit.NS)).toBe('1.235');
        expect(renderData(1.23456, UnitType.Dimensionless, 4, TimeUnit.NS)).toBe('1.2346');
        expect(renderData(1.23456, UnitType.Dimensionless, 5, TimeUnit.NS)).toBe('1.23456');
    });

    it('renders dimensionlessInteger', () => {
        expect(renderData(100, UnitType.DimensionlessInteger, 0, TimeUnit.NS)).toBe('100');
    });

    it('renders string', () => {
        expect(renderData('1.23456', UnitType.Origin, 0, TimeUnit.NS)).toBe('1.23456');
    });

    it('renders Time', () => {
        expect(renderData(1.23456, UnitType.Time, 1, TimeUnit.NS)).toBe('1.2 ns');
        expect(renderData(1.23456, UnitType.Time, 2, TimeUnit.NS)).toBe('1.23 ns');
        expect(renderData(1.23456, UnitType.Time, 3, TimeUnit.NS)).toBe('1.235 ns');
        expect(renderData(1.23456, UnitType.Time, 4, TimeUnit.NS)).toBe('1.2346 ns');
        expect(renderData(1.23456, UnitType.Time, 5, TimeUnit.NS)).toBe('1.23456 ns');

        expect(renderData(1234.56, UnitType.Time, 1, TimeUnit.US)).toBe('1.2 us');
        expect(renderData(1234.56, UnitType.Time, 2, TimeUnit.US)).toBe('1.23 us');
        expect(renderData(1234.56, UnitType.Time, 3, TimeUnit.US)).toBe('1.235 us');
        expect(renderData(1234.56, UnitType.Time, 4, TimeUnit.US)).toBe('1.2346 us');
        expect(renderData(1234.56, UnitType.Time, 5, TimeUnit.US)).toBe('1.23456 us');

        expect(renderData(1234560, UnitType.Time, 1, TimeUnit.MS)).toBe('1.2 ms');
        expect(renderData(1234560, UnitType.Time, 2, TimeUnit.MS)).toBe('1.23 ms');
        expect(renderData(1234560, UnitType.Time, 3, TimeUnit.MS)).toBe('1.235 ms');
        expect(renderData(1234560, UnitType.Time, 4, TimeUnit.MS)).toBe('1.2346 ms');
        expect(renderData(1234560, UnitType.Time, 5, TimeUnit.MS)).toBe('1.23456 ms');

        expect(renderData(1234560000, UnitType.Time, 1, TimeUnit.S)).toBe('1.2 s');
        expect(renderData(1234560000, UnitType.Time, 2, TimeUnit.S)).toBe('1.23 s');
        expect(renderData(1234560000, UnitType.Time, 3, TimeUnit.S)).toBe('1.235 s');
        expect(renderData(1234560000, UnitType.Time, 4, TimeUnit.S)).toBe('1.2346 s');
        expect(renderData(1234560000, UnitType.Time, 5, TimeUnit.S)).toBe('1.23456 s');
    });
});
