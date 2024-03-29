import quantile from '@stdlib/stats-base-dists-t-quantile';

import type { ConfidenceLevel } from './ConfidenceLevel';

export class ConfidenceInterval {
    private declare readonly _margin: number;
    private declare readonly _lower: number;
    private declare readonly _upper: number;

    private declare readonly _marginPercent: number;

    private declare readonly _degreeOfFreedom: number;
    private declare readonly _level: ConfidenceLevel;

    get margin() {
        return this._margin;
    }

    get marginPercent() {
        return this._marginPercent;
    }

    get lower() {
        return this._lower;
    }

    get upper() {
        return this._upper;
    }

    get level() {
        return this._level;
    }

    constructor(sampleSize: number, estimation: number, standardError: number, confidenceLevel: ConfidenceLevel) {
        this._level = confidenceLevel;

        this._degreeOfFreedom = sampleSize - 1;

        if (this._degreeOfFreedom <= 0) {
            this._margin = Number.NaN;
            this._lower = Number.NaN;
            this._upper = Number.NaN;
        } else {
            this._margin = standardError * this._getZLevel();
            this._lower = estimation - this._margin;
            this._upper = estimation + this._margin;
        }

        this._marginPercent = (this._margin / estimation) * 100;
    }

    private _getZLevel() {
        const p = 1 - (1 - this._level) / 2;
        return quantile(p, this._degreeOfFreedom);
    }
}
