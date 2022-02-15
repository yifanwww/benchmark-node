import { Arguments } from '../../Parameterization';
import { TestFunction } from '../TestFunction';

describe(`Test class \`${TestFunction.name}\``, () => {
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
        expect(get(function fn(a: string = 'a', b: string = 'b', c: string = 'c') {})).toStrictEqual(target);
        expect(
            get(function fn(
                a: string /* comments */ = 'a',
                b: string /* comments */ = 'b',
                c: string /* comments */ = 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                a: string /* comments */ = /* comments */ 'a',
                b: string /* comments */ = /* comments */ 'b',
                c: string /* comments */ = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function fn(
                /* comments */ a: string = /* comments */ 'a',
                /* comments */ b: string = /* comments */ 'b',
                /* comments */ c: string = /* comments */ 'c',
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
        expect(get(function (a: string = 'a', b: string = 'b', c: string = 'c') {})).toStrictEqual(target);
        expect(
            get(function (
                a: string /* comments */ = 'a',
                b: string /* comments */ = 'b',
                c: string /* comments */ = 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function (
                a: string /* comments */ = /* comments */ 'a',
                b: string /* comments */ = /* comments */ 'b',
                c: string /* comments */ = /* comments */ 'c',
            ) {}),
        ).toStrictEqual(target);
        expect(
            get(function (
                /* comments */ a: string = /* comments */ 'a',
                /* comments */ b: string = /* comments */ 'b',
                /* comments */ c: string = /* comments */ 'c',
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
        expect(get((a: string = 'a', b: string = 'b', c: string = 'c') => {})).toStrictEqual(target);
        expect(
            get((a: string /* comments */ = 'a', b: string /* comments */ = 'b', c: string /* comments */ = 'c') => {}),
        ).toStrictEqual(target);
        expect(
            get(
                (
                    a: string /* comments */ = /* comments */ 'a',
                    b: string /* comments */ = /* comments */ 'b',
                    c: string /* comments */ = /* comments */ 'c',
                ) => {},
            ),
        ).toStrictEqual(target);
        expect(
            get(
                (
                    /* comments */ a: string = /* comments */ 'a',
                    /* comments */ b: string = /* comments */ 'b',
                    /* comments */ c: string = /* comments */ 'c',
                ) => {},
            ),
        ).toStrictEqual(target);
    });
    /* eslint-enable func-names */
    /* eslint-enable @typescript-eslint/dot-notation */
    /* eslint-enable @typescript-eslint/no-unused-vars */

    it('receives no options', () => {
        const options = new TestFunction(() => {}, {});

        expect([...options.args]).toStrictEqual([]);
        expect(options.argsCount).toBe(0);
        expect(options.argsLength).toBe(0);
        expect([...options.jitArgs]).toStrictEqual([]);
        expect(options.jitArgsCount).toBe(0);
        expect(options.jitArgsLength).toBe(0);
        expect(options.maxArgsLength).toBe(0);
    });

    it('receives args', () => {
        const options = new TestFunction((arg1: number, arg2: number, arg3: number) => arg3, {
            args: new Arguments(1, 2, 3),
        });

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.argsCount).toBe(1);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.jitArgsCount).toBe(1);
        expect(options.jitArgsLength).toBe(3);
        expect(options.maxArgsLength).toBe(3);
    });

    it('receives args and preArgs', () => {
        const options = new TestFunction(
            (arg1: number | string, arg2: number | string, arg3: number | string) => arg3,
            {
                args: new Arguments(1, 2, 3),
                jitArgs: new Arguments('1', '2', '3'),
            },
        );

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.argsCount).toBe(1);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([
            ['1', '2', '3'],
            [1, 2, 3],
        ]);
        expect(options.jitArgsCount).toBe(2);
        expect(options.jitArgsLength).toBe(3);
        expect(options.maxArgsLength).toBe(3);
    });

    it('receives complex args and complex preArgs', () => {
        const options = new TestFunction(
            (arg1: number | string, arg2: number | string, arg3?: number | string, arg4?: string, arg5?: string) =>
                arg5,
            {
                args: [new Arguments(1, 2, 3), new Arguments(2, 2)],
                jitArgs: [new Arguments('1', '2', '3'), new Arguments('a', 'b', 'c', 'd', 'e')],
            },
        );

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([
            [1, 2, 3],
            [2, 2],
        ]);
        expect(options.argsCount).toBe(2);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([
            ['1', '2', '3'],
            ['a', 'b', 'c', 'd', 'e'],
            [1, 2, 3],
            [2, 2],
        ]);
        expect(options.jitArgsCount).toBe(4);
        expect(options.jitArgsLength).toBe(5);
        expect(options.maxArgsLength).toBe(5);
    });
});
