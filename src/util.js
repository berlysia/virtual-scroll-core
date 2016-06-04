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
