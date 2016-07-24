# Element JS
Provide minimal but useful functions to manipulating DOM.

## Contents
* [Quick Start](#quick-start)
* [Create Element](#create-element)
* [Utils](#utils)
    * [replace](#replace)
    * [removeChildren](#removechildren)
    * [indexOf](#indexof)
    * [show](#show)
    * [hide](#hide)

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Demo</title>
</head>
<body>
    <div id="todo-list"></div>

    <script src="element.js"></script>
    <script>
        (function(E) {
            var todoList = E('ul.todo-list#todo-list', [
                E('li.todo-item', {style: {color: 'red'}, title: 'A'}, ['Item A']),
                E('li.todo-item', {style: {color: 'blue'}, title: 'B'}, ['Item B'])
            ]);
            E.replace('todo-list', todoList);

            // then the div#todo-list will be:
            /*
            <ul class="todo-list" id="todo-list">
                <li class="todo-item" style="color:red;" title="A">Item A</li>
                <li class="todo-item" style="color:blue;" title="B">Item B</li>
            </ul>
            */

        })(E);
    </script>
</body>
</html>
```

## Create Element

E(desc, [attrs], [children])

* __desc__ - format: `<tag>[.<class>]*[#<id>]?`, such as: `'div.container.center-block#main-container'`
* __attrs__ - the attributes of element
* __children__ - the children of element

Examples:

```js
E('div'); // <div></div>
E('ul.nav.nav-inverse#header-nav'); // <ul class="nav nav-inverse" id="header-nav"></ul>
E('li', ['item']); // <li>item</li>

E('ul.todo-list', {style: 'background-color: #ccc;'}, [
    E('li', ['Item A']),
    E('li', ['Item B']),
    'Item C'
]);
/*
<ul class="todo-list" style="background-color: #ccc;">
    <li>Item A</li>
    <li>Item B</li>
    Item C
</ul>
*/

var list = ['a', 'b'];
E('ul', [
    list.map(function(item) {
        return E('li', [item]);
    }),
    E('li', ['end'])
]);
/*
<ul>
    <li>a</li>
    <li>b</li>
    <li>end</li>
</ul>
*/

```

## Utils

### replace
E.replace(idOrEle, element)

Replace with new element.

Examples:

```js
/*
Before:
<div id="demo"></div>
*/
E.replace('demo', E('ul'));
/*
After:
<ul></ul>
*/
```

### removeChildren
E.removeChildren(idOrEle, fn)

Remove children.

Examples:

```js
/*
Before:
<ul id="list">
    <li>0</li>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
*/
E.removeChildren('list', function(child, index) {
    return index < 2;
});
/*
After:
<ul id="list">
    <li>2</li>
    <li>3</li>
</ul>
*/
```

### indexOf
E.indexOf(idOrEle, child)

Get index of parentNode.

Examples:

```js
var itemA = E('li', ['A']);
var itemB = E('li', ['B']);
var list = E('ul', [
    itemA,
    itemB
]);
E.indexOf(list, itemB); // 1
```

### show
E.show(display, collection)

Show element(s).

Examples:

```js
var eleA = document.getElementById('demo-a');
var eleB = document.getElementById('demo-b');
var eleC = document.getElementById('demo-c');

E.show(eleA); // eleA.style.display is 'block'
E.show('flex', eleA) // eleA.style.display is 'flex'
E.show('flex', [
    eleB,
    eleC
]); // both eleB.style.display and eleC.style.display are 'flex'
E.show([
    eleA,
    eleB
]); // both eleB.style.display and eleC.style.display are 'block'

```

### hide
E.hide(collection)

Hide element(s).

Examples:

```js
var eleA = document.getElementById('demo-a');
var eleB = document.getElementById('demo-b');
var eleC = document.getElementById('demo-c');

E.hide(eleA); // eleA.style.display is 'none'
E.hide([
    eleB,
    eleC
]); // both eleB.style.display and eleC.style.display are 'none'

```

## License
[MIT](./LICENSE)
