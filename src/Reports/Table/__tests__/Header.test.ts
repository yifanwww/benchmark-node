import { TimeUnit } from '../../../Tools/TimeUnit';
import { Header } from '../Header';

import { createColumnInfos } from './utils';

describe(`Test class \`${Header.name}\``, () => {
    it('adds headers', () => {
        const infos = createColumnInfos();

        const row = new Header({ infos, timeUnit: TimeUnit.NS });
        for (let i = 0; i < 9; i++) {
            row.setCell(i, 'asdf');
        }

        expect(row.length).toBe(9);

        const rowStr = row.render();
        expect(rowStr).toBe('| asdf | asdf | asdf |  asdf |  asdf | asdf  |       asdf |    asdf    | asdf       |');
    });
});
