export class MultiIndexIterator {
    private _capacities: readonly number[];

    public constructor(capacities: readonly number[]) {
        if (capacities.length === 0) {
            throw new Error('capacities should contain the capacities of the arrays');
        }

        for (const capacity of capacities) {
            if (capacity < 1) {
                throw new Error("capacities shouldn't contain numbers which are less than or equal to 0");
            }
        }

        this._capacities = capacities;
    }

    public *[Symbol.iterator](): Generator<readonly number[], void> {
        const indexes = this._capacities.map(() => 0);

        yield indexes;

        while (!indexes.every((index, i) => index === this._capacities[i] - 1)) {
            let _continue = false;
            for (let i = indexes.length - 1; i >= 0; i--) {
                indexes[i]++;
                _continue = indexes[i] === this._capacities[i];
                if (_continue) {
                    indexes[i] = 0;
                } else {
                    break;
                }
            }

            yield indexes;
        }
    }
}
