/**
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/18c99a57562f181aab979b42ba206d3152f86cf2/src/Numerics.Tests/DistributionTests/Continuous/StudentTTests.cs
 */

/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { AssertHelpers } from '../../../TestTools/AssertHelpers.test';
import { StudentT } from '../StudentT';

describe(`Test class static method ${StudentT.name}.${StudentT.invCDF.name}`, () => {
    /**
     * ref: https://github.com/mathnet/mathnet-numerics/blob/18c99a57562f181aab979b42ba206d3152f86cf2/src/Numerics.Tests/DistributionTests/Continuous/StudentTTests.cs#L364
     */
    it('tests with several reference data', () => {
        const dataset: [number, number, number, number, number][] = [
            [0.0, 1.0, 1.0, 0.0, 0.5],
            [0.0, 1.0, 1.0, 1.0, 0.75],
            [0.0, 1.0, 1.0, -1.0, 0.25],
            [0.0, 1.0, 1.0, 2.0, 0.852416382349567],
            [0.0, 1.0, 1.0, -2.0, 0.147583617650433],
            [0.0, 1.0, 2.0, 0.0, 0.5],
            [0.0, 1.0, 2.0, 1.0, 0.788675134594813],
            [0.0, 1.0, 2.0, -1.0, 0.211324865405187],
            [0.0, 1.0, 2.0, 2.0, 0.908248290463863],
            [0.0, 1.0, 2.0, -2.0, 0.091751709536137],
            // [0.0, 1.0, NumberExt.POSITIVE_INFINITY, 0.0, 0.5],
            // [0.0, 1.0, NumberExt.POSITIVE_INFINITY, 1.0, 0.841344746068543],
            // [0.0, 1.0, NumberExt.POSITIVE_INFINITY, 2.0, 0.977249868051821],
        ];

        for (const data of dataset) {
            const expected = data[3];
            AssertHelpers.almostEqualRelative(expected, StudentT.invCDF(data[0], data[1], data[2], data[4]), 6);
        }
    });

    it('throws errors', () => {
        expect(() => StudentT.invCDF(0, 0, 1, 0)).toThrowError();
        expect(() => StudentT.invCDF(0, 1, 0, 0)).toThrowError();
    });
});
