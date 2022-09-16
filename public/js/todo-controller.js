'use strict'



function onInit() {
    setListeners();
}

function setListeners() {
    const elDetBox = document.querySelector('.detail-box');
    elDetBox.addEventListener("click", (ev) => {
        ev.stopPropagation();
    })
    const elLoginBox = document.querySelector('.login-box');
    elLoginBox.addEventListener("click", (ev) => {
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
    const elModal = document.querySelector('.detail-modal');
    const elDetBox = document.querySelector('.details');
    const str =  `Title: ${todo.title}\n Description: ${todo.txt}\nPriority: ${todo.prio}\n${(todo.isDone)? 'Done': 'Active'}`;
    elDetBox.innerText = str;
    elModal.style.display = "unset";
}

function closeDet() {
    const elModal = document.querySelector('.detail-modal');
    elModal.style.display = "none";
}

function openAddBox(ev) {
    const elBox = document.querySelector('.add-task');
    if (gIsAddBox) ev.target.innerText = "Add task";
    else ev.target.innerText = "Close box";
    gIsAddBox = !gIsAddBox;
    elBox.classList.toggle("hidden");
}

function openLoginBox() {
    const elModal = document.querySelector('.login-modal');
    elModal.style.display = "unset";
}

function closeLogin() {
    const elModal = document.querySelector('.login-modal');
    elModal.style.display = "none";
}

function onLogin() {
    const elUser = document.querySelector('input[name=username]');
    const elpass = document.querySelector('input[name=password]');
    const username = elUser.value;
    const password = elpass.value;
    if (!username || !password) return;
    Promise.resolve(logUserIn(username, password))
        .then(user => {
        const loggedInUser = JSON.parse(user);
        const elUserOpt = document.querySelector('.user-options');
        const elBtn = document.querySelector('.login-box-button');
        elUserOpt.innerText = loggedInUser.username;
        elUserOpt.classList.remove('hidden');
        elBtn.classList.add('hidden');
        closeLogin();
        elUser.value = '';
        elpass.value = '';
        loadTodos()
        .then( res => {
            gTodos = JSON.parse(res);
            renderTodos();
            renderActive();
            renderAll();
        })
    })
}

function openUpdate()