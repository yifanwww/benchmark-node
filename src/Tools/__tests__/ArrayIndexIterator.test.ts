import { ArrayIndexIterator } from '../ArrayIndexIterator';

describe(`Test class \`${ArrayIndexIterator.name}\``, () => {
    it('iterates-1', () => {
        function _test(capacity: number) {
            const iterator = new ArrayIndexIterator([capacity]);

            let count = 0;
            for (const arrayIndex of iterator.iter) {
                expect(arrayIndex).toStrictEqual([count]);
                count++;
            }

            expect(count).toBe(capacity);
        }

        _test(1);
        _test(2);
        _test(3);
        _test(4);
        _test(5);
        _test(10);
        _test(100);
    });

    it('iterates-2', () => {
        const iterator = new ArrayIndexIterator([2, 1, 3, 4]);

        const generator = iterator.iter;

        expect(generator.next().value).toStrictEqual([0, 0, 0, 0]);
        expect(generator.next().value).toStrictEqual([0, 0, 0, 1]);
        expect(generator.next().value).toStrictEqual([0, 0, 0, 2]);
        expect(generator.next().value).toStrictEqual([0, 0, 0, 3]);
        expect(generator.next().value).toStrictEqual([0, 0, 1, 0]);
        expect(generator.next().value).toStrictEqual([0, 0, 1, 1]);
        expect(generator.next().value).toStrictEqual([0, 0, 1, 2]);
        expect(generator.next().value).toStrictEqual([0, 0, 1, 3]);
        expect(generator.next().value).toStrictEqual([0, 0, 2, 0]);
        expect(generator.next().value).toStrictEqual([0, 0, 2, 1]);
        expect(generator.next().value).toStrictEqual([0, 0, 2, 2]);
        expect(generator.next().value).toStrictEqual([0, 0, 2, 3]);
        expect(generator.next().value).toStrictEqual([1, 0, 0, 0]);
        expect(generator.next().value).toStrictEqual([1, 0, 0, 1]);
        expect(generator.next().value).toStrictEqual([1, 0, 0, 2]);
        expect(generator.next().value).toStrictEqual([1, 0, 0, 3]);
        expect(generator.next().value).toStrictEqual([1, 0, 1, 0]);
        expect(generator.next().value).toStrictEqual([1, 0, 1, 1]);
        expect(generator.next().value).toStrictEqual([1, 0, 1, 2]);
        expect(generator.next().value).toStrictEqual([1, 0, 1, 3]);
        expect(generator.next().value).toStrictEqual([1, 0, 2, 0]);
        expect(generator.next().value).toStrictEqual([1, 0, 2, 1]);
        expect(generator.next().value).toStrictEqual([1, 0, 2, 2]);
        expect(generator.next().value).toStrictEqual([1, 0, 2, 3]);
        expect(generator.next()).toStrictEqual({ value: undefined, done: true });
    });

    it('iterates-3', () => {
        function _test(capacities: number[]) {
            const iterator = new ArrayIndexIterator(capacities);

            let count = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const _ of iterator.iter) {
                count++;
            }

            expect(count).toBe(capacities.reduce((sum, curr) => sum * curr, 1));
        }

        _test([1, 1, 1]);
        _test([1, 2, 1]);
        _test([2, 3, 5]);
        _test([5, 3, 5, 2, 4]);
    });

    it('throws error if to iterate an empty capacities', () => {
        expect(() => new ArrayIndexIterator([])).toThrowError();
    });

    it('throws error if to iterate an capacities which contains numbers less than or equal to 0', () => {
        expect(() => new ArrayIndexIterator([1, 1, 1, 1, 0, 1, 1, 1])).toThrowError();
        expect(() => new ArrayIndexIterator([1, 1, -1, 1, 1, 1, 1, 1])).toThrowError();
    });
});
