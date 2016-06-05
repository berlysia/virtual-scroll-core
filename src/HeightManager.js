import MapLike from 'map-like';
import BinaryIndexedTree from 'binary-indexed-tree';

/**
 * @private
 * height cache wrapper object
 */
export default class HeightManager {
    constructor(items, cache, defaultHeight, itemToCacheKey) {
        this.cache = cache;
        this.keyToIdxMap = new MapLike();
        this.itemToCacheKey = itemToCacheKey;

        const heights = items.map((x, idx) => {
            const key = itemToCacheKey(x);
            this.keyToIdxMap.set(key, idx);
            if(cache.has(key)) {
                return cache.get(key);
            } else {
                return defaultHeight;
            }
        });
        this._bit = BinaryIndexedTree.build(heights);
    }

    reset() {
        this.cache.clear();
    }

    updateCache(item, val) {
        const key = this.itemToCacheKey(item);
        if(!this.keyToIdxMap.has(key)) return false;
        
        const idx = this.keyToIdxMap.get(key);
        this.cache.set(key, val);
        this._bit.replace(idx, val);
        return true;
    };

    getOffset(index) {
        return this._bit.prefix(index);
    }

    getIndex(offset) {
        return Math.max(0, this._bit.lowerBound(offset));
    }

    getHeight(index) {
        return this._bit.original(index);
    }

    getContentHeight() {
        return this._bit.sum();
    }
}