import { Params } from '../../Parameterization';
import { ParameterStore } from './ParameterStore';
import { ParameterStoreView } from './ParameterStoreView';

describe(`Test class \`${ParameterStore.name}\``, () => {
    it('creates a store without parameters', () => {
        const store = new ParameterStore([], []);

        expect(store.count).toBe(0);
        expect(store.names).toStrictEqual([]);
        expect(store.hasParams()).toBeFalsy();
        expect(store.getParams(0)).toBeNull();
        expect(store.getParams(1)).toBeNull();

        const iter = ParameterStoreView.iterateStore(store);
        expect(iter.next().value).toBeNull();
        expect(iter.next()).toStrictEqual({ value: undefined, done: true });
    });

    it('creates a store with parameters', () => {
        const store = new ParameterStore([new Params(100, 1000), new Params(100, 1000, 10000)], ['n', 'm']);

        expect(store.count).toBe(6);
        expect(store.names).toStrictEqual(['n', 'm']);
        expect(store.hasParams()).toBeTruthy();
        expect(store.getParams(0)).toStrictEqual([100, 100]);
        expect(store.getParams(1)).toStrictEqual([100, 1000]);

        const iter = ParameterStoreView.iterateStore(store);
        expect(iter.next().value!.params).toStrictEqual([100, 100]);
        expect(iter.next().value!.params).toStrictEqual([100, 1000]);
        expect(iter.next().value!.params).toStrictEqual([100, 10000]);
        expect(iter.next().value!.params).toStrictEqual([1000, 100]);
        expect(iter.next().value!.params).toStrictEqual([1000, 1000]);
        expect(iter.next().value!.params).toStrictEqual([1000, 10000]);
        expect(iter.next()).toStrictEqual({ value: undefined, done: true });
    });
});
