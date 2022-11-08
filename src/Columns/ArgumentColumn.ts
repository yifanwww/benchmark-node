import { Formatter } from '../Tools/Formatter';

import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ArgumentColumn extends BaseColumn<string> {
    constructor(index: number) {
        super(ColumnType.FN_ARGUMENT, `arg ${index}`, (stats) => {
            const args = stats.args?.args;

            if (!args || index >= args.length) {
                return '?';
            }

            const arg = args[index];
            const typeofArg = arg;

            if (
                typeofArg === 'bigint' ||
                typeofArg === 'boolean' ||
                typeofArg === 'number' ||
                typeofArg === 'symbol' ||
                typeofArg === 'undefined'
            ) {
                return String(args);
            }

            if (typeofArg === 'function') {
                return 'function';
            }

            // If argument is too long
            return Formatter.limitStringLength(String(arg));
        });
    }
}
