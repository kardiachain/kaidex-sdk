import JSBI from 'jsbi';
import { Fraction } from '../entities/fraction';
import { BigNumber } from 'bignumber.js';
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TEN = JSBI.BigInt(10);
const ONE_FRACTION = new Fraction(1);

const cellValue = (kaiValue: any, decimals: number = 18): string => {
  const rawValue = new BigNumber(kaiValue);
  return rawValue.multipliedBy(new BigNumber(10 ** decimals)).toFixed(0, 1);
};

const convertValueFollowDecimal = (
  value: string,
  decimals: number
): string => {
  try {
    if (!value || value === '0') {
      return '0'
    }
    if (!decimals) {
      return value
    }
    const rawValue = new BigNumber(value)
    const rawTEN = new BigNumber(10)
    const result = rawValue.dividedBy(rawTEN.exponentiatedBy(decimals))
    return removeTrailingZeros(result.toFixed(decimals));
  } catch (error) {
    console.error("Error converting value from decimal:", error);
    return '0'
  }
};

const removeTrailingZeros = (value: any): string => {
  const regEx1 = /^[0]+/;
  const regEx2 = /[0]+$/;
  const regEx3 = /[.]$/;

  const valueInString = value.toString();

  let after = valueInString.replace(regEx1, ''); // Remove leading 0's

  if (after.indexOf('.') > -1) {
    after = after.replace(regEx2, ''); // Remove trailing 0's
  }
  after = after.replace(regEx3, ''); // Remove trailing decimal

  if (after.indexOf('.') === 0) {
    after = '0' + after;
  }
  return after ? after : '0';
};

const calculateSlippageValue = (
  value: string,
  slippageTolerance: string | number,
  type: 'add' | 'sub'
): string => {
  try {
    const _value = new Fraction(value);
    const slippageFrac = new Fraction(
      cellValue(slippageTolerance),
      cellValue(100)
    );
    let slippagePercent: Fraction;
    if (type === 'sub') {
      if (Number(slippageTolerance) > 100) {
        return '0';
      }
      slippagePercent = ONE_FRACTION.subtract(slippageFrac);
    } else {
      slippagePercent = ONE_FRACTION.add(slippageFrac);
    }
    return _value.multiply(slippagePercent).toFixed();
  } catch (error) {
    console.error('Error calculating slippage value:', error);
    return '';
  }
};

const calculateLiquidityProvidersFee = (amountIn: string | number): string => {
  const amountFrac = new Fraction(amountIn);

  return amountFrac
    .multiply(3)
    .divide(1000)
    .toFixed();
};

const renderPair = (tokenIn: string, tokenOut: string): string[] => {
  if (!tokenIn || !tokenOut)
    throw new Error('Error render pair: token not found!');
  return [tokenIn, tokenOut];
};


export const _9975 = JSBI.BigInt(9975)
export const _10000 = JSBI.BigInt(10000)

export const Utils = {
  cellValue,
  convertValueFollowDecimal,
  calculateSlippageValue,
  calculateLiquidityProvidersFee,
  renderPair
};
