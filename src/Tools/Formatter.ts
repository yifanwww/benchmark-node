export class Formatter {
    /**
     * Beautify a number to a more readable comma-separated string representation.
     *
     * @param number The number to beautify.
     * @returns The more readable string representation.
     */
    public static beautifyNumber(number: number | string, beautifyRight: boolean = false): string {
        function insertComma(from: Buffer): Buffer {
            const toLength = from.length + Math.ceil(from.length / 3) - 1;
            const to = Buffer.alloc(toLength, ',');

            for (let indexFrom = 0; indexFrom < from.length; indexFrom++) {
                const offset = Math.ceil((indexFrom + 1) / 3) - 1;
                const indexTo = indexFrom + offset;
                to[indexTo] = from[indexFrom];
            }

            return to;
        }

        function _beautifyLeft(left: string) {
            const from = Buffer.from(left.toString(), 'ascii').reverse();
            const to = insertComma(from);
            return to.reverse().toString('ascii');
        }

        function _beautifyRight(right: string) {
            if (!beautifyRight) {
                return right;
            } else {
                const from = Buffer.from(right.toString(), 'ascii');
                const to = insertComma(from);
                return to.toString('ascii');
            }
        }

        const nums = String(number).split('.');
        return nums.length === 1 ? _beautifyLeft(nums[0]) : `${_beautifyLeft(nums[0])}.${_beautifyRight(nums[1])}`;
    }

    public static limitStringLength(str: string): string {
        return str.length > 10 ? `${str.slice(0, 10)}...` : str;
    }
}
