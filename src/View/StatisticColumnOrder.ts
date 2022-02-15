import { Column, StatisticColumn } from '../Columns';

export class StatisticColumnOrder {
    private _id: number = 0;
    private _order: Record<string, { instance: StatisticColumn; order: number }> = {};

    public constructor() {
        this.addOrder(Column.Mean);
        this.addOrder(Column.Error);
        this.addOrder(Column.StdDev);
    }

    private addOrder(column: StatisticColumn): void {
        this._order[column.columnName] = { instance: column, order: ++this._id };
    }

    public setOrder(order: StatisticColumn[]): void {
        for (const column of order) {
            this.addOrder(column);
        }
    }

    public getOrder(): StatisticColumn[] {
        return Object.values(this._order)
            .sort((left, right) => left.order - right.order)
            .map((obj) => obj.instance);
    }
}
