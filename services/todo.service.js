
const gTodos = require('../data/todo.json')
const Fs = require('fs')
const { time } = require('console')

function query() {
    return Promise.resolve(gTodos)
}

function getById(todoId) {
    const todo = gTodos.find(todo => todo._id === todoId)
    return Promise.resolve(todo)
}

function remove(todoId) {
    const idx = gTodos.findIndex(todo => todo._id === todoId)
    gTodos.splice(idx, 1)
    _saveTodosToFile()
    return Promise.resolve()
}

function create(title,txt, prio) {
    const todo = {
        _id: _makeId(),
        title,
        txt,
        isDone: false,
        createdAt: Date.now,
        prio 
    };
    gTodos.push(todo)
    _saveTodosToFile()
    return Promise.resolve(todo)
}

function update(title,txt, prio, _id, time, isDone) {
    const todo = {
        _id,
        title,
        txt,
        isDone,
        createdAt: time,
        prio 
    };
    const idx = gTodos.findIndex(todo => todo._id === todoId)
    gTodos[idx] = todo
    _saveTodosToFile()
    return Promise.resolve(todo)
}


function _saveTodosToFile() {
    return new Promise((resolve, reject) => {
        Fs.writeFile('data/todo.json', JSON.stringify(gTodos), (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _makeId(length = 5) {
    var txt = '';
    var posChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i=0; i < length; i++) {
        txt += posChar.charAt(Math.floor(Math.random() * posChar.length));
    }
    return txt;
}


module.exports = {
    query,
    getById,
    remove,
    create,
    update
}