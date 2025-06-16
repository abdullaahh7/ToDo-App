const addTaskBtn = document.getElementById("addTaskBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const container = document.getElementById("container");
const addInp = document.getElementById("add-inp");
const tasksDiv = document.getElementById("tasks");
const addModal = document.getElementById("addModal");
const goToComplete = document.getElementById("goToComplete");
const allTasks = document.getElementById("all-tasks");
const incompleteTasksBtn = document.getElementById("incomplete-tasks");

// ✅ GOOD: Only one DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const viewMode = localStorage.getItem("viewMode") || "all"; // 🆕 Load view mode
  tasksDiv.innerHTML = "";

  let tasksToShow = savedTasks;

  if (viewMode === "completed") {
    tasksToShow = savedTasks.filter((t) => t.checked);
  } else if (viewMode === "incomplete") {
    tasksToShow = savedTasks.filter((t) => !t.checked);
  }

  tasksToShow.forEach(({ text, checked }) => createTaskElement(text, checked));

  // Update button label and state
  if (viewMode === "completed") {
    addTaskBtn.textContent = "Completed Tasks";
    addTaskBtn.disabled = true;
  } else if (viewMode === "incomplete") {
    addTaskBtn.textContent = "Incomplete Tasks";
    addTaskBtn.disabled = true;
  } else {
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.disabled = false;
  }
});

addTaskBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
});

addModal.addEventListener("click", () => {
  if (addInp.value.trim() === "") {
    alert("Can't add empty Task");
  } else {
    const pTagsCount = document.querySelectorAll("#tasks p").length;
    if (pTagsCount >= 16) {
      alert("Limit exceeded, You can't add more Tasks");
    } else {
      addTask(addInp.value);
    }
  }
  modalOverlay.style.display = "none";
});

function addTask(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Prevent duplicate task text
  if (tasks.some((t) => t.text === taskText)) {
    alert("Task already exists.");
    return;
  }
  createTaskElement(taskText, false);
  saveTaskToLocalStorage(taskText, false);
  addInp.value = ""; // Clear input
}

function createTaskElement(text, isChecked = false) {
  const singleTask = document.createElement("div");
  singleTask.classList.add("single-task");
  if (isChecked) singleTask.id = "checked";

  const task = document.createElement("p");
  task.textContent = text;
  task.style.textDecoration = isChecked ? "line-through" : "none";

  const checkIcon = document.createElement("i");
  checkIcon.classList.add(
    "fa-solid",
    isChecked ? "fa-check-double" : "fa-check"
  );
  checkIcon.style.cursor = "pointer";

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can");
  trashIcon.style.cursor = "pointer";

  // Delete task
  trashIcon.addEventListener("click", () => {
    singleTask.remove();
    deleteTaskFromLocalStorage(text);
  });

  // Toggle complete/incomplete
  checkIcon.addEventListener("click", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const updatedTasks = tasks.map((t) => {
      if (t.text === text) {
        const updatedChecked = !t.checked;

        if (updatedChecked) {
          checkIcon.classList.remove("fa-check");
          checkIcon.classList.add("fa-check-double");
          singleTask.id = "checked"; // ✅ Set ID on the entire task container
          task.style.textDecoration = "line-through";
        } else {
          checkIcon.classList.remove("fa-check-double");
          checkIcon.classList.add("fa-check");
          singleTask.removeAttribute("id"); // ✅ Remove ID from container
          task.style.textDecoration = "none";
        }

        return { ...t, checked: updatedChecked };
      }
      return t;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  });

  // Create icon wrapper
  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("icon-wrapper");
  iconWrapper.appendChild(checkIcon);
  iconWrapper.appendChild(trashIcon);

  singleTask.appendChild(task);
  singleTask.appendChild(iconWrapper);
  tasksDiv.appendChild(singleTask);
}

function saveTaskToLocalStorage(taskText, isChecked = false) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, checked: isChecked });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Show All tasks
allTasks.addEventListener("click", () => {
  localStorage.setItem("viewMode", "all");
  location.reload();
});

// ✅ Show only completed tasks
goToComplete.addEventListener("click", () => {
  localStorage.setItem("viewMode", "completed");

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks = savedTasks.filter((t) => t.checked);

  tasksDiv.innerHTML = "";

  if (completedTasks.length === 0) {
    addTaskBtn.textContent = "No Completed Tasks";
    addTaskBtn.style.width = "47%";
  } else {
    addTaskBtn.textContent = "Completed Tasks";
    completedTasks.forEach(({ text, checked }) =>
      createTaskElement(text, checked)
    );
  }

  addTaskBtn.disabled = true;
});

// ✅ Show only InCompleted tasks
incompleteTasksBtn.addEventListener("click", () => {
  localStorage.setItem("viewMode", "incomplete"); // Save mode

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const incompleteTasks = savedTasks.filter((t) => !t.checked);

  tasksDiv.innerHTML = "";

  if (incompleteTasks.length === 0) {
    addTaskBtn.textContent = "No Incomplete Tasks";
  } else {
    addTaskBtn.textContent = "Incomplete Tasks";
    incompleteTasks.forEach(({ text, checked }) =>
      createTaskElement(text, checked)
    );
  }

  addTaskBtn.disabled = true;
});

// Nav item active toggle
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
  });
});
