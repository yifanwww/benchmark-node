import { Arguments } from '../../Parameterization';
import { ArgumentStore } from './ArgumentStore';

describe(`Test class \`${ArgumentStore.name}\``, () => {
    it('creates an instance without args and jit args', () => {
        const store = new ArgumentStore();

        expect(store.argsList.length).toBe(0);
        expect(store.jitArgsList.length).toBe(0);
        expect(store.maxArgsLength).toBe(0);
    });

    it('creates an instance with args', () => {
        const store = new ArgumentStore(new Arguments(1, 2, 3));

        expect(store.argsList.map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(store.jitArgsList.map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(store.maxArgsLength).toBe(3);
    });

    it('creates an instance with args and preArgs', () => {
        const store = new ArgumentStore(new Arguments(1, 2, 3), new Arguments('1', '2', '3'));

        expect(store.argsList.map((arg) => arg.args)).toStrictEqual([[1, 2, 3]]);
        expect(store.jitArgsList.map((arg) => arg.args)).toStrictEqual([
            ['1', '2', '3'],
            [1, 2, 3],
        ]);
        expect(store.maxArgsLength).toBe(3);
    });

    it('creates an instance with complex args and complex preArgs', () => {
        const store = new ArgumentStore(
            [new Arguments(1, 2, 3), new Arguments(2, 2)],
            [new Arguments('1', '2', '3'), new Arguments('a', 'b', 'c', 'd', 'e')],
        );

        expect(store.argsList.map((arg) => arg.args)).toStrictEqual([
            [1, 2, 3],
            [2, 2],
        ]);
        expect(store.jitArgsList.map((arg) => arg.args)).toStrictEqual([
            ['1', '2', '3'],
            ['a', 'b', 'c', 'd', 'e'],
            [1, 2, 3],
            [2, 2],
        ]);
        expect(store.maxArgsLength).toBe(5);
    });
});
