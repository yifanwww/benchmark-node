import { Column } from './Column';
import { StatisticColumn } from './StatisticColumn';

export class StatisticColumnOrder {
    private declare _id: number;
    private declare readonly _order: Record<string, { instance: StatisticColumn; order: number }>;

    constructor() {
        this._id = 0;
        this._order = {};

        this.addOrder(Column.Mean);
        this.addOrder(Column.Error);
        this.addOrder(Column.StdDev);
    }

    private addOrder(column: StatisticColumn): void {
        this._order[column.columnName] = { instance: column, order: ++this._id };
    }

    setOrder(order: StatisticColumn[]): void {
        for (const column of order) {
            this.addOrder(column);
        }
    }

    getOrder(): StatisticColumn[] {
        return Object.values(this._order)
            .sort((left, right) => left.order - right.order)
            .map((obj) => obj.instance);
    }
}
