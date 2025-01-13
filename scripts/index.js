import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"

const appSettings = {
    databaseURL: "https://chorefy-7904a-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
export const database = getDatabase(app);
export const taskInDB = ref(database, "tasks");

const taskListEl = document.querySelector(".tasks-list");


function renderTask(id, icon, description, deadline) {
    const iconEl = document.createElement("div");
    iconEl.classList.add("task-icon");
    iconEl.id = `icon-${id}`
    iconEl.innerHTML = `
    <i class="${icon}"></i>
    `;
    iconEl.addEventListener("click", cutDoneTask)

    const descriptionEl = document.createElement("div");
    descriptionEl.classList.add ("task-description");
    descriptionEl.id = `description-${id}`
    descriptionEl.innerHTML = description;
    descriptionEl.addEventListener("click", cutDoneTask);

    const deadlineEl = document.createElement("div");
    deadlineEl.classList.add("task-deadline");
    deadlineEl.id = `deadline-${id}`
    deadlineEl.innerHTML = deadline;
    deadlineEl.addEventListener("click", cutDoneTask);

    taskListEl.appendChild(iconEl);
    taskListEl.appendChild(descriptionEl);
    taskListEl.appendChild(deadlineEl);
}


function cutDoneTask() {
    const elementId = this.id;
    const taskId = elementId.slice(elementId.indexOf("-"));

    const rowIconEl = document.getElementById(`icon${taskId}`);

    if (rowIconEl.classList.contains("highlight")) {
        rowIconEl.classList.remove("highlight");
    } else {
        rowIconEl.classList.add("highlight");
    }
}

onValue(taskInDB, function (snapshot) {
    const tasksListEntries = Object.entries(snapshot.val());

    for (let i = 0; i < tasksListEntries.length; i++) {
        let currentTask = tasksListEntries[i];

        const currentTaskId = currentTask[0];
        const currentTaskTasks = currentTask[1];
        // console.log(currentTaskTasks);

        renderTask(currentTaskId, currentTaskTasks.icon, currentTaskTasks.description, currentTaskTasks.deadline);
    }
});