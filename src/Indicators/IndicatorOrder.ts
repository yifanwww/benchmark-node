import type { LooseArray } from '../types';

import type { IIndicator } from './IIndicator';
import { StatisticIndicator } from './StatisticIndicator';

export class IndicatorOrder {
    private declare readonly basicIndicators: readonly IIndicator[];
    private declare readonly extraIndicators: IIndicator[];

    constructor() {
        this.basicIndicators = [StatisticIndicator.Mean, StatisticIndicator.Error, StatisticIndicator.StdDev];
        this.extraIndicators = [];
    }

    add(indicators: LooseArray<IIndicator>): void {
        if (Array.isArray(indicators)) {
            this.extraIndicators.push(...indicators);
        } else {
            this.extraIndicators.push(indicators);
        }
    }

    private filterExtraIndicators() {
        const idSet = new Set<string>(this.basicIndicators.map((indicator) => indicator.id));
        const order: IIndicator[] = [];

        for (const indicator of this.extraIndicators) {
            if (idSet.has(indicator.id)) continue;

            idSet.add(indicator.id);
            order.push(indicator);
        }

        return order;
    }

    getOrder(): IIndicator[] {
        return [...this.basicIndicators, ...this.filterExtraIndicators()];
    }

    /**
     * @deprecated Once we no longer use `StatisticColumnOrder`, we don't need this method any more.
     */
    isCustomized(): boolean {
        return this.extraIndicators.length > 0;
    }
}
