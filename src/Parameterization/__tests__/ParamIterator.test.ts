import { ParamIterator } from '../ParamIterator';
import { Params } from '../Params';

describe(`Test class \`${ParamIterator.name}\``, () => {
    it('iterates-1', () => {
        function _test(...values: unknown[]) {
            const iter = new ParamIterator([new Params(...values)]);

            let count = 0;
            for (const args of iter) {
                expect(args).toStrictEqual([values[count]]);
                count++;
            }

            expect(count).toBe(values.length);
        }

        _test(1);
        _test(1, 2, 3, 4, 5, 6);
        _test(Array(100).fill(0));
    });

    it('iterates-2', () => {
        const iter = new ParamIterator([new Params(0, 1, 2, 3), new Params(4, 5, 6), new Params(7, 8, 9)]);

        const generator = iter[Symbol.iterator]();

        expect(generator.next().value).toStrictEqual([0, 4, 7]);
        expect(generator.next().value).toStrictEqual([0, 4, 8]);
        expect(generator.next().value).toStrictEqual([0, 4, 9]);
        expect(generator.next().value).toStrictEqual([0, 5, 7]);
        expect(generator.next().value).toStrictEqual([0, 5, 8]);
        expect(generator.next().value).toStrictEqual([0, 5, 9]);
        expect(generator.next().value).toStrictEqual([0, 6, 7]);
        expect(generator.next().value).toStrictEqual([0, 6, 8]);
        expect(generator.next().value).toStrictEqual([0, 6, 9]);
        expect(generator.next().value).toStrictEqual([1, 4, 7]);
        expect(generator.next().value).toStrictEqual([1, 4, 8]);
        expect(generator.next().value).toStrictEqual([1, 4, 9]);
        expect(generator.next().value).toStrictEqual([1, 5, 7]);
        expect(generator.next().value).toStrictEqual([1, 5, 8]);
        expect(generator.next().value).toStrictEqual([1, 5, 9]);
        expect(generator.next().value).toStrictEqual([1, 6, 7]);
        expect(generator.next().value).toStrictEqual([1, 6, 8]);
        expect(generator.next().value).toStrictEqual([1, 6, 9]);
        expect(generator.next().value).toStrictEqual([2, 4, 7]);
        expect(generator.next().value).toStrictEqual([2, 4, 8]);
        expect(generator.next().value).toStrictEqual([2, 4, 9]);
        expect(generator.next().value).toStrictEqual([2, 5, 7]);
        expect(generator.next().value).toStrictEqual([2, 5, 8]);
        expect(generator.next().value).toStrictEqual([2, 5, 9]);
        expect(generator.next().value).toStrictEqual([2, 6, 7]);
        expect(generator.next().value).toStrictEqual([2, 6, 8]);
        expect(generator.next().value).toStrictEqual([2, 6, 9]);
        expect(generator.next().value).toStrictEqual([3, 4, 7]);
        expect(generator.next().value).toStrictEqual([3, 4, 8]);
        expect(generator.next().value).toStrictEqual([3, 4, 9]);
        expect(generator.next().value).toStrictEqual([3, 5, 7]);
        expect(generator.next().value).toStrictEqual([3, 5, 8]);
        expect(generator.next().value).toStrictEqual([3, 5, 9]);
        expect(generator.next().value).toStrictEqual([3, 6, 7]);
        expect(generator.next().value).toStrictEqual([3, 6, 8]);
        expect(generator.next().value).toStrictEqual([3, 6, 9]);
        expect(generator.next()).toStrictEqual({ value: undefined, done: true });
    });
});
