E.mod('TodoItem', function() {
    'use strict';

    var c = E.css({
        item: {
            display: 'block',
            position: 'relative',
            marginBottom: '15px',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
        },
        text: {
            color: '#1a1a1a',
            fontSize: '14px',
            lineHeight: '30px'
        },
        closeBtn: {
            position: 'absolute',
            right: '15px',
            top: '15px',
            lineHeight: '30px',
            fontSize: '30px',
            cursor: 'pointer',
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent',
            color: '#1a1a1a'
        }
    });

    var TodoItem = E.defCom(c, function(item) {
        var text;
        var todoItem = E('li.item', [
            text = E('span.text', [item.text]),
            E('button.close-btn', {onClick: remove}, [E.HTML('&times;')])
        ]);

        function remove() {
            todoItem.ele.remove();
        };

        todoItem.method('getValue', function() {
            return text.ele.textContent;
        });

        return todoItem;
    });

    return TodoItem;

});
