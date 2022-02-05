import { _Nanosecond } from '../../types.internal';
import { Stats } from '../Stats';

describe(`test class \`${Stats.name}\``, () => {
    it('calculates', () => {
        const stats = new Stats('name', [
            1, 2, 3, 4, 3, 23, 21, 2, 3, 3, 2, 21, 1, 2, 23, 3, 4, 4, 32,
        ] as _Nanosecond[]);

        expect(JSON.stringify(stats, undefined, 4)).toMatchSnapshot();

        expect(stats.toString()).toMatchSnapshot();
        expect(stats.toString(2)).toMatchSnapshot();
    });
});
