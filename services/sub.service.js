
const Fs = require('fs')
const gTodos = require('../data/todo.json')


function query(loggedinUser) {
    const todos = gTodos.filter(todo => {return todo.owner._id === loggedinUser._id})
    return Promise.resolve(todos)
}

function getById(todoId, loggedinUser) {
    const todo = gTodos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('Todo not found')
    if (todo.owner._id !== loggedinUser._id) return Promise.reject('Not your todo')
    return Promise.resolve(todo)
}

function remove(todoId, loggedinUser) {
    const idx = gTodos.findIndex(todo => todo._id === todoId)
    if (idx === -1) return Promise.reject('Car not found')
    if (!loggedinUser.isAdmin && gTodos[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your todo')
    gTodos.splice(idx, 1)
    return _saveTodosToFile()
}

function save({_id, title, txt, prio, isDone, date}, todoId, loggedinUser) {
    const todoToSave = gTodos.find(todo => todo._id === todoId)
    if (!todoToSave) return Promise.reject(' Todo not found')
    if (!loggedinUser.isAdmin && todoToSave.owner._id !== loggedinUser._id) return Promise.reject('Not your todo')
    
    const subTaskToSave = {
        _id,
        title,
        txt,
        prio,
        isDone,
        date,
    }
    
    if (_id) {
        // UPDATE
        const idx = todoToSave.subTasks.findIndex(subTask => subTask._id === subTaskToSave._id)
        if (idx===-1) return Promise.reject(' Sub-task not found')
        todoToSave.subTasks[idx] = subTaskToSave
    } else {    
        // CREATE
        subTaskToSave._id = _makeId()
        subTaskToSave.isDone = false
        subTaskToSave.subTasks = []
        todoToSave.subTasks.unshift(subTaskToSave)
    }
    return _saveTodosToFile().then(() => {return todoToSave})
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
    save
}