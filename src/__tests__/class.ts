import type { ConditionalKeys } from 'type-fest';

import type { UnknownFn } from '../types.internal';

export function createClassJestHelper<T extends Function>($class: T) {
    const buildMethodName = (method: ConditionalKeys<T['prototype'], UnknownFn>) =>
        `${$class.name}.prototype.${($class.prototype[method] as Function).name}`;

    const buildStaticMethodName = (method: ConditionalKeys<T, UnknownFn>) =>
        `${$class.name}.${($class[method] as Function).name}`;

    return { buildMethodName, buildStaticMethodName };
}
