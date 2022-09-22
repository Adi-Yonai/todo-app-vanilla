'use strict'

var gTodos
var gFilterBy = 'ALL'
var gIsAddBox = false
var gIsAddsub = false
var gCurrTodo


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

function addTodo(title, txt, prio, date, project='MAIN') {
    const todo = {
        title,
        txt,
        prio,
        date,
        project
    }
    sendReq("POST",'api/todo/', JSON.stringify(todo))
        .then(res => {
            console.log(JSON.parse(res))
            gTodos.unshift(JSON.parse(res));
            renderTodos();
            renderActive();
            renderAll();
    })
}

function updateTodo(todoToUpdate) {
    sendReq("PUT",`api/todo/${todoToUpdate._id}`, JSON.stringify(todoToUpdate))
        .then(res => {
            console.log(JSON.parse(res));
            const idx = gTodos.findIndex(todo => todo._id === todoToUpdate._id);
            gTodos[idx] = todoToUpdate;
        })
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
        return sendReq("GET","api/todo")
}

function loadTodo(todoId) {
    const todo = gTodos.find(item => item._id === todoId);
    return todo;
}

function addSub(title, txt, prio, date) {
    const subTaskToAdd = {
        title,
        txt,
        prio,
        date
    }
    const todo =loadTodo(gCurrTodo);
    sendReq("POST",`api/sub/${gCurrTodo}`, JSON.stringify(subTaskToAdd))
        .then(res => {
            console.log(JSON.parse(res))
            todo.subTasks.unshift(JSON.parse(res));
            renderTodos();
            renderSubs();
            renderActive();
            renderAll();
    })
}

function renderSubs() {
    const elActiveList = document.querySelector('sub-active-list');
    const todo = gTodos.find(todo => todo._id === gCurrTodo);
    var subTaskStr= '<hr>'
    todo.subTasks.forEach(task => {
        subTaskStr+= `<sub-task>${task.title}</sub-task><hr>`
    });
    elActiveList.innerHTML = subTaskStr;
}

function getAllSubs() {
    const todo = gTodos.find(todo => todo._id === gCurrTodo);
    const all = todo.subTasks.length;
    return all;
}

function getActiveSubs() {
    const todo = gTodos.find(todo => todo._id === gCurrTodo);
    const active = todo.subTasks.filter(todo => !todo.isDone).length;
    return active
}