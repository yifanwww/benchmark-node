import { Formatter } from '../Tools/Formatter';
import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ArgumentColumn extends BaseColumn<string> {
    constructor(index: number) {
        super(ColumnType.FnArgument, `arg ${index}`, (stats) => {
            const data = stats.args?.args;

            let arg;

            // Gets argument from arguments
            if (!data) {
                arg = '?';
            } else if (index >= data.length) {
                arg = '?';
            } else {
                const _data = data[index];
                arg = typeof _data === 'string' ? _data : String(_data);
            }

            // If argument is too long
            arg = Formatter.limitStringLength(arg);

            return arg;
        });
    }
}
