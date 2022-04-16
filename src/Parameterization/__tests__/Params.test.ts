import { Params } from '../Params';

describe(`Test class \`${Params.name}\``, () => {
    it('iterates-1', () => {
        function _test(...values: unknown[]) {
            expect(new Params(...values).values).toStrictEqual(values);
        }

        _test(1);
        _test(1, 1, 1);
        _test('hello', 'world', '!');
        _test([1, 2, 3], [4, 5, 6]);
        _test({ hello: true, world: false });
        _test({ n: 10, m: 100 }, { n: 100, m: 100 }, { n: 200, m: 500 });
    });

    it('throws error if no values', () => {
        expect(() => new Params()).toThrowError();
    });
});
