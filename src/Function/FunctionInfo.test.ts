/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FunctionInfo } from './FunctionInfo';

import type { UnknownFn } from '../types.internal';

describe(`Test class \`${FunctionInfo.name}\``, () => {
    it('gets the function name', () => {
        expect(FunctionInfo.getFunctionName(function fn() {})).toBe('fn');
        expect(FunctionInfo.getFunctionName(function () {})).toBe(FunctionInfo.ANONYMOUS_NAME);
        expect(FunctionInfo.getFunctionName(() => {})).toBe(FunctionInfo.ANONYMOUS_NAME);

        {
            const func = function fn() {};
            expect(FunctionInfo.getFunctionName(func)).toBe('fn');
        }

        {
            const fn = function () {};
            expect(FunctionInfo.getFunctionName(fn)).toBe('fn');
        }

        {
            const fn = () => {};
            expect(FunctionInfo.getFunctionName(fn)).toBe('fn');
        }
    });

    it('gets the function parameter names', () => {
        function _test<T extends UnknownFn>(fn: T, expected: string[]) {
            expect(FunctionInfo.getParameterNames(fn)).toStrictEqual(expected);
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

    it('throws an error if cannot parse the parameter names', () => {
        expect(() => FunctionInfo.getParameterNames('' as never)).toThrowError();
    });
});
