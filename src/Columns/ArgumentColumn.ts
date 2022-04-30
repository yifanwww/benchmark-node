import { Formatter } from '../Tools/Formatter';
import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ArgumentColumn extends BaseColumn<string> {
    private declare readonly _index: number;

    get index() {
        return this._index;
    }

    constructor(index: number) {
        super(ColumnType.FnArgument, `arg ${index}`, (stats) => {
            const data = stats.args?.args;

            let arg;

            // Gets argument from arguments
            if (!data) {
                arg = '?';
            } else if (this._index >= data.length) {
                arg = '?';
            } else {
                const _data = data[this._index];
                arg = typeof _data === 'string' ? _data : String(_data);
            }

            // If argument is too long
            arg = Formatter.limitStringLength(arg);

            return arg;
        });

        this._index = index;
    }
}
