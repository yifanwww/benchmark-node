/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { approx } from '../../TestTools/approx.test';
import { gammaln } from '../Gammaln';

describe('gammaln', () => {
    it('should calculate the gammaln of 0', () => {
        expect(gammaln(0)).toStrictEqual(Infinity);
    });

    it('should calculate the gammaln of a negative integer', () => {
        expect(gammaln(-1)).toStrictEqual(NaN);
        expect(gammaln(-2)).toStrictEqual(NaN);
        expect(gammaln(-100000)).toStrictEqual(NaN);
        expect(gammaln(-NaN)).toStrictEqual(NaN);
    });

    it('should calculate the gammaln of a positive number', () => {
        approx.equal(gammaln(0.000000001), 20.723265836369195492082857);
        approx.equal(gammaln(0.000001), 13.815509980749431669207827);
        approx.equal(gammaln(0.25), 1.2880225246980774573706104);
        approx.equal(gammaln(0.8), 0.1520596783998375887782926);
        approx.equal(gammaln(1), 0);
        approx.equal(gammaln(1.5), -0.12078223763524522234551845);
        approx.equal(gammaln(2), 0);
        approx.equal(gammaln(2.5), 0.28468287047291915963249467);
        approx.equal(gammaln(12.5), 18.734347511936445701634125);
        approx.equal(gammaln(125.5), 479.45782236390339913576384);
        approx.equal(gammaln(5555.5555), 42344.127792509816147711716);
        approx.equal(gammaln(5000000.5), 72124743.270930397264882949);
        approx.equal(gammaln(99999999999999.5), 3123619130191632.6403724193);
        approx.equal(gammaln(1e92), 2.1083782855545220292965521e94);
    });

    it('should calculate the gammaln of an irrational number', () => {
        approx.equal(gammaln(Math.SQRT2), -0.12038230351896920333038516);
        approx.equal(gammaln(Math.PI), 0.82769459232343710152957856);
        approx.equal(gammaln(Math.E), 0.44946174182006766700250782);
    });
});
