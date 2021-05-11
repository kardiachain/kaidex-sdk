import { Fraction } from '../../entities/fraction';

declare global {
  interface FractionPrototypes {
    add(other: string | number | Fraction): Fraction;
    subtract(other: string | number | Fraction): Fraction;
    multiply(other: string | number | Fraction): Fraction;
    divide(other: string | number | Fraction): Fraction;
    lessThan(other: string | number | Fraction): boolean;
    equalTo(other: string | number | Fraction): boolean;
    greaterThan(other: string | number | Fraction): boolean;
    toFraction(): Fraction;
  }

  interface String extends FractionPrototypes {}
  interface Number extends FractionPrototypes {}
}

const fractionPrototypes: FractionPrototypes = {
  add: function(other: string | number | Fraction): Fraction {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.add(_otherFrac);
  },
  subtract: function(other: string | number | Fraction): Fraction {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.subtract(_otherFrac);
  },
  multiply: function(other: string | number | Fraction): Fraction {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.multiply(_otherFrac);
  },
  divide: function(other: string | number | Fraction): Fraction {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.divide(_otherFrac);
  },
  lessThan: function(other: string | number | Fraction): boolean {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.lessThan(_otherFrac);
  },
  equalTo: function(other: string | number | Fraction): boolean {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.equalTo(_otherFrac);
  },
  greaterThan: function(other: string | number | Fraction): boolean {
    const _this = new Fraction(this.toString());
    const _otherFrac =
      typeof other === 'string' || typeof other === 'number'
        ? new Fraction(other)
        : other;
    return _this.greaterThan(_otherFrac);
  },
  toFraction: function(): Fraction {
    return new Fraction(this.toString());
  },
};


String.prototype.add = fractionPrototypes.add;
String.prototype.subtract = fractionPrototypes.subtract;
String.prototype.multiply = fractionPrototypes.multiply;
String.prototype.divide = fractionPrototypes.divide;
String.prototype.lessThan = fractionPrototypes.lessThan;
String.prototype.equalTo = fractionPrototypes.equalTo;
String.prototype.greaterThan = fractionPrototypes.greaterThan;
String.prototype.toFraction = fractionPrototypes.toFraction;

Number.prototype.add = fractionPrototypes.add;
Number.prototype.subtract = fractionPrototypes.subtract;
Number.prototype.multiply = fractionPrototypes.multiply;
Number.prototype.divide = fractionPrototypes.divide;
Number.prototype.lessThan = fractionPrototypes.lessThan;
Number.prototype.equalTo = fractionPrototypes.equalTo;
Number.prototype.greaterThan = fractionPrototypes.greaterThan;
Number.prototype.toFraction = fractionPrototypes.toFraction;
