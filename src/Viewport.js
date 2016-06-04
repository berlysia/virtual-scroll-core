import {calcOffsetTop} from './util';

/**
 * @typedef {Object} SizeObject
 * @property {number} top - offsetTop
 * @property {number} height - clientHeight
 */

/**
 * size manager for Viewport
 */
export default class Viewport {
    /**
     * @param {HTMLElement} el - viewport element
     */
    constructor(el) {
        this.el = el;
        this._size = null;
    }

    /**
     * @return {SizeObject}
     */
    _calculateSize() {
        return this._size = {
            top: calcOffsetTop(this.el),
            height: this.el.clientHeight || this.el.innerHeight,
        };
    }

    /**
     * @return {SizeObject}
     */
    size() {
        return this._size || this._calculateSize();
    }

    /**
     * @return {number} scrollTop
     */
    getScrollTop() {
        let scrollTop = this.el.scrollTop;

        if (typeof scrollTop === 'undefined') {
            scrollTop = this.el.scrollY || this.el.pageYOffset;
        }

        return scrollTop;
    };

    /**
     * reset state
     * @return {void}
     */
    reset() {
        this._size = null;
    }
}
