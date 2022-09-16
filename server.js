const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const port = 3000
const userService = require('./services/user.service')
const todoService = require('./services/todo.service')
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
    secret: 'some secret token',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

// Login
app.post('/api/login', (req, res) => {
    const { username, password} = req.body
    userService.checkLogin(username, password)
        .then( user => {
            req.session.theUser = user
            res.send(user)
        })
        .catch(err => {
            console.log(`${username} failed to login, reason: ${err}`)
            res.status(401).send('Invalid Login')
        })
})

// Signup
app.post('/api/signup', (req, res) => {
    const { username, password} = req.body
    userService.save(username, password)
        .then( user => {
            req.session.theUser = user
            res.send(user)
        })
        .catch(err => {
            console.log(`${username} failed to login, reason: ${err}`)
            res.status(401).send('Invalid Login')
        })
})

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.end()
    console.log('Logging out')
})

// Todo LIST
app.get('/api/todo', (req, res) => {
    const { theUser} = req.session
    if (!theUser) return res.status(401).send('Please login')
    todoService.query(theUser)
    .then(todos => {
            res.send(todos)
    })
    .catch(err => {
        console.log('Backend had an eror:', err)
        res.status(404).send(err)
    })
})

// Todo CREATE
app.post('/api/todo/', (req, res) => {

    const { theUser} = req.session
    if (!theUser) return res.status(401).send('Please login')
    
    console.log('Backend saving your Todo')
    const {title, txt, prio} = req.body
    const user = {...theUser}
    delete user.isAdmin
    const todo = {
        title,
        txt,
        prio,
        owner: user
    }
    todoService.save(todo, theUser)
        .then((savedTodo) => {
            res.send(savedTodo)
        })
        .catch(err => {
            console.log('Backend had an eror:', err)
            res.status(404).send('Cannot create new todo')
        })
})

// Todo UPDATE
app.put('/api/todo/:todoId', (req, res) => {
    const { theUser} = req.session
    if (!theUser) return res.status(401).send('Please login')

    console.log('Backend updating your Todo')
    const {_id, title, txt, prio, isDone, createdAt} = req.body
    const todo = {
        _id,
        title,
        txt,
        prio,
        isDone,
        createdAt,
        owner: theUser
    }
    todoService.update(todo, theUser)
        .then((savedTodo) => {
            res.send(savedTodo)
        })
        .catch(err => {
            console.log('Backend had an eror:', err)
            res.status(404).send(err)
        })
})

// Todo READ
app.get('/api/todo/:todoId', (req, res) => {
    console.log('Backend getting your Todo:', req.params.todoId)
    const { theUser} = req.session
    if (!theUser) return res.status(401).send('Please login')
    todoService.getById(req.params.todoId, theUser)
        .then(todo => {
            res.send(todo)
        })
        .catch(err => {
            console.log('Backend had an eror:', err)
            res.status(401).send(err)
        })
})

// Todo DELETE
app.delete('/api/todo/:todoId/', (req, res) => {
    const { theUser} = req.session
    if (!theUser) return res.status(401).send('Please login')
    todoService.remove(req.params.todoId, theUser)
        .then(res.send({msg: 'Task removed successfully'}))
        .catch(err => {
            console.log('Backend had an eror:', err)
            res.status(401).send(err)
        })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})