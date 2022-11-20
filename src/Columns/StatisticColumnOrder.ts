import type { LooseArray } from '../types';

import { Column } from './Column';
import type { StatisticColumn } from './StatisticColumn';

/**
 * @deprecated Use `IndicatorOrder` instead. This will be deleted since `v0.9.0`.
 */
export class StatisticColumnOrder {
    private declare _id: number;
    private declare readonly _order: Record<string, { column: StatisticColumn; order: number }>;

    constructor() {
        this._id = 0;
        this._order = {};

        this._addOrder(Column.Mean);
        this._addOrder(Column.Error);
        this._addOrder(Column.StdDev);
    }

    private _addOrder(column: StatisticColumn): void {
        this._order[column.type] = { column, order: ++this._id };
    }

    addOrder(order: LooseArray<StatisticColumn>): void {
        if (!Array.isArray(order)) {
            this._addOrder(order);
        } else {
            for (const column of order) {
                this._addOrder(column);
            }
        }
    }

    getOrder(): StatisticColumn[] {
        return Object.values(this._order)
            .sort((left, right) => left.order - right.order)
            .map((obj) => obj.column);
    }
}
