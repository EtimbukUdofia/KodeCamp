const fs = require("fs");
const path = require("path");

const tasksPath = path.join(__dirname, "tasks.json");

const addTask = (title, description) => {
  try {
    let tasks = fs.existsSync(tasksPath)
      ? JSON.parse(fs.readFileSync(tasksPath))
      : [];

    title = title.replace(/(\r\n|\n|\r)/gm, ""); // removes line breaks from text
    description = description.replace(/(\r\n|\n|\r)/gm, ""); // removes line breaks from text

    // handle duplicate tasks
    const duplicateTask = tasks.find(
      (task) =>
        task.title.toLowerCase() === title.toLowerCase() &&
        task.completed === false
    );
    if (duplicateTask) {
      throw new Error(`A task already exists with that description`);
    }

    const newTask = {
      id: tasks[tasks.length - 1]?.id + 1 || 1,
      title,
      description,
      completed: false,
      createdAt: new Date().toString(),
    };

    tasks = [...tasks, newTask];

    fs.writeFileSync(tasksPath, JSON.stringify(tasks));
    console.log("Task added successfully!\n", `ID: ${newTask.id}, Title: ${newTask.title}`);
    return newTask;
  } catch (error) {
    throw error;
  }
};

const getAllTasks = () => {
  
};

const markTaskComplete = (taskId) => {
  
};

const deleteTask = (taskId) => {
  
};

const saveTaskstoFile = () => {
  
};

const loadTasksFromFile = () => {
  
};

module.exports = {
  addTask,
  getAllTasks,
  markTaskComplete,
  deleteTask,
  saveTaskstoFile,
  loadTasksFromFile,
};