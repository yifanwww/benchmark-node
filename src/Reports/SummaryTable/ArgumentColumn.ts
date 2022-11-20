import { Formatter } from '../../Tools/Formatter';

import { Column } from './Column';

export class ArgumentColumn extends Column {
    constructor(index: number) {
        super(`arg ${index}`, (stats) => {
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
