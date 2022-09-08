
const gUsers = require('../data/user.json')
const Fs = require('fs')
const { time } = require('console')

function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function checkLogin(username, password) {
    const user = gUsers.find(user => user.username === username && user.password === password)
    if (!user) return Promise.reject('Invalid credentials')
    user = {...user}
    delete user.password
    return Promise.resolve(user)
}

function create( fullname, username, password) {
    const userToSave = {
        _id: _makeId(),
        fullname,
        username,
        password,
        isAdmin: false
    }
    _saveUsersToFile()
    return Promise.resolve(userToSave)
}

function update(userToUpdate) {
    const idx = gUsers.findIndex(user => user._id === userToUpdate._id)
    gUsers[idx] = userToUpdate
    _saveUsersToFile()
    return Promise.resolve(userToUpdate)
}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        Fs.writeFile('data/user.json', JSON.stringify(gUsers), (err) => {
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
    checkLogin,
    getById,
    create,
    update
}