import Viewport from './Viewport';
import ContentBox from './ContentBox';
import {isArray, isFunction, isMapLike, isStateChanged} from './util';

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

/**
 * @typedef {Object} CoreOptions
 * @property {Array<*>} items
 * @property {number} bufferSize
 * @property {number} assumedHeight
 * @property {Function} itemToCacheKey
 * @property {MapLike} heightCache
 */

/**
 * @typedef {Object} CoreState
 * @property {Array<*>} items
 * @property {number} contentHeight
 * @property {number} offsetTop
 * @property {number} firstIdx
 * @property {number} lastIdx
 * @property {number} visibleFirstIdx
 * @property {number} visibleLastIdx
 */


function identity(x) {return x;}

function patchProps(props) {
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

/**
 * Core state for Virtual Scroll.
 */
export default class VirtualScrollCore {
    /**
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
    }

    /**
     * Update height from outer object (ex. in onLoad handler)
     * @param {*} item - value which is present in props.items
     * @param {number} val - new value for cache
     * @return {boolean} successfully updated or not
     */
    updateCache(item, val) {
        return this.contentBox.updateCache(item, val);
    }

    /**
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
     * Refresh cached values (except heightCache).
     */
    reset() {
        this.viewport.reset();
        this.contentBox.reset();
    }

    /**
     * @param {number} index - index of items
     * @return {number} offset - offsetY for specified item
     */
    getOffsetByIndex(index) {
        return this.contentBox.getOffset(index);
    }

    /**
     * @param {number} index - index of items
     * @return {number} height - offsetHeight for specified item
     */
    getHeightByIndex(index) {
        return this.contentBox.getHeight(index);
    }

    /**
     * @param {number} offset - target offset
     * @return {number} index - index of first item which has offset larger than given one
     */
    getIndexByOffset(offset) {
        return this.contentBox.getIndex(offset);
    }

    /**
     * @return {number} contentHeight - height of all items
     */
    getContentHeight() {
        return this._state.contentHeight;
    }

    /**
     * @return {number} offsetTop - offset of items container
     */
    getOffsetTop() {
        return this._state.offsetTop;
    }

    /**
     * @return {number} visibleFirstIdx - index of visible first sliced item
     */
    getVisibleFirstIndex() {
        return this._state.visibleFirstIdx;
    }

    /**
     * @return {number} visibleLastIdx - index of visible last sliced item
     */
    getVisibleLastIndex() {
        return this._state.visibleLastIdx;
    }

    /**
     * @return {number} firstIdx - index of first sliced item
     */
    getFirstIndex() {
        return this._state.firstIdx;
    }

    /**
     * @return {number} lastIdx - index of last sliced item
     */
    getLastIndex() {
        return this._state.lastIdx;
    }

    /**
     * @return {Array<*>} items
     */
    getItems() {
        return this._state.items;
    }

    /**
     * @param {number} [absTopOffset] - absolute top offset in items container element
     * @return {number} visibleHeight - clientHeight in container element
     */
    getVisibleHeight(absTopOffset) {
        absTopOffset = absTopOffset || this._absTopOffset();
        return Math.min(this.viewport.size().height, this.viewport.size().height + absTopOffset);
    }

    /**
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