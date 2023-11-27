document.addEventListener("DOMContentLoaded", function () {
    // Load tasks from JSON file when the page is loaded
    loadTasks();
  
    // Add event listener to the "Add Task" button
    document.getElementById("taskInput").addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
  });
  
  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
  
    if (taskText !== "") {
      const currentDate = new Date();
      const taskId = currentDate.getTime(); // Unique ID for each task
  
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <div class="task" id="${taskId}">
          <span>${taskText}</span>
          <span>${currentDate.toLocaleString()}</span>
          <button onclick="deleteTask(${taskId})">Delete</button>
          <button onclick="modifyTask(${taskId})">Modify</button>
        </div>
      `;
  
      document.getElementById("taskList").appendChild(taskItem);
      taskInput.value = "";
    }
  }
  
  function deleteTask(taskId) {
    const taskElement = document.getElementById(taskId);
    taskElement.remove();
  }
  
  function modifyTask(taskId) {
    const taskElement = document.getElementById(taskId);
    const taskTextElement = taskElement.querySelector("span:first-child");
    const newTaskText = prompt("Modify task:", taskTextElement.textContent);
  
    if (newTaskText !== null) {
      taskTextElement.textContent = newTaskText;
    }
  }
  
  function deleteSelectedTask() {
    const taskId = prompt("Enter the ID of the task to delete:");
    if (taskId !== null) {
      deleteTask(taskId);
    }
  }
  
  function modifySelectedTask() {
    const taskId = prompt("Enter the ID of the task to modify:");
    if (taskId !== null) {
      modifyTask(taskId);
    }
  }
  
  function loadTasks() {
    // Fetch tasks from JSON file and populate the list
    fetch("tasks.json")
      .then(response => response.json())
      .then(data => {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Clear the existing list
  
        data.forEach(task => {
          const taskItem = document.createElement("li");
          taskItem.innerHTML = `
            <div class="task" id="${task.id}">
              <span>${task.text}</span>
              <span>${task.timestamp}</span>
              <button onclick="deleteTask(${task.id})">Delete</button>
              <button onclick="modifyTask(${task.id})">Modify</button>
            </div>
          `;
  
          taskList.appendChild(taskItem);
        });
      })
      .catch(error => console.error("Error loading tasks:", error));
  }
  
  function saveTasks() {
    // Save tasks to JSON file
    const taskList = [];
    const tasks = document.querySelectorAll(".task");
  
    tasks.forEach(task => {
      const id = parseInt(task.id);
      const text = task.querySelector("span:first-child").textContent;
      const timestamp = task.querySelector("span:last-child").textContent;
  
      taskList.push({ id, text, timestamp });
    });
  
    const jsonString = JSON.stringify(taskList, null, 2);
  
    // Using the File System Access API to write to a file (requires user permission)
    if ('showSaveFilePicker' in window) {
      window.showSaveFilePicker().then(fileHandle => {
        return fileHandle.createWritable().then(writable => {
          writable.write(jsonString);
          writable.close();
        });
      });
    } else {
      console.error("File System Access API is not supported in this browser.");
    }
  }
  