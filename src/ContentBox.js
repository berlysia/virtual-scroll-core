import {calcOffsetTop} from './util';
import HeightManager from './HeightManager';

/**
 * @private
 */
export default class ContentBox {
    constructor(el, props) {
        this.el = el;
        this.heightManager = new HeightManager(props.items, props.heightCache, props.assumedHeight, props.itemToCacheKey);
        this._size = null;
    }

    updateCache(item, val) {
        const done = this.heightManager.updateCache(item, val);
        if(!done) {
            return false;
        }
        this._calculateSize();
        return true;
    }

    _calculateSize() {
        this._size = {
            top: calcOffsetTop(this.el),
            height: this.heightManager.getContentHeight(),
        };

        return this._size;
    }

    size() {
        return this._size || this._calculateSize();
    }

    getOffset(index) {
        return this.heightManager.getOffset(index);
    };

    getIndex(offset) {
        return this.heightManager.getIndex(offset);
    }

    getHeight(index) {
        return this.heightManager.getHeight(index);
    }

    getContentHeight() {
        return this.heightManager.getContentHeight();
    }

    reset() {
        this._size = null;
    }
}
