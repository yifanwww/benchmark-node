/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UnknownFn } from '../../types.internal';
import { FunctionInfo } from '../FunctionInfo';

describe(`Test class \`${FunctionInfo.name}\``, () => {
    it('gets the function name', () => {
        expect(new FunctionInfo(function fn() {}).name).toBe('fn');
        expect(new FunctionInfo(function fn() {}, 'asdf').name).toBe('asdf');

        expect(new FunctionInfo(function () {}, 'asdf').name).toBe('asdf');
        expect(new FunctionInfo(() => {}, 'asdf').name).toBe('asdf');

        {
            const fn = function fn() {};
            expect(new FunctionInfo(fn).name).toBe('fn');
            expect(new FunctionInfo(fn, 'asdf').name).toBe('asdf');
        }

        {
            const fn = function () {};
            expect(new FunctionInfo(fn).name).toBe('fn');
            expect(new FunctionInfo(fn, 'asdf').name).toBe('asdf');
        }

        {
            const fn = () => {};
            expect(new FunctionInfo(fn).name).toBe('fn');
            expect(new FunctionInfo(fn, 'asdf').name).toBe('asdf');
        }
    });

    it('gets the function parameter names', () => {
        function _test<T extends UnknownFn>(fn: T, expected: string[]) {
            expect(new FunctionInfo(fn, 'fn').paramNames).toStrictEqual(expected);
        }

        _test(function fn() {}, []);
        _test(function () {}, []);
        _test(() => {}, []);

        const expected = ['a', 'b', 'c'];

        _test(function fn(a, b, c) {}, expected);
        _test(function (a, b, c) {}, expected);
        _test((a, b, c) => {}, expected);

        _test(function fn(
            /* comments */ /* comments */ a /* comments */ /* comments */,
            /* comments */ /* comments */ b /* comments */ /* comments */,
            /* comments */ /* comments */ c /* comments */ /* comments */,
        ) {},
        expected);
        _test(function (
            /* comments */ /* comments */ a /* comments */ /* comments */,
            /* comments */ /* comments */ b /* comments */ /* comments */,
            /* comments */ /* comments */ c /* comments */ /* comments */,
        ) {},
        expected);
        _test(
            (
                /* comments */ /* comments */ a /* comments */ /* comments */,
                /* comments */ /* comments */ b /* comments */ /* comments */,
                /* comments */ /* comments */ c /* comments */ /* comments */,
            ) => {},
            expected,
        );

        _test(function fn(
            /* comments */ /* comments */ a: string /* comments */ /* comments */ = 'a',
            /* comments */ /* comments */ b: string /* comments */ /* comments */ = 'b',
            /* comments */ /* comments */ c: string /* comments */ /* comments */ = 'c',
        ) {},
        expected);
        _test(function (
            /* comments */ /* comments */ a: string /* comments */ /* comments */ = 'a',
            /* comments */ /* comments */ b: string /* comments */ /* comments */ = 'b',
            /* comments */ /* comments */ c: string /* comments */ /* comments */ = 'c',
        ) {},
        expected);
        _test(
            (
                /* comments */ /* comments */ a: string /* comments */ /* comments */ = 'a',
                /* comments */ /* comments */ b: string /* comments */ /* comments */ = 'b',
                /* comments */ /* comments */ c: string /* comments */ /* comments */ = 'c',
            ) => {},
            expected,
        );
    });

    it('throws an error if no specific function name', () => {
        expect(() => new FunctionInfo(function () {})).toThrowError();
        expect(() => new FunctionInfo(() => {})).toThrowError();
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        expect(() => new FunctionInfo(Function('arg', '{ return arg }'))).toThrowError();
    });

    it('throws an error if cannot parse the parameter names', () => {
        expect(() => new FunctionInfo('' as never, 'fn')).toThrowError();
    });
});
