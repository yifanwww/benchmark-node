import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';

import { TableColumn } from './TableColumn';

export class ArgumentColumn extends TableColumn<ReadonlyArray<unknown> | undefined> {
    private index: number;

    public constructor(index: number) {
        super(`arg ${index}`, (stats) => stats.args?.args);

        this.index = index;
    }

    public override format(stats: Statistics): string {
        const data = this._getData(stats);

        let arg;

        // Gets argument from arguments
        if (!data) {
            arg = '?';
        } else if (this.index >= data.length) {
            arg = '?';
        } else {
            const _data = data[this.index];
            arg = typeof _data === 'string' ? _data : String(_data);
        }

        // If argument is too long
        arg = Formatter.limitStringLength(arg);

        return arg;
    }
}
