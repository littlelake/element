E.mod('TodoItem', function() {
    'use strict';

    var c = E.css({
        '.item': {
            display: 'block',
            position: 'relative',
            marginBottom: '15px',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
        },
        '.text': {
            color: '#1a1a1a',
            fontSize: '14px',
            lineHeight: '30px'
        },
        '.close-btn': {
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

    var ele = E.useCss(c);

    function TodoItem(item) {
        var $text;
        var $todoItem = ele('li.item', [
            $text = ele('span.text', [item.text]),
            ele('button.close-btn', {onClick: remove}, ['&times;'])
        ]);

        function remove() {
            $todoItem.remove();
        };

        $todoItem.method('getValue', function() {
            return $text.text();
        });

        return $todoItem;
    }

    return TodoItem;

});
