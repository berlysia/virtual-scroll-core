import isWindow from 'is-window';
import _isArray from 'is-array';
import ObjectKeys from 'object-keys';

export function calcOffsetTop(el) {
    if (isWindow(el)) return 0;
    let y = 0;

    while (!!el) {
        y += el.offsetTop;
        el = el.offsetParent;
    }

    return y;
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export const isArray = _isArray;

export function isMapLike(obj) {
    if(!obj) return false;
    if(typeof obj.has !== 'function') return false;
    if(typeof obj.get !== 'function') return false;
    if(typeof obj.set !== 'function') return false;
    return true;
}

export function isStateChanged(prev, next) {
    // items is not efficient
    if(prev.contentHeight !== next.contentHeight) return true;
    if(prev.offsetTop !== next.offsetTop) return true;
    if(prev.firstIdx !== next.firstIdx) return true;
    if(prev.lastIdx !== next.lastIdx) return true;
    if(prev.visibleFirstIdx !== next.visibleFirstIdx) return true;
    if(prev.visibleLastIdx !== next.visibleLastIdx) return true;
    return false;
}

/**
 * @external {MapLike} https://github.com/azu/map-like
 */

/**
 * @typedef {Object} ViewportElement
 * @property {number} [clientHeight] - or innerHeight
 * @property {number} [innerHeight] - or clientHeight
 * @property {number} [scrollY] - or pageYOffset
 * @property {number} [pageYOffset] - or scrollY
 * @property {number} offsetTop
 * @property {number} offsetParent
 */

/**
 * @typedef {Object} ContentBoxElement
 * @property {number} offsetTop
 * @property {number} offsetParent
 */

export function identity(x) {return x;}

export function patchProps(props) {
    if(!props) {
        throw new Error('3rd argument "props" is required.');
    }
    
    const validated = {};
    if(!isArray(props.items)) {
        throw new Error('3rd argument "props" must have "items", and "props.items" should be an Array.');
    }
    validated.items = props.items;

    validated.bufferSize = props.bufferSize || 0;

    if(props.assumedHeight == null || props.assumedHeight <= 0) {
        throw new Error('3rd argument "props" must have "assumedHeight", and "props.assumedHeight" should be an positive number.')
    }
    validated.assumedHeight = props.assumedHeight;

    validated.itemToCacheKey = 
        (isFunction(props.itemToCacheKey))
            ? props.itemToCacheKey
            : identity;

    validated.heightCache = 
        (isMapLike(props.heightCache))
            ? props.heightCache
            : new MapLike();

    return validated;
}
