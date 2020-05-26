import makeUrl from '../../utils/make-url';

export const stream = (...args) => makeUrl('/stream/:id', ...args);

export default { stream };
