interface ParamValuePair {
    name: string;
    value: unknown;
}

export class ParamValuePairs {
    private declare _pairs: ParamValuePair[];

    public constructor() {
        this._pairs = [];
    }

    public add(name: string, value: unknown): void {
        this._pairs.push({ name, value });
    }

    public get(name: string): unknown {
        const pair = this._pairs.find((param) => param.name === name);
        if (pair === undefined) {
            throw new Error(`Cannot find parameter ${name}`);
        }

        return pair.value;
    }

    public get params() {
        return this._pairs.map((pair) => pair.value);
    }

    private buildPairStr(pair: ParamValuePair): string {
        return `${pair.name}=${String(pair.value)}`;
    }

    public toString(): string {
        return this._pairs.map(this.buildPairStr).join(', ');
    }
}
