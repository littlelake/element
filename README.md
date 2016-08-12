# Element JS
An easy way for modularization based on jQuery or Zepto.

## Feature
* Light weight.
* High performance, 100% javascript, no need to parse string.
* Modularization.
* Support local scope CSS.
* No need to build, just include module files even unsorted.
* Easy to deploy, just concat and compress files.

## Contents
* [Create Element](#create-element)
* [Define Module](#define-module)
* [Define Method](#define-method)
* [Local Scope CSS](#local-scope-css)
* [Full Example](#full-example)

## Create Element

E(desc, attrs, children)

* __desc__ : string - An element description. Format: `<tagName><.class><#id>`, such as 'ul.todo-list#my-list'
* __attrs__ : Object - The attrs
* __children__ : `Array<jQuery|Zepto|Element|Array<jQuery|Zepto|Element>>` - The children of element.

__Notice__ : `E()` will return an instance of `jQuery` or `Zepto`.

```js
E('div') // [<div></div>]
E('div.container#main') // [<div class="container" id="main"></div>]
E('input', {type: 'number'}) // [<input type="number">]
E('h1', ['hello']) // [<h1>hello</h1>]

/*
[<ul id="ce-f" class="list my-list" title="ul" style="font-size: 18px; background: rgb(238, 238, 238);">
    <li class="item" style="background-color: rgb(204, 204, 204);">Item A</li>
    <li class="item" style="color: white; background-color: rgb(45, 137, 239);">Item B</li>
</ul>]
*/
E('ul.list.my-list#ce-f', {title: 'ul', style: 'font-size:18px; background:#eee;'}, [
    E('li.item', {style: {backgroundColor: '#ccc'}}, ['Item A']),
    E('li.item', {style: {backgroundColor: '#2d89ef', color: 'white'}}, ['Item B'])
])

```

## Define Module
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

## Define method
Define or get method:

```js
var $h1 = E('h1', ['hello'])
$h1.method('getContent', function() {
    return this.text();
});
$h1.method().getContent(); // 'hello'
```


## Local Scope CSS
E.css(cssObj)

You could create local scope CSS(only support no nested class rules):

```js
var c = E.css({
    '.btn': {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    '.btn-ok': {
        color: 'white',
        backgroundColor: '#2d89ef'
    }
});

var $btn = E('button', {class: c('btn btn-ok')}, ['ok']);
$(document.body).append($btn);

// or:
var ele = E.useCss(c);
var $btn = ele('button.btn.btn-ok', ['ok']);
$(document.body).append($btn);

// ElementJS will append style tag to head and add suffix:
/*
<html>
<head>
    ...
    <style>
        .btn__1{display:block;margin-left:auto;margin-right:auto;}
        .btn-ok__1{color:white;background-color:#2d89ef;}
    </style>
</head>
<body>
    <button class="btn__1 btn-ok__1">ok</button>
</body>
</html>
*/
```

## Full Example
See [Todo List Example](./example/todo-list).

## License
[MIT](./LICENSE)
