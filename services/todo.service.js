
const gTodos = require('../data/todo.json')
const Fs = require('fs')
const { time } = require('console')

function query() {
    return Promise.resolve(gTodos)
}

function getById(todoId) {
    const todo = gTodos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('Todo not found')
    return Promise.resolve(todo)
}

function remove(todoId) {
    const idx = gTodos.findIndex(todo => todo._id === todoId)
    gTodos.splice(idx, 1)
    _saveTodosToFile()
    return Promise.resolve()
}

function create(todo) {
    todo._id = _makeId()
    todo.createdAt = Date.now
    todo.isDone = false
    gTodos.push(todo)
    _saveTodosToFile()
    return Promise.resolve(todo)
}

function update(todoToUpdate) {
    const idx = gTodos.findIndex(todo => todo._id === todoToUpdate._id)
    if (idx===-1) return Promise.reject(' Todo not found')
    gTodos[idx] = todoToUpdate
    _saveTodosToFile()
    return Promise.resolve(todoToUpdate)
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