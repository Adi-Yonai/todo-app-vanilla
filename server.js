const express = require('express')
const app = express()
const port = 3000
const todoService = require('./services/todo.service')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

app.get('/api/todo', (req, res) => {
    console.log(`Backend getting your Todos`)
    todoService.query()
        .then(todos => {
            res.send(todos)
        })
})

app.get('/api/todo/save', (req, res) => {
    console.log('Backend saving your Todo')
    todoService.create(req.query.title, req.query.txt, req.query.prio)
        .then(() => res.send({msg: "Task added successfully"}))
})

app.get('/api/todo/update', (req, res) => {
    todoService.update(req.query.title, req.query.txt, req.query.prio, req.query._id, req.query.time, req.query.isDone)
        .then(() => {
            res.send({msg: 'Task updated successfully'})
        })
})

app.get('/api/todo/:todoId', (req, res) => {
    console.log('Backend getting your Todo:', req.params.todoId)
    todoService.getById(req.params.todoId)
        .then(todo => {
            res.send(todo)
        })
})

app.get('/api/todo/:todoId/remove', (req, res) => {
    todoService.remove(req.params.todoId)
        .then(() => {
            res.send({msg: 'Task removed successfully'})
        })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})