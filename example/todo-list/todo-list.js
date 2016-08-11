E.mod('TodoList', [
    'TodoItem'
], function(TodoItem) {
    'use strict';
    
    var c = E.css({
        '.container': {
            position: 'relative',
            padding: '15px',
            border: '1px solid #ccc',
            marginBottom: '20px'
        },
        '.todo-list': {
            position: 'relative',
            margin: 0,
            padding: 0,
            listStyle: 'none'
        },
        '.operate-panel': {
            display: 'flex'
        },
        '.input': {
            paddingLeft: '15px',
            paddingRight: '15px',
            boxSizing: 'border-box',
            border: '2px solid #2d89ef',
            height: '40px',
            fontSize: '16px',
            flex: 1
        },
        '.add-btn': {
            width: '100px',
            height: '40px',
            border: 'none',
            outline: 'none',
            color: 'white',
            backgroundColor: '#2d89ef',
            '&:disabled': {
                color: '#ccc'
            }
        }
    });

    var ele = E.useCss(c);

    function TodoList(list) {
        var $todoList, $input;
        var $container = ele('div.container', [
            $todoList = ele('ul.todo-list', [
                $.map(list, TodoItem)
            ]),
            ele('div.operate-panel', [
                $input = ele('input.input', {type: 'text', onKeydown: onKeydown}),
                ele('button.add-btn', {onClick: addItem}, ['Add'])
            ])
        ]);

        function addItem() {
            var val = $input.val();
            if (val == '') {
                return;
            }
            $todoList.append(TodoItem({text: val}));
            $input.val('');
        }

        function onKeydown(e) {
            if (e.keyCode == 13) {
                addItem();
            }
        }

        $container.method('getData', function() {
            return $todoList.children().map(function() {
                return $(this).method('getValue')();
            }).get();
        });

        return $container;
    }

    return TodoList;

});
