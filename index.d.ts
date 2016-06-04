type KeyType = any;
type ItemType = any;

interface CoreOptions {
    items: ItemType[];
    bufferSize: number;
    assumedHeight: number;
    itemToKeyType: (item: ItemType) => KeyType;
    heightCache: MapLike;
}

interface MapLike {
    has(key: KeyType): boolean;
    get(key: KeyType): ItemType | void;
    set(key: KeyType, val: ItemType): any;
}

interface ViewportEl extends OffsetTopCalcable {
    clientHeight?: number;
    innerHeight?: number;
    scrollY?: number;
    pageYOffset?: number;
}

interface OffsetTopCalcable {
    offsetTop: number;
    offsetParent: number;
}

interface CoreState {
    items: ItemType[];
    contentHeight: number;
    offsetTop: number;
    firstIdx: number;
    lastIdx: number;
    visibleFirstIdx: number;
    visibleLastIdx: number;
}

interface VirtualScrollCoreConstructor {
    new(viewportEl: ViewportEl, contentEl: OffsetTopCalcable, props: CoreOptions): VirtualScrollCore;
}

interface VirtualScrollCore {
    updateCache(item: ItemType, val: number): boolean;
    update(): CoreState;
    reset(): void;
    getOffsetByIndex(index: number): number;
    getHeightByIndex(index: number): number;
    getIndexByOffset(offset: number): number;
    getContentHeight(): number;
    getOffsetTop(): number;
    getVisibleFirstIndex(): number;
    getVisibleLastIndex(): number;
    getFirstIndex(): number;
    getLastIndex(): number;
    getItems(): ItemType[];
    getVisibleHeight(absTopOffset?: number): number;
    getScrollTop(): number;
}

declare module 'virtual-scroll-core' {
    export default VirtualScrollCoreConstructor;
}
