interface ParamValuePair {
    name: string;
    value: unknown;
}

export class ParamValuePairs {
    private declare _pairs: ParamValuePair[];

    constructor() {
        this._pairs = [];
    }

    add(name: string, value: unknown): void {
        this._pairs.push({ name, value });
    }

    get(name: string): unknown {
        const pair = this._pairs.find((param) => param.name === name);
        if (pair === undefined) {
            throw new Error(`Cannot find parameter ${name}`);
        }

        return pair.value;
    }

    get params() {
        return this._pairs.map((pair) => pair.value);
    }

    private buildPairStr(pair: ParamValuePair): string {
        return `${pair.name}=${String(pair.value)}`;
    }

    toString(): string {
        return this._pairs.map(this.buildPairStr).join(', ');
    }
}
