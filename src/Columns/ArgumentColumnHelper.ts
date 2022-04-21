import { Statistics } from '../Data';
import { Formatter } from '../Tools/Formatter';
import { ArgumentColumn } from './ArgumentColumn';
import { BaseColumnHelper } from './BaseColumnHelper';

export class ArgumentColumnHelper extends BaseColumnHelper<ReadonlyArray<unknown> | undefined> {
    protected declare _column: ArgumentColumn;

    override format(stats: Statistics): string {
        const data = this.column.getData(stats);

        let arg;

        // Gets argument from arguments
        if (!data) {
            arg = '?';
        } else if (this._column.index >= data.length) {
            arg = '?';
        } else {
            const _data = data[this._column.index];
            arg = typeof _data === 'string' ? _data : String(_data);
        }

        // If argument is too long
        arg = Formatter.limitStringLength(arg);

        return arg;
    }
}
