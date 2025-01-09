const assignedTasksEl = document.getElementById("assigned-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const remainingTasksEl = document.getElementById("remaining-tasks");

// Substitute values using firebase later
assignedTasksEl.innerText = 12;
completedTasksEl.innerText = 11;
remainingTasksEl.innerText = assignedTasksEl.innerText - completedTasksEl.innerText;