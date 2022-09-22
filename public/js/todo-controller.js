'use strict'



function onInit() {
    setListeners();
}

function setListeners() {
    const elDetBox = document.querySelector('.detail-box');
    elDetBox.addEventListener("click", (ev) => {
        ev.stopPropagation();
    });
    const elLoginBox = document.querySelector('.login-box');
    elLoginBox.addEventListener("click", (ev) => {
        ev.stopPropagation();
    });
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
        `<hr><task-item class="${(todo.isDone)? 'done' : ''}" onclick = "onOpenDetails(event, '${todo._id}')">
        <button class="check-box" onclick = "onToggleTodo(event, '${todo._id}')"></button>
        ${todo.title}
        <button onclick=" onRemoveTodo(event, '${todo._id}')">x</button>
        </task-item>`
        );
    document.querySelector('todo-list').innerHTML = strHTMLs.join('');
}

function onToggleTodo(ev, todoId) {
    ev.stopPropagation();
    console.log('toggling', todoId);
    toggleTodo(todoId);
    const todo =loadTodo(todoId);
    updateTodo(todo);
    document.querySelector('task-container').classList.toggle("done");
    renderTodos();
    renderActive();
}

function onAddTodo() {
    const elTitle = document.querySelector('input[name=todoTitle]');
    const elTxt = document.querySelector('input[name=todoTxt]');
    const elPrio = document.querySelector('.prio')
    const elDate = document.querySelector('input[name=todoDate]');
    const title = elTitle.value;
    const txt = elTxt.value;
    const prio = elPrio.value;
    var date = elDate.value;
    if (!elDate.value) date = "No Date"
    if (!title) return;
    addTodo(title, txt, prio, date);
    elTitle.value = '';
    elTxt.value = '';
    renderTodos();
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
    gCurrTodo = todo._id;
    const elModal = document.querySelector('.detail-modal');
    const elPrio = document.querySelector('sub-all');
    const elProject = document.querySelector('task-project');
    const elDate = document.querySelector('task-date');
    renderDetTask(todo);
    const subAllNum = getAllSubs();
    //const subActiveNum = getActiveSubs();
    if (subAllNum) renderSubs();
    elPrio.value = todo.prio;
    //elSubActive.innerHTML = subActiveNum;
    elProject.innerText = todo.project;
    elDate.innerText = todo.date;
    renderAllSubs();
    renderActiveSubs();
    elModal.style.display = "unset";
}

function closeDet() {
    const elModal = document.querySelector('.detail-modal');
    elModal.style.display = "none";
}

function openAddBox(ev) {
    if (gIsAddBox) ev.target.innerText = "Add task";
    else ev.target.innerText = "Close box";
    gIsAddBox = !gIsAddBox;
    ev.target.nextElementSibling.classList.toggle("hidden");
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

function openAddSub(ev) {
    if (gIsAddsub) ev.target.innerText = "Add sub-task";
    else ev.target.innerText = "Cancel";
    gIsAddsub = !gIsAddsub;
    ev.target.nextElementSibling.classList.toggle("hidden");
}

function onAddSub(ev) {
    console.dir(ev.target);
    const elTitle = document.querySelector('input[name=subTitle]');
    const elTxt = document.querySelector('input[name=subTxt]');
    const elPrio = document.querySelector('.prio')
    const elDate = document.querySelector('input[name=subDate]');
    const title = elTitle.value;
    const txt = elTxt.value;
    const prio = elPrio.value;
    const date = elDate.value;
    console.log(date)
    if (!title) return;
    addSub(title, txt, prio, date);
    elTitle.value = '';
    elTxt.value = '';
    renderTodos();
    renderAllSubs();
    renderActiveSubs();
}

function renderAllSubs() {
    const all = getAllSubs();
    document.querySelector('sub-all').innerText = all;
}

function renderActiveSubs() {
    const active = getActiveSubs();
    document.querySelector('sub-active').innerText = active;
}

function updatePrio() {
    const todoToUpdate =loadTodo(gCurrTodo);
    todoToUpdate.prio = document.querySelector(".det-prio").value;
    updateTodo(todoToUpdate);
}

function openEditBox() {
    const elTask = document.querySelector('task-container');
    const title = document.querySelector("task-title").innerText;
    const txt = document.querySelector("task-desc").innerText;
    const taskStr = `<button class="check-box" disabled)"></button>
    <task>
        <input type="text" name="editTitle" placeholder="Title" value=${title}>
        <br>
        <input type="text" name="editTxt" placeholder="Description" value=${txt}>
    </task>
    <br>
    <edit-buttons>
    <button class="cancel-edit" onclick="cancelEdit()")">Cancel</button>
    <button class="save-edit" onclick="saveEdit()")">Save</button>
    </edit-buttons>`;
    elTask.innerHTML = taskStr;
}

function renderDetTask(todo) {
    const elTask = document.querySelector('task-container');
    const taskStr = `<button class="check-box" onclick = "onToggleTodo(event, '${todo._id}')"></button>
    <task onclick="openEditBox()">
        <task-title>${todo.title}</task-title>
        <br>
        <task-desc>${todo.txt}</task-desc>
    </task>`;
    elTask.innerHTML = taskStr;
    if (todo.isDone) elTask.classList.add("done");
    else elTask.classList.remove("done");
}

function cancelEdit() {
    const todo =loadTodo(gCurrTodo);
    renderDetTask(todo);
}

function saveEdit() {
    const title = document.querySelector('input[name=editTitle]').value;
    const txt = document.querySelector('input[name=editTxt]').value;
    const todo =loadTodo(gCurrTodo);
    if (todo.title === title && todo.txt === txt) return renderDetTask(todo);
    todo.title = title;
    todo.txt = txt;
    updateTodo(todo);
    renderDetTask(todo);
    renderTodos();
}