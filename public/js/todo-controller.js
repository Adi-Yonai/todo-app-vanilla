'use strict'



function onInit() {
    sendReq("GET","api/todo")
    .then( res => {
        gTodos = JSON.parse(res);
        renderTodos();
        renderActive();
        renderAll();
        setListeners();
    })
}

function setListeners() {
    const elDetBox = document.querySelector('.detail-box');
    elDetBox.addEventListener("click", (ev) => {
        ev.stopPropagation();
    })
}

function onRemoveTodo(ev, todoId) {
    ev.stopPropagation();
    console.log('Removing Todo', todoId);
    removeTodo(todoId);
    renderTodos();
    renderActive();
    renderAll();
}

function renderTodos() {
    const todos = getTodosForDisplay();
    const strHTMLs = todos.map(todo =>  
        `<li class="${(todo.isDone)? 'done' : ''}" onclick = "onOpenDetails(event, '${todo._id}')">
        <button class="check-box" onclick = "onToggleTodo(event, '${todo._id}')"></button>
        ${todo.title}
        <button onclick=" onRemoveTodo(event, '${todo._id}')">x</button>
        </li>`
        );
    document.querySelector('.todo-list').innerHTML = strHTMLs.join('');
}

function onToggleTodo(ev, todoId) {
    ev.stopPropagation();
    console.log('toggling', todoId);
    toggleTodo(todoId);
    renderTodos();
    renderActive();
}

function onAddTodo() {
    const elTitle = document.querySelector('input[name=todoTitle]');
    const elTxt = document.querySelector('input[name=todoTxt]');
    const elPrio = document.querySelector('.prio')
    const title = elTitle.value;
    const txt = elTxt.value;
    const prio = elPrio.value;
    if (!title) return;
    addTodo(title, txt, prio);
    elTitle.value = '';
    elTxt.value = '';
    renderTodos();
    renderActive();
    renderAll();
}

function onSetFilter(filterBy) {
    console.log('Filtering by', filterBy);
    setFilter(filterBy);
    renderTodos();
}

function renderAll() {
    const all = getAll();
    document.querySelector('all').innerText = all;
}

function renderActive() {
    const active = getActive();
    document.querySelector('active').innerText = active;
}

function onOpenDetails(ev, todoId) {
    ev.stopPropagation();
    const todo =loadTodo(todoId);
    openDetails(todo);
}

function openDetails(todo) {
    console.log(todo);
    const elModal = document.querySelector('.modal');
    const elDetBox = document.querySelector('.detail-box');
    const str =  `Title: ${todo.title}\n Description: ${todo.txt}\nPriority: ${todo.prio}\n${(todo.isDone)? 'Done': 'Active'}`;
    elDetBox.innerText = str;
    elModal.style.display = "unset";
}

function closeModal() {
    const elModal = document.querySelector('.modal');
    elModal.style.display = "none";
}

function openAddBox(ev) {
    const elBox = document.querySelector('.add-task');
    if (gIsAddBox) ev.target.innerText = "Add task";
    else ev.target.innerText = "Close box";
    gIsAddBox = !gIsAddBox;
    elBox.classList.toggle("hidden");
}