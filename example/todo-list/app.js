E.mod('app', [
    'TodoList'
], function(TodoList) {
    'use strict';

    var $todoList = TodoList([{text: 'Item A'}, {text: 'Item B'}]);
    $('#todo-list').replaceWith($todoList);
    $('#log-btn').click(function() {
        console.log($todoList.method('getData')());
    });
});

E.run('app');
