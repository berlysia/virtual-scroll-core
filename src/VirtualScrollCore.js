import Viewport from './Viewport';
import ContentBox from './ContentBox';
import {
    isArray,
    isFunction,
    isMapLike,
    isStateChanged,
    identity,
    patchProps
} from './util';


/**
 * @public
 * @typedef {Object} CoreOptions
 * @property {Array<*>} items - original list items
 * @property {number} bufferSize - number of outer items to be sliced
 * @property {number} assumedHeight - default height for height-unknown items
 * @property {Function} itemToCacheKey - use this if you like one-to-many correspondence between items and cached heights.
 * @property {MapLike} heightCache - key-value cache
 */

/**
 * @public
 * @typedef {Object} CoreState
 * @property {Array<*>} items - sliced items (to be rendered)
 * @property {number} contentHeight - assumed height of all items
 * @property {number} offsetTop - first item should have this offsetTop
 * @property {number} firstIdx - first sliced index
 * @property {number} lastIdx - last sliced index
 * @property {number} visibleFirstIdx - first visible index
 * @property {number} visibleLastIdx - last visible index
 */

/**
 * @public
 * Core state for Virtual Scroll.
 */
export default class VirtualScrollCore {

    /**
     * @public
     * @param {ViewportElement} viewportEl - scrolling container element (that is *window* in basic case)
     * @param {ContentBoxElement} contentEl - items container element
     * @param {CoreOptions} props - other properties
     */
    constructor(viewportEl, contentEl, props) {

        props = patchProps(props);

        this.viewport = new Viewport(viewportEl);
        this.contentBox = new ContentBox(contentEl, props);

        this.props = props;
        this._state = {
            contentHeight: 0,
            offsetTop: 0,
            items: [],
            firstIdx: -1,
            lastIdx: -1,
        };

        this._onReachBottomListener = [];

        this.updateCache = this.updateCache.bind(this);
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);
        this.clearCache = this.clearCache.bind(this);
    }

    /**
     * @public
     * Update height from outer object (ex. in onLoad handler)
     * @param {*} item - value which is present in props.items
     * @param {number} val - new value for cache
     * @return {boolean} successfully updated or not
     */
    updateCache(item, val) {
        return this.contentBox.updateCache(item, val);
    }

    /**
     * @public
     * Recalculate visible items.
     * @return {CoreState} next visible items
     */
    update() {
        const absTopOffset = this._absTopOffset();
        const firstIdx = this.getIndexByOffset(absTopOffset);
        const lastIdx = this._calcEndIndex(firstIdx);

        return this._updateState(firstIdx, lastIdx);
    }

    /**
     * @public
     * Refresh cached values (except height cache).
     */
    reset() {
        this.viewport.reset();
        this.contentBox.reset();
    }


    /**
     * @public
     * Refresh height cache
     */
    clearCache() {
        this.contentBox.clearCache();
    }

    /**
     * @public
     * @param {number} index - index of items
     * @return {number} offset - offsetY for specified item
     */
    getOffsetByIndex(index) {
        return this.contentBox.getOffset(index);
    }

    /**
     * @public
     * @param {number} index - index of items
     * @return {number} height - offsetHeight for specified item
     */
    getHeightByIndex(index) {
        return this.contentBox.getHeight(index);
    }

    /**
     * @public
     * @param {number} offset - target offset
     * @return {number} index - index of first item which has offset larger than given one
     */
    getIndexByOffset(offset) {
        return this.contentBox.getIndex(offset);
    }

    /**
     * @public
     * @return {number} contentHeight - height of all items
     */
    getContentHeight() {
        return this._state.contentHeight;
    }

    /**
     * @public
     * @return {number} offsetTop - offset of items container
     */
    getOffsetTop() {
        return this._state.offsetTop;
    }

    /**
     * @public
     * @return {number} visibleFirstIdx - index of visible first sliced item
     */
    getVisibleFirstIndex() {
        return this._state.visibleFirstIdx;
    }

    /**
     * @public
     * @return {number} visibleLastIdx - index of visible last sliced item
     */
    getVisibleLastIndex() {
        return this._state.visibleLastIdx;
    }

    /**
     * @public
     * @return {number} firstIdx - index of first sliced item
     */
    getFirstIndex() {
        return this._state.firstIdx;
    }

    /**
     * @public
     * @return {number} lastIdx - index of last sliced item
     */
    getLastIndex() {
        return this._state.lastIdx;
    }

    /**
     * @public
     * @return {Array<*>} items
     */
    getItems() {
        return this._state.items;
    }

    /**
     * @public
     * @return {number} length of items
     */
    getItemsLength() {
        return this._state.items.length;
    }

    /**
     * @public
     * @return {number} last index of items
     */
    getItemsLastIndex() {
        return this._state.items.length - 1;
    }

    /**
     * @public
     * @param {number} [absTopOffset] - absolute top offset in items container element
     * @return {number} visibleHeight - clientHeight in container element
     */
    getVisibleHeight(absTopOffset) {
        absTopOffset = absTopOffset || this._absTopOffset();
        return Math.min(this.viewport.size().height, this.viewport.size().height + absTopOffset);
    }

    /**
     * @public
     * @return {number} offsetTop - offset of items container
     */
    getScrollTop() {
        return this.viewport.getScrollTop();
    }

    /**
     * @param {number} firstIdx
     * @param {number} lastIdx
     * @return {CoreState}
     */
    _updateState(firstIdx, lastIdx) {
        const itemsLastIdx = this.props.items.length - 1;
        const nextState = {};
        nextState.visibleFirstIdx = firstIdx;
        nextState.visibleLastIdx = Math.min(lastIdx, itemsLastIdx);

        if (this.props.bufferSize) {
            firstIdx = Math.max(0, firstIdx - this.props.bufferSize);
            lastIdx = lastIdx + this.props.bufferSize;
        }

        nextState.contentHeight = this.contentBox.size().height;
        nextState.offsetTop = this.contentBox.getOffset(firstIdx);
        nextState.items = this.props.items.slice(firstIdx, lastIdx + 1);
        nextState.firstIdx = firstIdx;
        nextState.lastIdx = Math.min(lastIdx, itemsLastIdx);

        return this._state = (isStateChanged(this._state, nextState) ? nextState : this._state);
    }

    _absTopOffset() {
        return this.viewport.size().top - this.contentBox.size().top + this.viewport.getScrollTop();
    }

    _calcEndIndex(firstIdx) {
        const absTopOffset = this._absTopOffset();
        const visibleHeight = this.getVisibleHeight(absTopOffset);

        return Math.max(firstIdx + 1, this.contentBox.getIndex(absTopOffset + visibleHeight));
    }
}