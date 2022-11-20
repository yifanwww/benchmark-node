import type { LooseArray } from '../types';

import type { IIndicator } from './IIndicator';
import { StatisticIndicator } from './StatisticIndicator';

export class IndicatorOrder {
    private declare readonly _basicIndicators: readonly IIndicator[];
    private declare readonly _extraIndicators: IIndicator[];

    constructor() {
        this._basicIndicators = [StatisticIndicator.Mean, StatisticIndicator.Error, StatisticIndicator.StdDev];
        this._extraIndicators = [];
    }

    add(indicators: LooseArray<IIndicator>): void {
        if (Array.isArray(indicators)) {
            this._extraIndicators.push(...indicators);
        } else {
            this._extraIndicators.push(indicators);
        }
    }

    private _filterExtraIndicators() {
        const idSet = new Set<string>(this._basicIndicators.map((indicator) => indicator.id));
        const order: IIndicator[] = [];

        for (const indicator of this._extraIndicators) {
            if (idSet.has(indicator.id)) continue;

            idSet.add(indicator.id);
            order.push(indicator);
        }

        return order;
    }

    getOrder(): IIndicator[] {
        return [...this._basicIndicators, ...this._filterExtraIndicators()];
    }

    /**
     * @deprecated Once we no longer use `StatisticColumnOrder`, we don't need this method any more.
     */
    isCustomized(): boolean {
        return this._extraIndicators.length > 0;
    }
}
