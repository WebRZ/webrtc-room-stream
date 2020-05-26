import { parseFloatValue } from './parsers';

export const formatPriceNumber = (value = '') => {
    if (value === null) return '';

    const parseResult = parseFloatValue(value);

    let integer = parseResult[0];
    const fraction = parseResult[1];

    if (fraction !== null) {
        integer = integer === null ? 0 : integer;
    }

    if (integer !== null) {
        const formattedInteger = String(integer).replace(/(.)(?=(\d{3})+$)/g, '$1 ');
        if (fraction !== null) {
            return `${formattedInteger}.${fraction} ₽`;
        }
        const hasDot = /\.|\,/.test(value);
        return hasDot ? `${formattedInteger}.` : `${formattedInteger} ₽`;
    }
    return '';
};
