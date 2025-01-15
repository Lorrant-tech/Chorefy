
import { push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"

import { taskInDB } from "./index.js"

const addTaskBtnEl = document.getElementById("add-task");

const addTaskModalEl = document.querySelector(".add-task-modal");

addTaskBtnEl.addEventListener("click", () => {
    addTaskModalEl.showModal();
});

const cancelModalBtnEl = document.getElementById("modal-cancel");

cancelModalBtnEl.addEventListener("click", () => {
    clearModalInputs();

    // console.log(inputsModalEl);

    addTaskModalEl.close()
});

const addModalBtnEl = document.getElementById("modal-add");

addModalBtnEl.addEventListener("click", () => {
    const descriptionEl = document.getElementById("modal-description");
    const deadlineEl = document.getElementById("modal-deadline");
    const iconEl = document.getElementById("modal-icon");

    push(taskInDB, {
        "description": descriptionEl.value,
        "deadline": deadlineEl.value,
        "icon": iconEl.value,
        "status": "tbd"
    });

    clearModalInputs();
    addTaskModalEl.close();
});

function clearModalInputs() {
    const inputsModalEl = document.querySelectorAll(".modal-form input");

    inputsModalEl.forEach(element => {
        element.value = "";
    });
}