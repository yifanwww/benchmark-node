import { ConfidenceLevel } from './ConfidenceLevel';
import { StudentT } from './MathNet/StudentT';

export class ConfidenceInterval {
    private declare readonly _margin: number;
    private declare readonly _lower: number;
    private declare readonly _upper: number;

    private declare readonly _marginPercent: number;

    private declare readonly _degreeOfFreedom: number;
    private declare readonly _level: ConfidenceLevel;

    public get margin() {
        return this._margin;
    }

    public get marginPercent() {
        return this._marginPercent;
    }

    public get lower() {
        return this._lower;
    }

    public get upper() {
        return this._upper;
    }

    public get level() {
        return this._level;
    }

    public constructor(
        sampleSize: number,
        estimation: number,
        standardError: number,
        confidenceLevel: ConfidenceLevel,
    ) {
        this._level = confidenceLevel;

        this._degreeOfFreedom = sampleSize - 1;

        if (this._degreeOfFreedom <= 0) {
            this._margin = Number.NaN;
            this._lower = Number.NaN;
            this._upper = Number.NaN;
        } else {
            this._margin = standardError * this.getZLevel();
            this._lower = estimation - this._margin;
            this._upper = estimation + this._margin;
        }

        this._marginPercent = (this._margin / estimation) * 100;
    }

    private getZLevel() {
        const x = 1 - (1 - this._level) / 2;
        return StudentT.invCDF(0, 1, this._degreeOfFreedom, x);
    }
}
