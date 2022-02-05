import { Arguments } from '../../ConfigOptions';
import { TestFnOptions } from '../TestFnOptions';

describe(`test class \`${TestFnOptions.name}\``, () => {
    it('receives no options', () => {
        const options = new TestFnOptions({});

        expect([...options.args]).toStrictEqual([]);
        expect(options.argsCount).toBe(0);
        expect(options.argsLength).toBe(0);
        expect([...options.jitArgs]).toStrictEqual([]);
        expect(options.jitArgsCount).toBe(0);
        expect(options.jitArgsLength).toBe(0);
    });

    it('receives args', () => {
        const options = new TestFnOptions({ args: new Arguments(1, 2, 3) });

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.argsCount).toBe(1);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.jitArgsCount).toBe(1);
        expect(options.jitArgsLength).toBe(3);
    });

    it('receives args and preArgs', () => {
        const options = new TestFnOptions({
            args: new Arguments(1, 2, 3),
            jitArgs: new Arguments('1', '2', '3'),
        });

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.argsCount).toBe(1);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([
            ['1', '2', '3'],
            [1, 2, 3],
        ]);
        expect(options.jitArgsCount).toBe(2);
        expect(options.jitArgsLength).toBe(3);
    });

    it('receives complex args and complex preArgs', () => {
        const options = new TestFnOptions({
            args: [new Arguments(1, 2, 3), new Arguments(2, 2)],
            jitArgs: [new Arguments('1', '2', '3'), new Arguments('a', 'b', 'c', 'd', 'e')],
        });

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
    });
});
