export function* range(start: number, end: number): Generator<number, void> {
    let curr = start;

    while (curr < end) {
        yield curr;
        curr++;
    }
}
