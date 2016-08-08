E.mod('TodoList', [
    'TodoItem'
], function(TodoItem) {
    'use strict';
    
    var c = E.css({
        container: {
            position: 'relative',
            padding: '15px',
            border: '1px solid #ccc',
            marginBottom: '20px'
        },
        todoList: {
            position: 'relative',
            margin: 0,
            padding: 0,
            listStyle: 'none'
        },
        operatePanel: {
            display: 'flex'
        },
        input: {
            padding: {
                left: '15px',
                right: '15px'
            },
            boxSizing: 'border-box',
            border: '2px solid #2d89ef',
            height: '40px',
            fontSize: '16px',
            flex: 1
        },
        addBtn: {
            width: '100px',
            height: '40px',
            border: 'none',
            outline: 'none',
            color: 'white',
            backgroundColor: '#2d89ef',
            ':disabled': {
                color: '#ccc'
            }
        }
    });

    var TodoList = E.defCom(c, function(list) {
        var todoList, input;
        var container = E('div.container', [
            todoList = E('ul.todo-list', [
                list.map(TodoItem)
            ]),
            E('div.operate-panel', [
                input = E('input.input', {type: 'text', onKeydown: onKeydown}),
                E('button.add-btn', {onClick: addItem}, ['Add'])
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
                return {text: E(child).getValue()};
            });
        });

        return container;
    });

    return TodoList;

});
