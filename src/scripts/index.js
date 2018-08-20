import '../styles/index.scss';

function init() {
    let todoList = new TodoController;
}

window.onload = init;

//---------------------------------------------PretendApiServer---------------------------------------------
class PretendApiServer {
    // This whole class is just pretending to be an api.
    // Full implementation would not have this as the service would actually call an api
    constructor() {
        // Pretend server data
        this.dummyTaskData = [
            {
                id: 1,
                description: 'Learn more about React',
                isFinished: false
            },
            {
                id: 2,
                description: 'Go out with my colleges',
                isFinished: false
            },
            {
                id: 3,
                description: 'Buy toothpaste',
                isFinished: false
            },
            {
                id: 4,
                description: 'Visit New York',
                isFinished: true
            },
        ];
    }

    //--------------- Public Functions ---------------
    getTaskData() {
        // Return data from the server
        let dataClone = [];             //Don't want a shallow reference to data so clone it
        this.dummyTaskData.forEach(dataItem => {
            dataClone.push(Object.assign({}, dataItem));
        });
        return {
            todoTasks: dataClone,
            errors: []
        };
    }

    addNewTask(newTaskDescription) {
        let returnData = {
            errors: []
        };
        let newTask = {
            id: (this.dummyTaskData.length + 1),
            description: newTaskDescription,
            isFinished: false
        };
        this.dummyTaskData.push(newTask);

        let dataClone = [];             //Don't want a shallow reference to data so clone it
        this.dummyTaskData.forEach(dataItem => {
            dataClone.push(Object.assign({}, dataItem));
        });
        returnData.todoTasks = dataClone;

        return returnData;
    }

    updateTask(taskId, newDescription, newFinishedState) {
        let returnData = {
            errors: []
        };
        let taskItem = this.dummyTaskData.find(task => task.id === taskId);
        if (taskItem) {
            if (newDescription !== null) {
                if (typeof newDescription === 'string') {
                    taskItem.description = newDescription;
                }
                else {
                    returnData.errors.push('UpdateError 002: Bad data entry for task description');
                }
            }
            if (newFinishedState !== null) {
                if (typeof newFinishedState === 'boolean') {
                    taskItem.isFinished = newFinishedState;
                }
                else {
                    returnData.errors.push('UpdateError 003: Bad data entry for task finish state');
                }
            }
        }
        else {
            returnData.errors.push('UpdateError 001: No item found with id ' + taskId);
        }

        let dataClone = [];             //Don't want a shallow reference to data so clone it
        this.dummyTaskData.forEach(dataItem => {
            dataClone.push(Object.assign({}, dataItem));
        });
        returnData.todoTasks = dataClone;
        return returnData;
    }

    removeTask(taskId) {
        let returnData = {
            errors: []
        };
        let taskItemIndex = this.dummyTaskData.findIndex(task => task.id === taskId);
        if (taskItemIndex > -1) {
            this.dummyTaskData.splice(taskItemIndex, 1);
        }
        else {
            returnData.errors.push('DeleteError 001: No item found with id ' + taskId);
        }

        let dataClone = [];             //Don't want a shallow reference to data so clone it
        this.dummyTaskData.forEach(dataItem => {
            dataClone.push(Object.assign({}, dataItem));
        });
        returnData.todoTasks = dataClone;
        return returnData;
    }
}

//---------------------------------------------TodoService---------------------------------------------
class TodoService {
    // Service class to handle all api requests to the server
    // Methods here should be replaced with promises to better handle async
    constructor() {
        this.api = new PretendApiServer();
    }

    //--------------- Public Functions ---------------

    // Service to get all the to-do tasks
    getList() {
        let apiResponse = this.api.getTaskData();
        if (apiResponse.errors.length > 0) {
            apiResponse.errors.forEach(error => {
                //Replace this with proper error logging and messaging to user
                console.log(error);
            });
            return {
                actionSuccess: false,
                todoTasks: []
            };
        }
        else {
            return {
                actionSuccess: true,
                todoTasks: apiResponse.todoTasks
            };
        }
    }

    // Service to add a new to-do task
    addNewTask(description) {
        let apiResponse = this.api.addNewTask(description);
        if (apiResponse.errors.length > 0) {
            apiResponse.errors.forEach(error => {
                //Replace this with proper error logging and messaging to user
                console.log(error);
            });
            return {
                actionSuccess: false,
                todoTasks: apiResponse.todoTasks
            };
        }
        else {
            return {
                actionSuccess: true,
                todoTasks: apiResponse.todoTasks
            };
        }
    }

    // Service to update a current to-do task
    updateTask(taskId, nDescription, nFinished) {
        let apiResponse = this.api.updateTask(taskId, nDescription, nFinished);
        if (apiResponse.errors.length > 0) {
            apiResponse.errors.forEach(error => {
                //Replace this with proper error logging and messaging to user
                console.log(error);
            });
            return {
                actionSuccess: false,
                todoTasks: apiResponse.todoTasks
            };
        }
        else {
            return {
                actionSuccess: true,
                todoTasks: apiResponse.todoTasks
            };
        }
    }

    // Service to remove a current to-do task
    removeTask(taskId) {
        let apiResponse = this.api.removeTask(taskId);
        if (apiResponse.errors.length > 0) {
            apiResponse.errors.forEach(error => {
                //Replace this with proper error logging and messaging to user
                console.log(error);
            });
            return {
                actionSuccess: false,
                todoTasks: apiResponse.todoTasks
            };
        }
        else {
            return {
                actionSuccess: true,
                todoTasks: apiResponse.todoTasks
            };
        }
    }
}

//---------------------------------------------TodoTaskItem---------------------------------------------
class TodoTaskItem {
    constructor(taskData) {
        this.taskData = taskData;
        this.taskElement = this.buildHtml();
    }

    //--------------- Public Functions ---------------

    // Getter for the task data
    get data() {
        return this.taskData;
    }

    // Setter to change finish state
    set finished(nFinished) {
        if (typeof nFinished === 'boolean') {
            this.taskData.isFinished = nFinished;
            // Ensure element exists and update it
            if (this.taskElement) {
                this.taskElement.className = 'todoTaskContainer';
                if (this.taskData.isFinished) {
                    this.taskElement.className += ' finished-task';
                }

                // Ensure the checkCircle exists and update it
                if (this.taskElement.checkCircle) {
                    this.taskElement.checkCircle.className = 'fa-li fa';
                    this.taskElement.checkCircle.className += (this.taskData.isFinished) ? ' fa-check-circle-o' : " fa-circle-o";
                }
            }
        }
    }

    set description(nDescription) {
        if (typeof nDescription === 'string') {
            this.taskData.description = nDescription;
            if (this.taskElement && this.taskElement.taskLabel) {
                this.taskElement.taskLabel.textContent = this.taskData.description;
            }
        }
    }

    // Getter for the html element
    get taskHtml() {
        return this.taskElement;
    }

    //--------------- Private Functions ---------------

    buildHtml() {
        // Setup container for task item
        let taskElement = document.createElement('li');
        taskElement.className = 'todoTaskContainer';
        if (this.taskData.isFinished) {
            taskElement.className += ' finished-task';
        }
        taskElement.id = 'task_' + this.taskData.id + '_container';

        // Setup alternate dot for the li
        let checkCircle = document.createElement('i');
        checkCircle.className = 'fa-li fa';
        checkCircle.className += (this.taskData.isFinished) ? ' fa-check-circle-o' : " fa-circle-o";
        checkCircle.id = 'task_' + this.taskData.id + '_checkIcon';
        taskElement.appendChild(checkCircle);
        taskElement.checkCircle = checkCircle;

        // Setup text for the li
        let taskLabel = document.createElement('span');
        taskLabel.className = 'taskLabel';
        taskLabel.textContent = this.taskData.description;
        taskLabel.id = 'task_' + this.taskData.id + '_label';
        taskElement.appendChild(taskLabel);
        taskElement.taskLabel = taskLabel;

        // Setup for remove button
        let removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn fa fa-close';
        removeBtn.id = 'task_' + this.taskData.id + '_label';
        taskElement.appendChild(removeBtn);
        taskElement.removeBtn = removeBtn;

        // ----Setup EventListeners----
        // --Click Events--
        taskElement.checkCircle.addEventListener('click', () => {
            this.onTaskClick(this);
        });
        taskElement.taskLabel.addEventListener('click', () => {
            this.onTaskClick(this);
        });
        taskElement.removeBtn.addEventListener('click', () => {
            this.onRemoveClick(this);
        });

        // --Mouse Enter Events--
        taskElement.checkCircle.addEventListener('mouseenter', () => {
            this.onTaskHoverEnter(this);
        });
        taskElement.taskLabel.addEventListener('mouseenter', () => {
            this.onTaskHoverEnter(this);
        });
        taskElement.removeBtn.addEventListener('mouseenter', () => {
            this.onRemoveHoverEnter(this);
        });

        // --Mouse Leave Events--
        taskElement.checkCircle.addEventListener('mouseleave', () => {
            this.onTaskHoverLeave(this);
        });
        taskElement.taskLabel.addEventListener('mouseleave', () => {
            this.onTaskHoverLeave(this);
        });
        taskElement.removeBtn.addEventListener('mouseleave', () => {
            this.onRemoveHoverLeave(this);
        });

        return taskElement;
    }

    // Let parent know there was a click to finish or unfinish this task
    onTaskClick(this_ref) {
        this_ref.taskElement.dispatchEvent(
            new CustomEvent('task_click', {detail: {clickToFinish: !this_ref.taskData.isFinished}})
        );
    }

    // Let parent know there was a click to remove this task
    onRemoveClick(this_ref) {
        this_ref.taskElement.dispatchEvent(new Event('remove_click'));
    }

    // Mouse has entered hovering over the task, update styling
    onTaskHoverEnter(this_ref) {
        if (this_ref.taskData.isFinished) return;    // finish styling takes priority
        this_ref.taskElement.className += ' accent-color-hover';
    }

    // Mouse has left hovering over the task, update styling
    onTaskHoverLeave(this_ref) {
        if (this_ref.taskData.isFinished) return;    // finish styling takes priority
        this_ref.taskElement.className = this_ref.taskElement.className.replace(' accent-color-hover', '');
    }

    // Mouse has entered hovering over the remove button, update styling
    onRemoveHoverEnter(this_ref) {
        if (this_ref.taskData.isFinished) return;    // finish styling takes priority
        this_ref.taskElement.className += ' warn-color-hover';
    }

    // Mouse has left hovering over the remove button, update styleing
    onRemoveHoverLeave(this_ref) {
        if (this_ref.taskData.isFinished) return;    // finish styling takes priority
        this_ref.taskElement.className = this_ref.taskElement.className.replace(' warn-color-hover', '');
    }
}

//---------------------------------------------TodoTaskCreation---------------------------------------------
class TodoTaskCreation {
    constructor(taskForm) {
        this.taskForm = taskForm;

        // ----Setup Event Listeners----
        this.taskForm.addEventListener('submit', () => {
            this.onFormSubmit(this);
        });
    }

    //--------------- Public Functions ---------------

    // Getter for taskForm
    get form() {
        return this.taskForm;
    }

    //--------------- Private Functions ---------------

    onFormSubmit(this_ref) {
        event.preventDefault();
        this_ref.taskForm.dispatchEvent(
            new CustomEvent('creator_new_task_entered', {
                detail: {
                    nTaskDescription: document.getElementById('taskInput').value
                }
            })
        );
        this_ref.taskForm.reset();
    }
}

//---------------------------------------------TodoTaskList---------------------------------------------
class TodoTaskList {
    constructor(todoListContainer) {
        this.todoListContainer = todoListContainer;
        this.todoTasks = [];
    }

    //--------------- Public Functions ---------------

    // Getter for the container
    get listContainer() {
        return this.todoListContainer;
    }

    // Getter for the shown tasks
    get taskList() {
        return this.todoTasks;
    }

    // Controls the displayed list of task items
    updateList(tasksData) {
        // Remove old tasks not being displayed anymore
        let tasksToRemove = this.todoTasks.filter(task => {
            return !tasksData.some(dataItem => {
                return task.data.id === dataItem.id;
            });
        });
        tasksToRemove.forEach(taskToRemove => {
            if (this.todoListContainer.contains(taskToRemove.taskHtml)) {
                this.todoListContainer.removeChild(taskToRemove.taskHtml);
            }
            let taskIndex = this.todoTasks.findIndex(task => taskToRemove.data.id === task.data.id);
            this.todoTasks.splice(taskIndex, 1);
        });

        // Update or add tasks being displayed now
        tasksData.forEach(dataItem => {
            let todoTask = this.todoTasks.find(task => task.data.id === dataItem.id);
            if (todoTask) {
                // Found existing task just update if needed
                if (todoTask.data.description !== dataItem.description) {
                    todoTask.description = dataItem.description;
                }
                if (todoTask.data.isFinished !== dataItem.isFinished) {
                    todoTask.finished = dataItem.isFinished;
                }
            }
            else {
                // New task insert into the list
                let newTask = new TodoTaskItem(dataItem);
                this.todoTasks.push(newTask);
                let newTaskHtml = newTask.taskHtml;

                // ----Setup EventListeners----
                newTaskHtml.addEventListener('task_click', event => {
                    this.onTaskFinishClick(this, newTask, event);
                });
                newTaskHtml.addEventListener('remove_click', event => {
                    this.onTaskRemoveClick(this, newTask);
                });

                this.todoListContainer.appendChild(newTaskHtml);
            }
        });
    }

    //--------------- Private Functions ---------------

    // Got an event from a task to finish or unfinish a task, let controller know to do an service call
    onTaskFinishClick(this_ref, taskItem, event) {
        this_ref.todoListContainer.dispatchEvent(
            new CustomEvent('list_task_finish_click', {
                detail: {
                    taskId: taskItem.data.id,
                    nFinishState: event.detail.clickToFinish,
                }
            })
        );
    }

    // Got an event from a task to remove a task, let controller know to do an service call
    onTaskRemoveClick(this_ref, taskItem) {
        this_ref.todoListContainer.dispatchEvent(
            new CustomEvent('list_task_remove_click', {
                detail: {
                    taskId: taskItem.data.id,
                }
            })
        );
    }
}

//---------------------------------------------TodoTaskFilters---------------------------------------------
class TodoTaskFilters {
    constructor(filterContainer) {
        this.filterContainer = filterContainer;
        this.filterOptions = {
            allMode: 'allFilter',
            todoMode: 'todoFilter',
            doneMode: 'doneFilter'
        };
        this.doneCounts = {
            total: 0,
            done: 0
        };

        this.buildFilterButtons();
        this.updateFilterState(this.filterOptions.allMode);
    }

    //--------------- Public Functions ---------------

    // Getter for the filter options
    get modes() {
        return this.filterOptions;
    }

    updateCounts(nTotal, nDone) {
        if (typeof nTotal === 'number' && typeof nDone === 'number' && nTotal > nDone) {
            this.doneCounts.done = nDone;
            this.doneCounts.total = nTotal;
        }

        this.updateBtnLabels();
    }

    //--------------- Private Functions ---------------
    buildFilterButtons() {
        // Containing span
        let filterSpan = document.createElement('span');
        filterSpan.textContent = 'Filter: ';

        // filter button for showing all
        let allBtn = document.createElement('button');
        allBtn.id = 'all_filter_btn';
        allBtn.value = this.filterOptions.allMode;
        allBtn.textContent = 'all';
        filterSpan.allBtn = allBtn;

        // filter button for showing to do
        let todoBtn = document.createElement('button');
        todoBtn.id = 'todo_filter_btn';
        todoBtn.value = this.filterOptions.todoMode;
        todoBtn.textContent = 'to do';
        filterSpan.todoBtn = todoBtn;

        // filter button for showing done
        let doneBtn = document.createElement('button');
        doneBtn.id = 'done_filter_btn';
        doneBtn.value = this.filterOptions.doneMode;
        doneBtn.textContent = 'done';
        filterSpan.doneBtn = doneBtn;

        // text node to separate buttons
        let pipeNode = document.createTextNode(' | ');

        // ----Setup EventListeners----
        filterSpan.allBtn.addEventListener('click', event => this.onFilterClick(this, event));
        filterSpan.todoBtn.addEventListener('click', event => this.onFilterClick(this, event));
        filterSpan.doneBtn.addEventListener('click', event => this.onFilterClick(this, event));

        //append elements in order to containing span
        filterSpan.appendChild(allBtn);
        filterSpan.appendChild(pipeNode);
        filterSpan.appendChild(todoBtn);
        filterSpan.appendChild(pipeNode.cloneNode(true));
        filterSpan.appendChild(doneBtn);

        //append span to container
        this.filterContainer.filterSpan = filterSpan;
        this.filterContainer.appendChild(filterSpan);
    }

    updateFilterState(nState) {
        this.filterMode = nState;

        // Reset all button states
        this.filterContainer.filterSpan.allBtn.className = '';
        this.filterContainer.filterSpan.todoBtn.className = '';
        this.filterContainer.filterSpan.doneBtn.className = '';

        // Change css for the selected button
        switch (this.filterMode) {
            case this.filterOptions.allMode:
                this.filterContainer.filterSpan.allBtn.className = 'selected-filter';
                break;
            case this.filterOptions.todoMode:
                this.filterContainer.filterSpan.todoBtn.className = 'selected-filter';
                break;
            case this.filterOptions.doneMode:
                this.filterContainer.filterSpan.doneBtn.className = 'selected-filter';
                break;
        }
    }

    updateBtnLabels() {
        this.filterContainer.filterSpan.allBtn.textContent = 'all (' + this.doneCounts.total + ')';
        this.filterContainer.filterSpan.todoBtn.textContent = 'to do (' + (this.doneCounts.total - this.doneCounts.done) + ')';
        this.filterContainer.filterSpan.doneBtn.textContent = 'done (' + this.doneCounts.done + ')';
    }

    onFilterClick(this_ref, event) {
        this_ref.updateFilterState(event.target.value);
        this_ref.filterContainer.dispatchEvent(
            new CustomEvent('filter_mode_change', {
                detail: {
                    nFilterMode: event.target.value,
                }
            })
        );
    }
}

//---------------------------------------------TodoController---------------------------------------------
class TodoController {
    constructor() {
        // init data and setup class instances
        this.todoService = new TodoService();
        this.todoCreator = new TodoTaskCreation(document.getElementById('taskForm'));
        this.todoTaskList = new TodoTaskList(document.getElementById('taskListContainer'));
        this.todoFilters = new TodoTaskFilters(document.getElementById('filterContainer'));

        this.initialLoad();
    }

    //--------------- Public Functions ---------------

    //--------------- Private Functions ---------------
    initialLoad() {
        // serviceResponse should be a promise
        let serviceResponse = this.todoService.getList();
        if (!serviceResponse.actionSuccess) {
            // Error handling section
            console.log('Error: todoService getList error');
        }

        this.todoData = serviceResponse.todoTasks;
        this.todoTaskList.updateList(this.todoData);

        // ----Setup Event Listeners----

        // --TodoTaskList Events--
        this.todoTaskList.listContainer.addEventListener('list_task_finish_click', (event) => {
            this.onListItemFinishClick(this, event.detail.taskId, event.detail.nFinishState);
        });
        this.todoTaskList.listContainer.addEventListener('list_task_remove_click', (event) => {
            this.onListItemRemoveClick(this, event.detail.taskId);
        });

        // --TodoCreator Events
        this.todoCreator.taskForm.addEventListener('creator_new_task_entered', (event) => {
            this.onCreatorAddTask(this, event.detail.nTaskDescription);
        });

        // --TodoFilter Events
        this.todoFilters.filterContainer.addEventListener('filter_mode_change', (event) => {
            this.onFilterModeChange(this, event.detail.nFilterMode);
        });
    }

    // List reported a finish click, call the service to update the server
    onListItemFinishClick(this_ref, taskId, nFinishState) {
        // serviceResponse should be a promise
        let serviceResponse = this_ref.todoService.updateTask(taskId, null, nFinishState);
        if (!serviceResponse.actionSuccess) {
            // Error handling section
            console.log('Error: todoService updateTask error');
        }

        this.todoData = serviceResponse.todoTasks;
        this.todoTaskList.updateList(this.todoData);
    }

    // List reported a remove click, call service to update the server
    onListItemRemoveClick(this_ref, taskId) {
        // serviceResponse should be a promise
        let serviceResponse = this_ref.todoService.removeTask(taskId);
        if (!serviceResponse.actionSuccess) {
            // Error handling section
            console.log('Error: todoService removeTask error');
        }

        this.todoData = serviceResponse.todoTasks;
        this.todoTaskList.updateList(this.todoData);
    }

    // Creator reported a new task entered, call service to update the server
    onCreatorAddTask(this_ref, nTaskDescription) {
        // serviceResponse should be a promise
        let serviceResponse = this_ref.todoService.addNewTask(nTaskDescription);
        if (!serviceResponse.actionSuccess) {
            // Error handling section
            console.log('Error: todoService addNewTask error');
        }

        this.todoData = serviceResponse.todoTasks;
        this.todoTaskList.updateList(this.todoData);
    }

    // Filter reported change in mode, update list
    onFilterModeChange(this_ref, nFilterMode) {
        switch (nFilterMode) {
            case this_ref.todoFilters.modes.allMode:
                this_ref.todoTaskList.updateList(this.todoData);
                break;
            case this_ref.todoFilters.modes.todoMode:
                this_ref.todoTaskList.updateList(this.todoData.filter(dataItem => dataItem.isFinished === false));
                break;
            case this_ref.todoFilters.modes.doneMode:
                this_ref.todoTaskList.updateList(this.todoData.filter(dataItem => dataItem.isFinished === true));
                break;
            default:
                this_ref.todoTaskList.updateList(this.todoData);
                break;
        }
    }
}