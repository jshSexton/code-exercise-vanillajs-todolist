import '../styles/index.scss';

function onFormSubmit(event) {
    event.preventDefault();
    let taskInput = document.getElementById('taskInput');
    console.log('taskInput', taskInput.value);
}

function init() {
    let taskForm = document.getElementById('taskForm');
    taskForm.onsubmit = onFormSubmit;
}

window.onload = init;