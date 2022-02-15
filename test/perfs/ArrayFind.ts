/* eslint-disable @typescript-eslint/no-unused-vars */

import { Benchmark, Column, StatisticColumn } from '../../src';
import { Statistics } from '../../src/Data';
import { TimeUnit } from '../../src/Tools/TimeTool';

let columns: StatisticColumn[];
let stats: Statistics[];
let unit: TimeUnit;

function forofFind() {
    for (const column of columns) {
        if (column === Column.Mean) {
            unit = column.findMinTimeUnit(stats);
            break;
        }
    }
}

function arrayFind() {
    unit = columns.find((column) => column === Column.Mean)!.findMinTimeUnit(stats);
}

const benchmark = new Benchmark();

benchmark.addSetup(() => {
    columns = [Column.StdErr, Column.StdDev, Column.Mean];

    stats = [
        new Statistics(
            'name',
            [
                37051080, 33390980, 33920080, 33423180, 33684980, 34514380, 33498580, 34333480, 33923280, 34479480,
                33398680, 33242780, 33088980, 33790080, 33530180,
            ],
            141386309,
        ),
    ];
});

benchmark.add(forofFind);
benchmark.add(arrayFind);

benchmark.run();
