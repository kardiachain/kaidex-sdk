import JSBI from 'jsbi';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';
import { Rounding } from '../types/enums';
import { BigintIsh } from '../types/bigint';

const ONE = JSBI.BigInt(1);

const Decimal = toFormat(_Decimal);
const Big = toFormat(_Big);

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: 0,
  [Rounding.ROUND_HALF_UP]: 1,
  [Rounding.ROUND_UP]: 2,
};

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: 0,
  [Rounding.ROUND_HALF_UP]: 1,
  [Rounding.ROUND_UP]: 2,
};

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI ? bigintIsh : JSBI.BigInt(Number(bigintIsh));
}

export class Fraction {
  public readonly numerator: JSBI;
  public readonly denominator: JSBI;

  public constructor(numerator: BigintIsh, denominator: BigintIsh = ONE) {
    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  }

  // performs floor division
  public get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator);
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(
      JSBI.remainder(this.numerator, this.denominator),
      this.denominator
    );
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.add(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.subtract(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    );
  }

  public toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    });
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  }

  public toFixed(
    decimalPlaces: number = 0,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString())
      .div(this.denominator.toString())
      .toFormat(decimalPlaces, format);
  }
}
