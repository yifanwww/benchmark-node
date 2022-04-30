export function chooseFractionDigit(num: number): number {
    if (num <= 1) {
        return 4;
    } else if (num <= 10) {
        return 3;
    } else if (num <= 100) {
        return 2;
    } else if (num <= 1000) {
        return 1;
    } else {
        return 0;
    }
}
