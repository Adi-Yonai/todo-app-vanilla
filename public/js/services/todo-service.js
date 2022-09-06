'use strict'

var gTodos
var gFilterBy = 'ALL'
var gIsAddBox = false

function _createTodos() {
    const todos = [
        _createTodo('do1', 'do this'),
        _createTodo('do2', 'do that'),
        _createTodo('do3', 'do this again')
    ];
    return todos;
}

function getTodosForDisplay() {
    if (gFilterBy === 'ALL') 
    return gTodos;

    return gTodos.filter(todo => todo.isDone && gFilterBy === 'DONE' || 
        !todo.isDone && gFilterBy === 'ACTIVE'  
    );
}

function removeTodo(todoId) {
    const idx = gTodos.findIndex(todo => todo._id === todoId);
    gTodos.splice(idx, 1);
    sendReq("GET",`api/todo/${todoId}/remove`)
        .then(res => {console.log(JSON.parse(res).msg)})
    _saveTodosToStorage();
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo._id === todoId);
    todo.isDone = !todo.isDone;
    _saveTodosToStorage();
}

function addTodo(title, txt,prio) {
    gTodos.unshift(_createTodo(title, txt, prio));
    sendReq("GET",`api/todo/save?title=${title}&txt=${txt}&prio=${prio}`)
        .then(res => {console.log(JSON.parse(res).msg)})
    _saveTodosToStorage();
}

function updateTodo(title, txt,prio, _id, time, isDone) {
    gTodos.unshift(_createTodo(title, txt, prio));
    sendReq("GET",`api/todo/update?title=${title}&txt=${txt}&prio=${prio}&_id=${_id}&time=${time}&isDone=${isDone}`)
        .then(res => {console.log(JSON.parse(res).msg)})
    _saveTodosToStorage();
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function getAll() {
    const all = gTodos.length;
    return all;
}

function getActive() {
    const active = gTodos.filter(todo => !todo.isDone).length;
    return active
}

function _createTodo(title,txt, prio = "LOW") {
    const todo = {
        id: _makeId(),
        title: title,
        txt: txt,
        isDone: false,
        createdAt: Date.now,
        prio 
    };
    return todo
}

function _makeId(length = 5) {
    var txt = '';
    var posChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i=0; i < length; i++) {
        txt += posChar.charAt(Math.floor(Math.random() * posChar.length));
    }
    return txt;
}

function _saveTodosToStorage() {
    saveToStorage('todosDB', gTodos);
}

function _loadTodosFromStorage() {
    const str = loadFromStorage('todosDB');
    return str;
}

function loadTodos() {
        sendReq("GET","api/todo")
        .then( res => {
            gTodos = JSON.parse(res);
            console.log(res);
            renderTodos();
            renderActive();
            renderAll();
            setListeners();
        })
}

function loadTodo(todoId) {
    const todo = gTodos.find(item => item._id === todoId);
    return todo;
}