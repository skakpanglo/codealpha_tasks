// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Set default theme if none is found
let savedTheme = localStorage.getItem('savedTheme') || 'light';
changeTheme(savedTheme);

// Functions

function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value.trim() === '') {
        alert("You must write something!");
        return;
    }

    // Create toDo DIV
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // Save to local storage
    savelocal(toDoInput.value);

    // Check button
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    // Delete button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Edit button
    const edited = document.createElement('button');
    edited.innerHTML = '<i class="fas fa-edit"></i>';
    edited.classList.add('edit-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(edited);

    // Append to list
    toDoList.appendChild(toDoDiv);

    // Clear input field
    toDoInput.value = '';
}

function deletecheck(event) {
    const item = event.target;

    if (item.classList.contains('delete-btn')) {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener('transitionend', () => item.parentElement.remove());
    }

    if (item.classList.contains('check-btn')) {
        item.parentElement.classList.toggle("completed");
    }

    if (item.classList.contains('edit-btn')) {
        const toDoDiv = item.parentElement;
        const todoText = toDoDiv.querySelector('.todo-item');
        const newText = prompt("Edit your task:", todoText.innerText);

        if (newText && newText.trim() !== '') {
            todoText.innerText = newText;
            updateLocalTodos(toDoDiv, newText);
        }
    }
}

// Local storage functions
function savelocal(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    todos.forEach(todo => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        const edited = document.createElement('button');
        edited.innerHTML = '<i class="fas fa-edit"></i>';
        edited.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(edited);

        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.indexOf(todo.children[0].innerText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodos(todoDiv, newText) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.indexOf(todoDiv.querySelector('.todo-item').innerText);
    if (todoIndex !== -1) {
        todos[todoIndex] = newText;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

    document.body.className = color;

    const title = document.getElementById('title');
    if (title) {
        title.classList.toggle('darker-title', color === 'darker');
    }

    const input = document.querySelector('.todo-input');
    if (input) {
        input.className = `todo-input ${color}-input`;
    }

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${color}-todo${todo.classList.contains('completed') ? ' completed' : ''}`;
    });

    document.querySelectorAll('.check-btn, .delete-btn, .edit-btn, .todo-btn').forEach(button => {
        button.className = button.className.split(' ')[0] + ` ${color}-button`;
    });
}
