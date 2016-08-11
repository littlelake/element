;(function(E) {
    'use strict';

    // testing create element
    (function() {
        createTestElements('testing-create-element', 'create-element', 11);

        var no = 0;
        var test = function(ele) {
            $('#create-element-' + no).append(ele);
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
