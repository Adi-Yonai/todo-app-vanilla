
const Fs = require('fs')
const gUsers = require('../data/user.json')

function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function checkLogin(username, password) {
    var user = gUsers.find(user => user.username === username && user.password === password)
    if (!user) return Promise.reject('Invalid credentials')
    user = {...user}
    delete user.password
    return Promise.resolve(user)
}

function save( username, password) {
    const userToSave = {
        _id: _makeId(),
        username,
        password,
        isAdmin: false
    }
    gUsers.unshift(userToSave)
    return _saveUsersToFile()
        .then(() => {
            const user = {...userToSave}
            delete user.password
            return user
        })
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
    save
}