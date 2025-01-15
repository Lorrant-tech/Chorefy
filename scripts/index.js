import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const appSettings = {
    databaseURL: "https://chorefy-7904a-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
export const database = getDatabase(app);
export const taskInDB = ref(database, "tasks");

const taskListEl = document.querySelector(".tasks-list");

const checkboxShowDoneEl = document.getElementById("show-done");

checkboxShowDoneEl.addEventListener("change", renderTaskList);

function renderTask(id, icon, description, deadline, status) {
    if (checkboxShowDoneEl.checked === true) {
        createTaskRow(id, icon, description, deadline, status);
    } else if (checkboxShowDoneEl.checked === false && status === "tbd") {
        createTaskRow(id, icon, description, deadline, status);
    }
}

function createTaskRow(id, icon, description, deadline, status) {
    const iconEl = document.createElement("div");
    iconEl.classList.add("task-icon");
    iconEl.id = `icon${id}`
    iconEl.innerHTML = `
    <i class="${icon}"></i>
    `;
    iconEl.addEventListener("click", cutDoneTask);
    if (status === "done") {
        iconEl.classList.add("highlight")
    }

    const descriptionEl = document.createElement("div");
    descriptionEl.classList.add ("task-description");
    descriptionEl.id = `description${id}`
    descriptionEl.innerHTML = description;
    descriptionEl.addEventListener("click", cutDoneTask);

    const deadlineEl = document.createElement("div");
    deadlineEl.classList.add("task-deadline");
    deadlineEl.id = `deadline${id}`
    deadlineEl.innerHTML = deadline;
    deadlineEl.addEventListener("click", cutDoneTask);

    taskListEl.appendChild(iconEl);
    taskListEl.appendChild(descriptionEl);
    taskListEl.appendChild(deadlineEl);
}


async function cutDoneTask() {
    const elementId = this.id;
    const taskId = elementId.slice(elementId.indexOf("-"));

    const localInDB = ref(database, `tasks/${taskId}`)

    const clickedTask = await getTaskInDB(localInDB);

    const rowIconEl = document.getElementById(`icon${taskId}`);

    if (clickedTask.status === "tbd") {
        update(localInDB, {"status": "done"});
        rowIconEl.classList.add("highlight");
    } else {
        update(localInDB, {"status": "tbd"});
        rowIconEl.classList.remove("highlight");
    }
}

export async function getTaskInDB(pathReference) {
    try {
        const responseTask = await get(pathReference);
        if(responseTask.exists()) {
            const clickedTask = responseTask.val();
            return clickedTask;
        } else {
            console.log("Nenhum dado encontrado");
        }
    } catch (error) {
        console.error("Erro ao obter task: ", error)
    }
}

const assignedTasksEl = document.getElementById("assigned-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const remainingTasksEl = document.getElementById("remaining-tasks");

onValue(taskInDB, (snapshot) => {
    const tasksListEntries = Object.entries(snapshot.val());

    taskListEl.innerHTML = `
        <h2>Icon</h2>
        <h2>Tasks</h2>
        <h2>Deadline</h2>
    `;

    let completedTasks = 0;

    for (let i = 0; i < tasksListEntries.length; i++) {
        let currentTask = tasksListEntries[i];

        const currentTaskId = currentTask[0];
        const currentTaskTasks = currentTask[1];

        renderTask(currentTaskId, currentTaskTasks.icon, currentTaskTasks.description, currentTaskTasks.deadline, currentTaskTasks.status);

        if(currentTaskTasks.status === "done") {
            completedTasks++;
        }

        completedTasksEl.innerHTML = completedTasks;
        assignedTasksEl.innerHTML = i + 1;
        remainingTasksEl.innerHTML = (i + 1) - completedTasks;
    }
});


async function renderTaskList() {
    try {
        const snapshot = await get(taskInDB);
        if(snapshot.exists()) {
            const tasksListEntries = Object.entries(snapshot.val());
            
            taskListEl.innerHTML = `
                <h2>Icon</h2>
                <h2>Tasks</h2>
                <h2>Deadline</h2>
            `;

            let completedTasks = 0;

            for (let i = 0; i < tasksListEntries.length; i++) {
                let currentTask = tasksListEntries[i];

                const currentTaskId = currentTask[0];
                const currentTaskTasks = currentTask[1];
                // console.log(currentTaskTasks);

                renderTask(currentTaskId, currentTaskTasks.icon, currentTaskTasks.description, currentTaskTasks.deadline, currentTaskTasks.status);

                if(currentTaskTasks.status === "done") {
                    completedTasks++;
                }

                completedTasksEl.innerHTML = completedTasks;
                assignedTasksEl.innerHTML = i + 1;
                remainingTasksEl.innerHTML = (i + 1) - completedTasks;
            }
        } else {
            console.log("Nenhum dado encontrado");
        }
    } catch (error) {
        console.error("Erro ao obter snapshot: ", error);
    }
}