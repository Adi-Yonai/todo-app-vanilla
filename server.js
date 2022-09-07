const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const port = 3000
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

app.get('/api/todo', (req, res) => {
    var visitCount = req.cookies.visitCount || 0
    visitCount++
    res.cookie('visitCount', visitCount, {maxAge: 60*60*1000})
    todoService.query()
    .then(todos => {
            res.send(todos)
        })
})



app.post('/api/todo/', (req, res) => {
    console.log('Backend saving your Todo')
    const todo = req.body
    todoService.create(todo)
        .then((savedTodo) => {
            res.send(savedTodo)
        })
})

app.put('/api/todo/:todoId', (req, res) => {
    console.log('Backend updating your Todo')
    const todo = req.body
    todoService.update(todo)
        .then((savedTodo) => {
            res.send(savedTodo)
        })
})

app.get('/api/todo/:todoId', (req, res) => {
    console.log('Backend getting your Todo:', req.params.todoId)
    todoService.getById(req.params.todoId)
        .then(todo => {
            res.send(todo)
        })
})

app.delete('/api/todo/:todoId/', (req, res) => {
    todoService.remove(req.params.todoId)
        .then(res.send({msg: 'Task removed successfully'}))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})