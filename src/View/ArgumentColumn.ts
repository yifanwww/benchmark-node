import { Stats } from '../Data';
import { Formatter } from '../tools';

import { TableColumn } from './TableColumn';

export class ArgumentColumn extends TableColumn<string> {
    private index: number;

    public constructor(index: number) {
        super(`arg ${index}`);

        this.index = index;
    }

    protected override getDataWrapper(stats: Stats): string {
        const args = stats.args?.args;

        let arg;

        // Gets argument from arguments
        if (!args) {
            arg = '?';
        } else {
            arg = this.index < args.length ? String(args[this.index]) : '?';
        }

        // If argument is too long
        arg = Formatter.limitStringLength(arg);

        return arg;
    }
}
