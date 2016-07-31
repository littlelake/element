E.mod('TodoItem', function() {
    'use strict';

    var c = E.style(function() {
        /*
        @css

        .item {
            display: block;
            position: relative;
            margin-bottom: 15px;
            padding: 15px;
            background-color: white;
            box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
        }
        .text {
            color: #1a1a1a;
            font-size: 14px;
            line-height: 30px;
        }
        .close-btn {
            position: absolute;
            right: 15px;
            top: 15px;
            line-height: 30px;
            font-size: 30px;
            cursor: pointer;
            border: none;
            padding: 0;
            background-color: transparent;
            color: #1a1a1a;
        }
        */
    });

    function TodoItem(item) {
        var text;
        var todoItem = E('li', {class: c('item')}, [
            text = E('span', {class: c('text')}, [item.text]),
            E('button', {onClick: remove, class: c('close-btn')}, [E.HTML('&times;')])
        ]);

        function remove() {
            todoItem.ele.remove();
        };

        todoItem.method('getValue', function() {
            return text.ele.textContent;
        });

        return todoItem;
    }

    return TodoItem;

});
