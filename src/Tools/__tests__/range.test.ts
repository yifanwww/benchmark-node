import { range } from '../range';

describe(`Test function \`${range.name}\``, () => {
    it('iterates from `start` to `end`', () => {
        expect([...range(0, 1)]).toStrictEqual([0]);
        expect([...range(0, 5)]).toStrictEqual([0, 1, 2, 3, 4]);
    });

    it('iterates no thing', () => {
        expect([...range(0, 0)]).toStrictEqual([]);
        expect([...range(5, 0)]).toStrictEqual([]);
    });
});
