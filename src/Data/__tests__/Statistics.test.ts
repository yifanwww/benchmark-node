import { testConstants } from '../../TestTools/constants.test';
import { Statistics } from '../Statistics';

describe(`Test class \`${Statistics.name}\``, () => {
    it('calculates', () => {
        const stats = new Statistics('name', testConstants.measurements.slice(), testConstants.ops);

        expect(stats).toMatchSnapshot();

        expect(stats.name).toMatchSnapshot();
        expect(stats.args).toMatchSnapshot();
        expect(stats.n).toMatchSnapshot();
        expect(stats.mean).toMatchSnapshot();
        expect(stats.variance).toMatchSnapshot();
        expect(stats.standardDeviation).toMatchSnapshot();
        expect(stats.standardError).toMatchSnapshot();
        expect(stats.confidenceInterval).toMatchSnapshot();
        expect(stats.min).toMatchSnapshot();
        expect(stats.q1).toMatchSnapshot();
        expect(stats.median).toMatchSnapshot();
        expect(stats.q3).toMatchSnapshot();
        expect(stats.max).toMatchSnapshot();
        expect(stats.ops).toMatchSnapshot();
    });
});
