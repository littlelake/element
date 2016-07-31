E.mod('app', [
    'TodoList'
], function(TodoList) {
    'use strict';

    var todoList = TodoList([{text: 'Item A'}, {text: 'Item B'}]);
    E('#todo-list').replaceWith(todoList);
    E('#log-btn').listen('click', function() {
        console.log(todoList.getData());
    });
});

E.run('app');
