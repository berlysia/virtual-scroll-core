# virtual-scroll-core

height cacheable virtual scroll - core only

## Install

Install with [npm](https://www.npmjs.com/):

    npm install virtual-scroll-core

## Usage

WIP

## API

### CoreOptions

**Properties**

-   `items` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Any>** original list items
-   `bufferSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of outer items to be sliced
-   `assumedHeight` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** default height for height-unknown items
-   `itemToCacheKey` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** use this if you like one-to-many correspondence between items and cached heights.
-   `heightCache` **MapLike** key-value cache

### VirtualScrollCore

#### constructor

**Parameters**

-   `viewportEl` **ViewportElement** scrolling container element (that is _window_ in basic case)
-   `contentEl` **ContentBoxElement** items container element
-   `props` **CoreOptions** other properties

#### updateCache

**Parameters**

-   `item` **Any** value which is present in props.items
-   `val` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** new value for cache

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** successfully updated or not

#### update

Returns **CoreState** next visible items

#### reset

#### clearCache

#### getOffsetByIndex

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of items

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** offset - offsetY for specified item

#### getHeightByIndex

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of items

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** height - offsetHeight for specified item

#### getIndexByOffset

**Parameters**

-   `offset` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** target offset

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index - index of first item which has offset larger than given one

#### getContentHeight

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** contentHeight - height of all items

#### getOffsetTop

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** offsetTop - offset of items container

#### getVisibleFirstIndex

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** visibleFirstIdx - index of visible first sliced item

#### getVisibleLastIndex

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** visibleLastIdx - index of visible last sliced item

#### getFirstIndex

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** firstIdx - index of first sliced item

#### getLastIndex

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** lastIdx - index of last sliced item

#### getItems

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Any>** items

#### getItemsLength

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** length of items

#### getItemsLastIndex

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** last index of items

#### getVisibleHeight

**Parameters**

-   `absTopOffset` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** absolute top offset in items container element

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** visibleHeight - clientHeight in container element

#### getScrollTop

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** offsetTop - offset of items container

### CoreState

**Properties**

-   `items` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Any>** sliced items (to be rendered)
-   `contentHeight` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** assumed height of all items
-   `offsetTop` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** first item should have this offsetTop
-   `firstIdx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** first sliced index
-   `lastIdx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** last sliced index
-   `visibleFirstIdx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** first visible index
-   `visibleLastIdx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** last visible index

## Running tests

Install devDependencies and Run `npm test`.
or simply:

    npm -d it

## Contributing

Pull requests and stars are always welcome.
For bugs and feature requests, [please create an issue](https://github.com/berlysia/virtual-scroll-core/issues).

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Special Thanks

Basic idea is derived from [mir3z/react-virtual-list](https://github.com/mir3z/react-virtual-list) (MIT License).

## License

Copyright © 2016-present berlysia.
Licensed under the MIT license.
