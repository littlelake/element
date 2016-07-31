E.mod('TodoList', [
    'TodoItem'
], function(TodoItem) {
    'use strict';

    var c = E.style(function() {
        /*
        @css
        .container {
            position: relative;
            padding: 15px;
            border: 1px solid #ccc;
            margin-bottom: 20px;
        }
        .todo-list {
            position: relative;
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .operate-panel {display: flex;}
        .input {
            padding-left: 15px;
            box-sizing: border-box;
            border: 2px solid #2d89ef;
            height: 40px;
            font-size: 16px;
            flex: 1;
        }
        .add-btn {
            width: 100px;
            height: 40px;
            border: none;
            outline: none;
            color: white;
            background-color: #2d89ef;
        }
        */
    });

    function TodoList(list) {
        var todoList, input;
        var container = E('div', {class: c('container')}, [
            todoList = E('ul', {class: c('todo-list')}, [
                list.map(TodoItem)
            ]),
            E('div', {class: c('operate-panel')}, [
                input = E('input', {type: 'text', class: c('input'), onKeydown: onKeydown}),
                E('button', {onClick: addItem, class: c('add-btn')}, ['Add'])
            ])
        ]);

        function addItem() {
            var val = input.ele.value;
            if (val == '') {
                return;
            }
            todoList.append(TodoItem({text: val}));
            input.ele.value = '';
        }

        function onKeydown(e) {
            if (e.keyCode == 13) {
                addItem();
            }
        }

        container.method('getData', function() {
            return Array.prototype.map.call(todoList.ele.children, function(child) {
                return {text: child.getValue()};
            });
        });

        return container;
    }

    return TodoList;

});
