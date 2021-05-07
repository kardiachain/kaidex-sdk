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

const removeTrailingZeros = (value: any) => {
    const regEx1 = /^[0]+/;
    const regEx2 = /[0]+$/;
    const regEx3 = /[.]$/;

    const valueInString = value.toString();

    let after = valueInString.replace(regEx1, '');  // Remove leading 0's

    if (after.indexOf('.') > -1) {
        after = after.replace(regEx2, '');  // Remove trailing 0's
    }
    after = after.replace(regEx3, '');  // Remove trailing decimal

    if (after.indexOf('.') === 0) {
        after = '0' + after
    }
    return after ? after : '0';
};

export {
    cellValue
}