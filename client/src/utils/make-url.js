import flowRight from 'lodash.flowright';

import param from './param';

const replaceParam = (params) => (url, key) => url.replace(new RegExp(`:${key}`, 'g'), params[key]);

const isObject = (p) => typeof p === 'object';

const applyUrlParts = (url) => {
    return isObject(url) ? `${url.host}${url.path}` : url;
};

const applyParams = (params = {}) => (url) => Object.keys(params).reduce(replaceParam(params), url);

const applyQueryString = (qs = {}) => (url) => {
    const qsParams = param(qs);
    return qsParams ? `${url}?${qsParams}` : url;
};

export default (url = '', params = {}, qs = {}) =>
    decodeURIComponent(flowRight(applyQueryString(qs), applyParams(params), applyUrlParts)(url));
