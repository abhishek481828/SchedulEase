let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskIndex = null;

if (tasks.length === 0) {
    tasks = [
        { date: "2025-01-07", time: "06:00", task: "Study: Mathematics", priority: "high", category: "study", completed: false },
        { date: "2025-01-07", time: "7:00", task: "Break: Coffee & Rest", priority: "low", category: "personal", completed: false },
        { date: "2025-01-07", time: "8:30", task: "Study: Computer Science", priority: "high", category: "study", completed: false },
        { date: "2025-01-08", time: "9:00", task: "Study: Physics", priority: "high", category: "study", completed: false },
        { date: "2025-01-08", time: "11:30", task: "lunch: Stretch & Hydrate", priority: "low", category: "personal", completed: false },
    ];
    saveToLocalStorage();
}

function saveDarkModePreference(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode);
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    saveDarkModePreference(body.classList.contains('dark-mode'));
}

function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', loadDarkModePreference);

function renderTasks() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';

    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredTasks = selectedCategory ? tasks.filter(task => task.category === selectedCategory) : tasks;

    filteredTasks.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    filteredTasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.classList.add('time-slot');

        const isPastTask = new Date(`${task.date} ${task.time}`) < new Date();

        div.innerHTML = `
            <div class="time">${formatDate(`${task.date} ${task.time}`)}</div>
            <div class="task">${task.task}</div>
            <div class="priority ${task.priority}">${task.priority}</div>
            <div class="actions">
                <button class="btn ${task.completed ? 'btn-completed' : 'btn-primary'}" onclick="toggleTask(${index})" ${isPastTask ? '' : 'disabled'}>
                    ${task.completed ? 'Undo' : (isPastTask ? 'Complete' : 'Disabled')}
                </button>
                <button class="btn btn-primary" onclick="editTask(${index})" ${task.completed ? 'disabled' : ''}>
                    ${task.completed ? 'Disabled' : 'Edit'}
                </button>
                <button class="btn btn-danger" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });

    updateProgressBar();
}

function formatDate(date) {
    const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const month = new Date(date).toLocaleString('en-us', { month: 'short' }).toLowerCase();
    const dateOfMonth = new Date(date).getDate();
    const year = new Date(date).getFullYear();
    const time = new Date(date).toLocaleString('en-us', { hour: 'numeric', minute: 'numeric', hour12: true });

    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return `${capitalizeFirstLetter(dayOfWeek)} - ${capitalizeFirstLetter(month)} ${dateOfMonth} - ${year} | ${time}`;
}

function updateProgressBar() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressBar = document.getElementById('progressBar');
    const totalTasks = tasks.length;
    progressBar.style.width = `${(completedTasks / totalTasks) * 100}%`;
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showModal() {
    document.getElementById('taskModal').style.display = 'flex';

    if (editingTaskIndex !== null) {
        const task = tasks[editingTaskIndex];
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskTime').value = task.time;
        document.getElementById('taskName').value = task.task;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category;
        document.getElementById('taskReminder').value = task.reminder || '';
    }
}

function hideModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function saveTask() {
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;
    const task = document.getElementById('taskName').value;
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;
    const reminder = document.getElementById('taskReminder').value;

    if (editingTaskIndex === null) {
        tasks.push({ date, time, task, priority, category, completed: false, reminder });
    } else {
        tasks[editingTaskIndex] = { date, time, task, priority, category, completed: false, reminder };
        editingTaskIndex = null;
    }

    saveToLocalStorage();
    renderTasks();
    hideModal();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
}

function editTask(index) {
    editingTaskIndex = index;
    showModal();
}

function clearAllTasks() {
    tasks = [];
    saveToLocalStorage();
    renderTasks();
}

function filterTasks() {
    renderTasks();
}

// College TimTab Link Functions
function showCollegeTimTabModal() {
    document.getElementById('collegeTimTabModal').style.display = 'flex';
}

function hideCollegeTimTabModal() {
    document.getElementById('collegeTimTabModal').style.display = 'none';
}

function saveCollegeLink() {
    const link = document.getElementById('collegeLink').value;
    if (link) {
        localStorage.setItem('collegeLink', link);
        alert('Link saved successfully!');
        hideCollegeTimTabModal();
    } else {
        alert('Please enter a valid URL.');
    }
}

function resetCollegeLink() {
    localStorage.removeItem('collegeLink');
    alert('Link has been reset.');
}

renderTasks();