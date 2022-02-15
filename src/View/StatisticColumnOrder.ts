import { Column } from '../Columns';

export class StatisticColumnOrder {
    private _id: number = 0;
    private _order: Partial<Record<Column, number>> = {};

    public constructor() {
        this.addOrder(Column.Mean);
        this.addOrder(Column.StdError);
        this.addOrder(Column.StdDev);
    }

    private addOrder(column: Column): void {
        this._order[column] = ++this._id;
    }

    public setOrder(order: Column[]): void {
        for (const column of order) {
            this.addOrder(column);
        }
    }

    public getOrder(): Column[] {
        const keys = Object.keys(this._order).map(Number) as Column[];
        const objs = keys.map((key) => ({ order: this._order[key]!, value: key }));
        return objs.sort((left, right) => left.order - right.order).map((obj) => obj.value);
    }
}
