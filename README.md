# Element JS
Provide minimal but useful functions to manipulate DOM and make component easily.

## Feature
* Light weight.
* High performance, 100% javascript, no need to parse template.
* Modularization.
* Support local scope CSS.
* No need to build, just include module files even unsorted.
* Easy to deploy, just concat and compress files.

## Contents
* [Create Element](#create-element)
* [Query Element](#query-element)
* [Component](#component)
* [Methods](#methods)
    * [replaceWith](#replacewith)
    * [append](#append)
    * [removeChildren](#removechildren)
    * [index](#index)
    * [show](#show)
    * [hide](#hide)
    * [Event](#event)
    * [Define Method](#define-method)
* [Utils](#utils)
    * [HTML](#html)
    * [show](#show-elements)
    * [hide](#hide-elements)
    * [Local Scope CSS](#local-scope-css)
    * [Module](#module)

## Create Element

E(desc, attrs, children)

* __desc__ : string - An element description. Format: `<tagName><.class><#id>`, such as 'ul.todo-list#my-list'
* __attrs__ : Object - The attrs
* __children__ : `Array<AdvancedElement|Element|Array<AdvancedElement|Element>>` - The children of element.

__Notice__ : `E()` will return an instance of `AdvancedElement`.

```js
E('div') // <div></div>
E('div.container#main') // <div class="container" id="main"></div>
E('input', {type: 'number'}) // <input type="number">
E('h1', ['hello']) // <h1>hello</h1>

/*
<ul id="ce-f" class="list my-list" title="ul" style="font-size: 18px; background: rgb(238, 238, 238);">
    <li class="item" style="background-color: rgb(204, 204, 204);">Item A</li>
    <li class="item" style="color: white; background-color: rgb(45, 137, 239);">Item B</li>
</ul>
*/
E('ul.list.my-list#ce-f', {title: 'ul', style: 'font-size:18px; background:#eee;'}, [
    E('li.item', {style: {backgroundColor: '#ccc'}}, ['Item A']),
    E('li.item', {style: {backgroundColor: '#2d89ef', color: 'white'}}, ['Item B'])
])

```

## Query Element

`E('#' + id)`

```js
E('#ident').show();
```

## Component
See [todo list example](./example/todo-list).

## Methods

### replaceWith
Replace with a new element.

```js
// <div id="demo"></div>

E('#demo').replaceWith(E('ul'))

// <ul></ul>
```

### append
Append child.

```js
// <div id="demo"></div>

E('#demo').append(E('span', ['demo']))

// <div id="demo"><span>demo</span></div>
```

### removeChildren
Remove children.

```js
/*
<ul id="demo">
    <li>0</li>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
*/

E('#demo').removeChildren(function(child, index) {
    return index > 1 && index < 4;
});

/*
<ul id="demo">
    <li>0</li>
    <li>1</li>
    <li>4</li>
    <li>5</li>
</ul>
*/

```

### index
Get index of parent.

```js
/*
<ul>
    <li>0</li>
    <li>1</li>
    <li id="demo">2</li>
    <li>3</li>
</ul>
*/

E('#demo').index() // 2
```

### show
Show the element.

```js
E('#demo').show() // display is block
E('#demo').show('flex') // display is flex
```

### hide
Hide the element

```js
E('#demo').hide() // display is none
```

### Event

* AdvancedElement.prototype.emit - Emit a custom event.
* AdvancedElement.prototype.on - Add custom event handler.
* AdvancedElement.prototype.listen - Add event listener.

HTML:

```html
<div id="container">
    <h4>Description:</h4>
    <p id="desc"></p>
    <button id="edit-btn">Edit</button>
</div>
```

Script:

```js
E('#container').on('prompt', function(data, callback, e) {
    e.stopPropagation();
    callback(prompt(data));
});
E('#edit-btn').listen('click', function() {
    E(this).emit('prompt', 'Write description:', function(desc) {
        E('#desc').ele.textContent = desc;
    });
});
```

### Define method
Define method for itself and it's element.

```js
var h1 = E('h1', ['hello'])
h1.method('getContent', function() {
    return this.ele.textContent;
});
h1.getContent(); // 'hello'
h1.ele.getContent(); // 'hello'
```

## Utils

### HTML
E.HTML(htmlStr)

```js
var closeBtn = E('button.close-btn', [E.HTML('&times;')]);
// <button class="close-btn">×</button>
```

### show elements
E.show([display], collection)

```js
E.show('flex', document.querySelector('.flex'));

var btnGroup = document.getElementById('btn-group');
E.show('inline-block', btnGroup.children);

E.show([
    E('div'),
    document.getElementById('container')
]);
```

### hide elements
E.hide(collection)

```js
E.hide([
    E('#close-btn'),
    document.getElementById('msg')
]);
```

### Local Scope CSS
E.css(cssObj)

You could create local scope CSS(only support no nested class rules):

```js
var c = E.css({
    btn: {
        display: 'block',
        margin: {
            left: 'auto',
            right: 'auto
        }
    },
    btnOk: {
        color: 'white',
        backgroundColor: '#2d89ef'
    }
});

var btn = E('button', {class: style('btn btn-ok')}, ['ok']);
document.body.appendChild(btn.ele);

// ElementJS will append style tag to head and add suffix:
/*
<html>
<head>
    ...
    <style>
        .btn__1{display:block;margin-left:auto;margin-right:auto;}.btn-ok__1{color:white;background-color:#2d89ef;}
    </style>
</head>
<body>
    <button class="btn__1 btn-ok__1">ok</button>
</body>
</html>
*/
```

### Module
Define a module:

```js
E.mod('greet', function() {
    return function(name) {
        console.log('Hello, ' + name + '!');
    };
});

E.mod('main', ['greet'], function(greet) {
    greet('world');
});

```

Then run the main module:

```js
E.run('main'); // 'Hello, world!'
```

## License
[MIT](./LICENSE)
