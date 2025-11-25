// Stores all tasks for saving in localStorage
let taskData = {};

// Column elements
let todo = document.querySelector('#todo');
let progress = document.querySelector('#Progress');
let done = document.querySelector('#done');

// Will temporarily store the dragged task
let dragElement = null;

// Array of all three columns (used for loops)
const columns = [todo, progress, done];


// ---------------- CREATE A NEW TASK ----------------
function addTask(title, desc, column) {

    // Create task container
    let div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', "true");

    // Task HTML structure
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    // Add task inside selected column
    column.appendChild(div);

    // Enable dragging for the task
    div.addEventListener('dragstart', () => {
        dragElement = div; // store the dragged element
    });

    // Delete task on button click
    div.querySelector('.delete-btn').addEventListener('click', () => {
        div.remove();
        updateCounter(); // update localStorage + task count
    });
}


// ---------------- UPDATE COUNTS + SAVE TO STORAGE ----------------
function updateCounter() {

    // For each column (todo, progress, done)
    columns.forEach(col => {

        // Get all tasks inside that column
        let tasks = col.querySelectorAll('.task');

        // Element that shows task count
        let count = col.querySelector('.right');

        // Save tasks into an object for localStorage
        taskData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector('h2').innerText,
                desc: t.querySelector('p').innerText
            }
        });

        // Update localStorage after changes
        localStorage.setItem('tasks', JSON.stringify(taskData));

        // Update UI counter
        if (count) count.innerText = tasks.length;
    });
}



// ---------------- LOAD SAVED TASKS (ON PAGE REFRESH) ----------------
if (localStorage.getItem('tasks')) {

    // Read saved data
    let data = JSON.parse(localStorage.getItem('tasks'));

    // Add tasks back into each column
    for (let col in data) {
        let column = document.querySelector(`#${col}`);

        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });

        // Update counter for that column
        let tasks = column.querySelectorAll('.task');
        let count = column.querySelector('.right');
        if (count) count.innerText = tasks.length;
    }
}



// ---------------- DRAG & DROP COLUMN EVENTS ----------------
function addDragEventOnColumn(column) {

    // Highlight when task enters column
    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });

    // Remove highlight on leave
    column.addEventListener('dragleave', (e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    });

    // Allow dropping
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Drop the dragged task inside column
    column.addEventListener('drop', (e) => {
        e.preventDefault();

        column.appendChild(dragElement); // move task
        column.classList.remove('hover-over');

        updateCounter(); // save changes
    });
}

// Apply drag events to all columns
addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);



// ---------------- MODAL SECTION (POPUP) ----------------
let toggleModalButton = document.querySelector('#toggle-modal');
let modalBg = document.querySelector('.modal .bg');
let modal = document.querySelector('.modal');
let addTaskButton = document.querySelector('#add-new-task');

// Open/close modal
toggleModalButton.addEventListener('click', () => {
    modal.classList.toggle("active");
});

// Close modal when background is clicked
modalBg.addEventListener('click', () => {
    modal.classList.remove('active');
});



// ---------------- ADD NEW TASK FROM MODAL ----------------
addTaskButton.addEventListener('click', () => {

    // Read input values
    let taskTitleInput = document.querySelector('#task-title-input').value;
    let taskDescInput = document.querySelector('#task-desc-input').value;

    // Create task (always added to TODO first)
    addTask(taskTitleInput, taskDescInput, todo);

    // Save + update counters
    updateCounter();

    // Close modal
    modal.classList.remove('active');

    document.querySelector('#task-title-input').value = '';
    document.querySelector('#task-desc-input').value = '';
});
