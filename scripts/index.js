import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"

const appSettings = {
    databaseURL: "https://chorefy-7904a-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
export const database = getDatabase(app);
export const taskInDB = ref(database, "task");

const taskListEl = document.querySelector(".tasks-list");


function renderTask(icon, description, deadline) {
    const iconEl = document.createElement("div");
    iconEl.classList.add("task-icon");
    iconEl.innerHTML = `
    <i class="${icon}"></i>
    `;

    const descriptionEl = document.createElement("div");
    descriptionEl.classList.add("task-description");
    descriptionEl.innerHTML = description;

    const deadlineEl = document.createElement("div");
    deadlineEl.classList("task-deadline");
    deadlineEl.innerHTML = deadline;



}

onValue(taskInDB, function (snapshot) {
    // console.log(snapshot.val());
});