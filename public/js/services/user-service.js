'use strict'

function logUserIn(username, password) {
    const user = {
        username,
        password
    }
    return sendReq("POST",'api/login/', JSON.stringify(user))
}