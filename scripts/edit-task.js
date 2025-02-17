import { get, update, ref, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { taskInDB, database, getTaskInDB } from "./index.js";

const editTaskBtnEl = document.getElementById("edit-task");

const editTaskModalEl = document.querySelector(".edit-task-modal");

editTaskBtnEl.addEventListener("click", () => {
    editTaskModalEl.showModal();
    renderEditTaskList();
})

const cancelEditBtnEl = document.getElementById("modal-edit-cancel");

cancelEditBtnEl.addEventListener("click", () => {
    editTaskModalEl.close();
})

const editGridContainerEl = document.querySelector(".edit-grid-container");

async function renderEditTaskList() {
    editGridContainerEl.innerHTML = "";
    try {
        const snapshot = await get(taskInDB);
        if(snapshot.exists()) {
            const tasksListEntries = Object.entries(snapshot.val());
            // console.log(snapshot);
            editGridContainerEl.innerHTML = `
                <h3>Tasks</h3>
                <h3>Deadline</h3>
            `;

            //console.log(tasksListEntries);

            for (let i = 0; i < tasksListEntries.length; i++) {
                let currentTask = tasksListEntries[i];

                const currentTaskId = currentTask[0];
                const currentTaskTasks = currentTask[1];
                // console.log(currentTaskTasks);
                // console.log(currentTaskId);

                renderEditTask(currentTaskId, currentTaskTasks.description, currentTaskTasks.deadline);
            }
        } else {
            console.log("Nenhum dado encontrado");
        }
    } catch (error) {
        console.error("Erro ao obter snapshot: ", error);
    }
}


function renderEditTask(id, description, deadline) {
    const descriptionEl = document.createElement("div");
    descriptionEl.classList.add("edit-task-description")
    descriptionEl.innerHTML = description;
    descriptionEl.id = id;
    descriptionEl.addEventListener("click", (event) => {
        // abrir o modal de edição
        editTaskModalEl.close();
        //console.log(event.target.id);
        prepareEditSelectedTask(event.target.id);
    });
    editGridContainerEl.appendChild(descriptionEl);


    const deadlineEl = document.createElement("div");
    deadlineEl.classList.add("edit-task-deadline")
    deadlineEl.innerHTML = deadline;
    deadlineEl.id = id;
    deadlineEl.addEventListener("click", (event) => {
        // abrir o modal de edição
        editTaskModalEl.close();
        //console.log(event.target.id);
        prepareEditSelectedTask(event.target.id);
    });
    editGridContainerEl.appendChild(deadlineEl);
}

const editSelectedTaskModalEl = document.querySelector(".edit-selected-task-modal");
const editDescription = document.getElementById("edit-modal-description");
const editDeadline = document.getElementById("edit-modal-deadline");
const editIcon = document.getElementById("edit-modal-icon");

async function prepareEditSelectedTask(elementId) {
    editSelectedTaskModalEl.showModal();

    const elementRef = ref(database, `tasks/${elementId}`);
    const elementValues = await getTaskInDB(elementRef);

    editDescription.value = elementValues.description;
    editDeadline.value = elementValues.deadline;
    editIcon.value = elementValues.icon;


    // Add actions to buttons
    // Cancel button
    const cancelButtonEl = document.getElementById("edit-modal-cancel");

    const newCancelButtonEl = cancelButtonEl.cloneNode(true);
    cancelButtonEl.replaceWith(newCancelButtonEl);

    newCancelButtonEl.addEventListener("click", () => {
        editSelectedTaskModalEl.close();
    })

    // Confirm button
    const confirmButtonEl = document.getElementById("edit-modal-confirm");
    const newConfirmButtonEl = confirmButtonEl.cloneNode(true);
    confirmButtonEl.replaceWith(newConfirmButtonEl);

    newConfirmButtonEl.addEventListener("click", () => {
        update(elementRef, {
            "description": editDescription.value,
            "deadline": editDeadline.value,
            "icon": editIcon.value
        })
        editSelectedTaskModalEl.close();
    })

    // Delete button
    const deleteButtonEl = document.getElementById("edit-modal-delete");

    const newDeleteButtonEl = deleteButtonEl.cloneNode(true);
    deleteButtonEl.replaceWith(newDeleteButtonEl);

    newDeleteButtonEl.addEventListener("click", () => {
        remove(elementRef);
        editSelectedTaskModalEl.close();
    })
}