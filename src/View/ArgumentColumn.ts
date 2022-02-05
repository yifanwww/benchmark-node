import { Column, GetData } from './Column';

export class ArgumentColumn extends Column {
    private index: number;

    public constructor(index: number) {
        // @ts-ignore
        super(`arg ${index}`);
        this._getData = this.getArgument;

        this.index = index;
    }

    private getArgument: GetData = (stats) => {
        const { args } = stats;
        return this.index < args.length ? args[this.index].toString() : '?';
    };
}
