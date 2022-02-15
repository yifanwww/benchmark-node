import { Statistics } from '../Statistics';

describe(`Test class \`${Statistics.name}\``, () => {
    it('calculates', () => {
        const stats = new Statistics(
            'name',
            [
                37051080, 33390980, 33920080, 33423180, 33684980, 34514380, 33498580, 34333480, 33923280, 34479480,
                33398680, 33242780, 33088980, 33790080, 33530180,
            ],
            141386309,
        );

        expect(JSON.stringify(stats, undefined, 4)).toMatchSnapshot();
    });
});
