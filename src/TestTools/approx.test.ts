/**
 * ref:
 * - https://github.com/josdejong/mathjs/blob/v10.1.1/tools/approx.js
 */

/**
 * Test whether two values are approximately equal. Tests whether the difference between the two numbers is smaller than
 * a fraction of their max value.
 *
 * ref: https://github.com/josdejong/mathjs/blob/v10.1.1/tools/approx.js#L22
 */
function equal(a: number, b: number, epsilon: number = 1e-8) {
    if (a === b) {
        // great, we're done :)
    } else if (Number.isNaN(a)) {
        expect(a.toString()).toStrictEqual(b.toString());
    } else if (a === 0) {
        expect(Math.abs(b)).toBeLessThan(epsilon);
    } else if (b === 0) {
        expect(Math.abs(a)).toBeLessThan(epsilon);
    } else {
        const diff = Math.abs(a - b);
        const max = Math.max(a, b);
        const maxDiff = Math.abs(max * epsilon);
        expect(diff).toBeLessThanOrEqual(maxDiff);
    }
}

export const approx = { equal };
