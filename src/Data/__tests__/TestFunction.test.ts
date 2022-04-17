import { Arguments } from '../../Parameterization';
import { TestFunction } from '../TestFunction';

describe(`Test class \`${TestFunction.name}\``, () => {
    it('news an instance with an empty option', () => {
        const options = new TestFunction({});

        expect([...options.args]).toStrictEqual([]);
        expect(options.argsCount).toBe(0);
        expect(options.argsLength).toBe(0);
        expect([...options.jitArgs]).toStrictEqual([]);
        expect(options.jitArgsCount).toBe(0);
        expect(options.jitArgsLength).toBe(0);
        expect(options.maxArgsLength).toBe(0);
    });

    it('new an instance with args', () => {
        const options = new TestFunction({ args: new Arguments(1, 2, 3) });

        expect([...options.args].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.argsCount).toBe(1);
        expect(options.argsLength).toBe(3);
        expect([...options.jitArgs].map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(options.jitArgsCount).toBe(1);
        expect(options.jitArgsLength).toBe(3);
        expect(options.maxArgsLength).toBe(3);
    });

    it('new an instance with args and preArgs', () => {
        const options = new TestFunction({ args: new Arguments(1, 2, 3), jitArgs: new Arguments('1', '2', '3') });

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

    it('new an instance with complex args and complex preArgs', () => {
        const options = new TestFunction({
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
        expect(options.maxArgsLength).toBe(5);
    });
});
