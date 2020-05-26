// Переписанный jQuery.param. Полностью соответствует для jQuery версии 2.2.1
let s;

function add(key, value) {
    let normalizedValue;
    if (typeof value === 'function') {
        normalizedValue = value();
    } else if (value === null || value === undefined) {
        normalizedValue = '';
    } else {
        normalizedValue = value;
    }
    s[s.length] = `${encodeURIComponent(key)}=${encodeURIComponent(normalizedValue)}`;
}

function addArray(prefix, array) {
    const bracketRegex = /\[]$/;
    array.forEach((value, i) => {
        if (bracketRegex.test(prefix)) {
            add(prefix, value);
        } else {
            buildParams(`${prefix}[${i}]`, value);
        }
    });
}

function addObject(prefix, object) {
    Object.keys(object).forEach((key) => {
        buildParams(`${prefix}[${key}]`, object[key]);
    });
}

function buildParams(prefix, obj) {
    if (prefix) {
        if (Array.isArray(obj)) {
            addArray(prefix, obj);
        } else if (obj && String(obj) === '[object Object]') {
            addObject(prefix, obj);
        } else {
            add(prefix, obj);
        }
    } else if (Array.isArray(obj)) {
        obj.forEach((value) => {
            add(value.name, value.value);
        });
    } else {
        Object.keys(obj).forEach((key) => {
            buildParams(key, obj[key]);
        });
    }
}

export default function param(data) {
    s = [];
    buildParams('', data);
    return s.join('&').replace(/%20/g, '+');
}
