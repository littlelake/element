;(function(E) {
    'use strict';

    // testing create element
    (function() {
        createTestElements('testing-create-element', 'create-element', 11);

        var no = 0;
        var test = function(ele) {
            E('#create-element-' + no).append(ele);
            no += 1;
        };

        test(E('div'));
        test(E('div#ce-a'));
        test(E('div.test'));
        test(E('div.header.title'));
        test(E('div.list#ce-b'));
        test(E('div.list.my-list#ce-c'));
        test(E('input.form-input#ce-d', {type: 'number', placeholder: 'Enter number'}));
        test(E('textarea', {rows: 3, cols: 5, placeholder: 'Enter text here...'}));
        test(E('h1.header', ['Hello, world!']));
        test(E('div.c1.c2#ce-e', {data: {id: 'id-1'}}, ['Test']));
        test(E('ul.list.my-list#ce-f', {title: 'ul', style: 'font-size:18px; background:#eee;'}, [
            E('li.item', {style: {backgroundColor: '#ccc'}}, ['Item A']),
            E('li.item', {style: {backgroundColor: '#2d89ef', color: 'white'}}, ['Item B'])
        ]));

    })();

    // testing query element
    (function() {
        console.log(E('#ce-a'));
        var ele = document.getElementById('ce-a');
        console.log(E(ele));
    })();

    // testing methods
    (function() {

        // replaceWith
        E('#t-methods-replaceWith-0').replaceWith(E('button', ['button']));
        E('#t-methods-replaceWith-1').replaceWith(document.createElement('input'));

        // append
        E('#t-methods-append-0').append(E('button', ['button']));
        E('#t-methods-append-1').append(document.createElement('input'));

        // removeChildren
        E('#t-methods-removeChildren').removeChildren(function(child, index) {
            return index > 1 && index < 4;
        });

        // index
        console.log('[prototype.index]', E('#t-methods-index').index());

        // show
        E('#t-methods-show-0').show();
        E('#t-methods-show-1').show('flex');

        // hide
        E('#t-methods-hide').hide();

        // event
        E('#t-methods-event-on').on('prompt', function(data, callback) {
            callback(prompt(data));
        });
        E('#t-methods-event-emit').listen('click', function() {
            E(this).emit('prompt', 'Write description:', function(desc) {
                E('#t-methods-event-desc').ele.textContent = desc;
            });
        });

    })();

    // testing component
    (function() {
        var todoList = TodoList([]);
        E('#t-todo-list').replaceWith(todoList);
        E('#t-todo-list-log').listen('click', function() {
            console.log(todoList.getData());
        });

        function TodoList(list) {
            var todoList, input;
            var container = E('div.todo-list-container', [
                todoList = E('ul.todo-list', [
                    list.map(TodoItem)
                ]),
                E('div.operate-panel', [
                    input = E('input', {type: 'text'}),
                    E('button', {onClick: addItem}, ['Add'])
                ])
            ]);

            function addItem() {
                todoList.append(TodoItem({text: input.ele.value}));
                input.ele.value = '';
            }

            container.method('getData', function() {
                return Array.prototype.map.call(todoList.ele.children, function(child) {
                    return {text: child.getValue()};
                });
            });

            return container;
        }

        function TodoItem(item) {
            var text;
            var todoItem = E('li.todo-item', [
                text = E('span', [item.text]),
                E('button', {onClick: remove}, [E.HTML('&times;')])
            ]);

            function remove() {
                todoItem.ele.remove();
            };

            todoItem.method('getValue', function() {
                return text.ele.textContent;
            });

            return todoItem;
        }

    })();

    // testing utils
    (function() {
        // E.HTML
        E('#t-utils-html').append(E('button', [E.HTML('&times;')]));

        // E.show
        E.show('inline-block', document.querySelectorAll('#t-utils-show .btn'));

        // E.hide
        E.hide(document.querySelectorAll('#t-utils-hide .btn'));

    })();

    // helper function
    function createTestElements(pid, prefix, count) {
        var parent = document.getElementById(pid);
        for (var i = 0; i < count; i++) {
            var div = document.createElement('div');
            div.id = prefix + '-' + i;
            parent.appendChild(div);
        }
    }

})(E);
