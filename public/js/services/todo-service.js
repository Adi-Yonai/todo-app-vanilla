'use strict'

var gTodos
var gFilterBy = 'ALL'
var gIsAddBox = false


function getTodosForDisplay() {
    if (gFilterBy === 'ALL') 
    return gTodos;

    return gTodos.filter(todo => todo.isDone && gFilterBy === 'DONE' || 
        !todo.isDone && gFilterBy === 'ACTIVE'  
    );
}

function removeTodo(todoId) {
    sendReq("DELETE",`api/todo/${todoId}`)
        .then(res => {
        console.log(JSON.parse(res).msg)
        const idx = gTodos.findIndex(todo => todo._id === todoId);
        gTodos.splice(idx, 1);
        renderTodos();
        })
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo._id === todoId);
    todo.isDone = !todo.isDone;
}

function addTodo(title, txt,prio) {
    const todo = {
        title,
        txt,
        prio
    }
    sendReq("POST",'api/todo/', JSON.stringify(todo))
        .then(res => {console.log(JSON.parse(res))
        gTodos.unshift(JSON.parse(res));
        renderTodos();
    })
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