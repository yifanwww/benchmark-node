import { chooseFractionDigit } from '../chooseFractionDigit';

it('renders dimensionless', () => {
    expect(chooseFractionDigit(0.123456)).toBe(4);
    expect(chooseFractionDigit(1.23456)).toBe(3);
    expect(chooseFractionDigit(12.3456)).toBe(2);
    expect(chooseFractionDigit(123.456)).toBe(1);
    expect(chooseFractionDigit(1234.56)).toBe(0);
    expect(chooseFractionDigit(12345.6)).toBe(0);
    expect(chooseFractionDigit(123456)).toBe(0);
});
