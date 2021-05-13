import JSBI from 'jsbi';
import { Fraction } from '../entities/fraction';
import { KardiaAccount } from 'kardia-js-sdk';

// const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1);
// const THREE = JSBI.BigInt(3)
export const TEN = JSBI.BigInt(10);
// const TWENTY_FIVE = JSBI.BigInt(25)
// const FIFTY = JSBI.BigInt(50)
// const SEVENTY_FIVE = JSBI.BigInt(75)
// const ONE_HUNDRED = JSBI.BigInt(100)
// const ONE_THOUSAND = JSBI.BigInt(1000)
// const ONE_MILLION = JSBI.BigInt(1000000)
// const ONE_BILLION = JSBI.BigInt(1000000000)

// const ZERO_FRACTION = new Fraction(0)
const ONE_FRACTION = new Fraction(1);

const cellValue = (kaiValue: any, decimals: number = 18): string => {
  let cellString = removeTrailingZeros(kaiValue);
  let decimalStr = cellString.split('.')[1];
  let numberStr = cellString.split('.')[0];
  if (!decimalStr) {
    numberStr = numberStr.padEnd(decimals + numberStr.length, '0');
  } else {
    decimalStr = decimalStr.padEnd(decimals, '0');
  }
  cellString = `${numberStr}${decimalStr || ''}`;
  return cellString;
};

const convertValueFollowDecimal = (
  value: Fraction | string,
  decimals: number
): string => {
  try {
    const valueFrac = typeof value === 'string' ? new Fraction(value) : value;
    if (valueFrac.equalTo(0)) {
      return '0';
    }

    if (decimals === undefined || decimals === null) {
      return valueFrac.toFixed();
    }

    const DecimalsbigNum = JSBI.BigInt(decimals);
    const parseB = JSBI.exponentiate(TEN, DecimalsbigNum).toString();
    return removeTrailingZeros(valueFrac.divide(parseB).toFixed(decimals));
  } catch (error) {
    console.error('Error converting value from decimal:', error);
    return '0';
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

const validateAccount = (account: KAIAccount): boolean => {
  const { privateKey, publicKey } = account;
  return !!KardiaAccount.isAddress(publicKey) && !!privateKey.trim();
};

const renderPair = (tokenIn: string, tokenOut: string): string[] => {
  if (!tokenIn || !tokenOut) throw new Error('Error render pair: token not found!')
  return [tokenIn, tokenOut]
}

export const Utils = {
  cellValue,
  convertValueFollowDecimal,
  calculateSlippageValue,
  calculateLiquidityProvidersFee,
  validateAccount,
  renderPair
};
