import { TestFunction } from '../TestFunction';

describe(`test class \`${TestFunction.name}\``, () => {
    /* eslint-disable func-names */
    /* eslint-disable @typescript-eslint/dot-notation */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    it(`test method ${TestFunction.name}.${TestFunction['getArgumentNames'].name}`, () => {
        const get = TestFunction['getArgumentNames'].bind(TestFunction);

        const target = ['a', 'b', 'c'];

        expect(get(function fn() {})).toStrictEqual([]);
        expect(get(function fn(a, b, c) {})).toStrictEqual(target);
        expect(get(function fn(/* comments */ a, /* comments */ b, /* comments */ c) {})).toStrictEqual(target);
        expect(get(function fn(a /* comments */, b /* comments */, c /* comments */) {})).toStrictEqual(target);
        expect(
            get(function fn(
                /* comments */ /* comments */ a,
                /* comments */ /* comments */ b,
                /* comments */ /* comments */ c,
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                /* comments */ a /* comments */,
                /* comments */ b /* comments */,
                /* comments */ c /* comments */,
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                a /* comments */ /* comments */,
                b /* comments */ /* comments */,
                c /* comments */ /* comments */,
            ) {}),
        ).toStrictEqual(target);
        expect(get(function fn(a = 'a', b = 'b', c = 'c') {})).toStrictEqual(target);
        expect(
            get(function fn(a /* comments */ = 'a', b /* comments */ = 'b', c /* comments */ = 'c') {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                a /* comments */ = /* comments */ 'a',
                b /* comments */ = /* comments */ 'b',
                c /* comments */ = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                /* comments */ a = /* comments */ 'a',
                /* comments */ b = /* comments */ 'b',
                /* comments */ c = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);

        expect(get(function () {})).toStrictEqual([]);
        expect(get(function (a, b, c) {})).toStrictEqual(target);
        expect(get(function (/* comments */ a, /* comments */ b, /* comments */ c) {})).toStrictEqual(target);
        expect(get(function (a /* comments */, b /* comments */, c /* comments */) {})).toStrictEqual(target);
        expect(
            get(function (
                /* comments */ /* comments */ a,
                /* comments */ /* comments */ b,
                /* comments */ /* comments */ c,
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function (
                /* comments */ a /* comments */,
                /* comments */ b /* comments */,
                /* comments */ c /* comments */,
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function (
                a /* comments */ /* comments */,
                b /* comments */ /* comments */,
                c /* comments */ /* comments */,
            ) {}),
        ).toStrictEqual(target);
        expect(get(function (a = 'a', b = 'b', c = 'c') {})).toStrictEqual(target);
        expect(get(function (a /* comments */ = 'a', b /* comments */ = 'b', c /* comments */ = 'c') {})).toStrictEqual(
            target,
        );
        expect(
            get(function (
                a /* comments */ = /* comments */ 'a',
                b /* comments */ = /* comments */ 'b',
                c /* comments */ = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function (
                /* comments */ a = /* comments */ 'a',
                /* comments */ b = /* comments */ 'b',
                /* comments */ c = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);

        expect(get(() => {})).toStrictEqual([]);
        expect(get((a, b, c) => {})).toStrictEqual(target);
        expect(get((/* comments */ a, /* comments */ b, /* comments */ c) => {})).toStrictEqual(['a', 'b', 'c']);
        expect(get((a /* comments */, b /* comments */, c /* comments */) => {})).toStrictEqual(['a', 'b', 'c']);
        expect(
            get(
                (
                    /* comments */ /* comments */ a,
                    /* comments */ /* comments */ b,
                    /* comments */ /* comments */ c,
                ) => {},
            ),
        ).toStrictEqual(target);
        expect(
            get(
                (
                    /* comments */ a /* comments */,
                    /* comments */ b /* comments */,
                    /* comments */ c /* comments */,
                ) => {},
            ),
        ).toStrictEqual(target);
        expect(
            get(
                (
                    a /* comments */ /* comments */,
                    b /* comments */ /* comments */,
                    c /* comments */ /* comments */,
                ) => {},
            ),
        ).toStrictEqual(target);
        expect(get((a = 'a', b = 'b', c = 'c') => {})).toStrictEqual(target);
        expect(get((a /* comments */ = 'a', b /* comments */ = 'b', c /* comments */ = 'c') => {})).toStrictEqual(
            target,
        );
        expect(
            get(
                (
                    a /* comments */ = /* comments */ 'a',
                    b /* comments */ = /* comments */ 'b',
                    c /* comments */ = /* comments */ 'c',
                ) => {},
            ),
        ).toStrictEqual(target);
        expect(
            get(
                (
                    /* comments */ a = /* comments */ 'a',
                    /* comments */ b = /* comments */ 'b',
                    /* comments */ c = /* comments */ 'c',
                ) => {},
            ),
        ).toStrictEqual(target);
    });
    /* eslint-enable func-names */
    /* eslint-enable @typescript-eslint/dot-notation */
    /* eslint-enable @typescript-eslint/no-unused-vars */
});
