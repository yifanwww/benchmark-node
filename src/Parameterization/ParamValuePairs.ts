interface ParamValuePair {
    name: string;
    value: unknown;
}

export enum ArgType {
    FN_ARGUMENT,
    PARAMETER,
}

export class ParamValuePairs {
    private declare _fnArgPairs: ParamValuePair[];
    private declare _paramPairs: ParamValuePair[];

    public constructor() {
        this._fnArgPairs = [];
        this._paramPairs = [];
    }

    public addParameter(name: string, value: unknown): void {
        this._paramPairs.push({ name, value });
    }

    public addArgument(name: string, value: unknown): void {
        this._fnArgPairs.push({ name, value });
    }

    public add(type: ArgType, name: string, value: unknown): void {
        if (type === ArgType.FN_ARGUMENT) {
            this.addArgument(name, value);
        } else {
            this.addParameter(name, value);
        }
    }

    public getParameter(name: string): unknown {
        const pair = this._paramPairs.find((param) => param.name === name);
        if (pair === undefined) {
            throw new Error(`Cannot find parameter ${name}`);
        }

        return pair.value;
    }

    public getArgument(name: string): unknown {
        const pair = this._fnArgPairs.find((param) => param.name === name);
        if (pair === undefined) {
            throw new Error(`Cannot find argument ${name}`);
        }

        return pair.value;
    }

    public get(type: ArgType, name: string): unknown {
        if (type === ArgType.FN_ARGUMENT) {
            return this.getArgument(name);
        } else {
            return this.getParameter(name);
        }
    }

    private buildPairStr(pair: ParamValuePair): string {
        return `${pair.name}=${String(pair.value)}`;
    }

    public toString(): string {
        return [...this._paramPairs.map(this.buildPairStr), ...this._fnArgPairs.map(this.buildPairStr)].join(', ');
    }
}
