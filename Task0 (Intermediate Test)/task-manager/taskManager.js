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
    console.log("Task added successfully!\n", `ID: ${newTask.id}, Title: "${newTask.title}"`);
    return newTask;
  } catch (error) {
    throw error;
  }
};

const getAllTasks = () => {
  try {
    checkTasksFile();

    const tasks = JSON.parse(fs.readFileSync(tasksPath));
    if (tasks.length < 1) {
      throw new Error(`No tasks found`);
    }

    console.log(`=== Your Task${tasks.length > 1 ? "s" : ""} ===`);
    tasks.forEach((task) => {
      console.log(`
[${task.id}] ${task.title} (${task.completed === false ? 'Pending' : 'Completed'})
    Description: ${task.description}
    Created: ${task.createdAt}`);
    });
    return tasks;

  } catch (error) {
    throw error;
  }
};

const markTaskComplete = (taskId) => {
  try {
  taskId = Number(taskId);
    let updatedTask;

    if (isNaN(taskId)) {
      throw new Error("ID must be a number");
    }

    checkTasksFile();

    const tasks = JSON.parse(fs.readFileSync(tasksPath));

    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      tasks.forEach((task) => {
        if (task.id === taskId) {
          task.completed = true;
          updatedTask = task;
        }
      });
    } else {
      throw new Error(`There is no task with the ID of ${taskId}`);
    }

    fs.writeFileSync(tasksPath, JSON.stringify(tasks));
    console.log(`Task "${updatedTask.title}" marked as complete`);

    return updatedTask;
  } catch (error) {
    throw error;
  }
};

const deleteTask = (option) => {
  try {
    if (option !== "all") {
      const taskId = Number(option);

      if (isNaN(taskId)) {
        throw new Error("ID must be a number");
      }

      checkTasksFile();

      const tasks = JSON.parse(fs.readFileSync(tasksPath));

      const taskToDelete = tasks.find((task) => task.id === taskId);

      if (taskToDelete) {
        const filteredTasks = tasks.filter((task) => task.id !== taskId);

        fs.writeFileSync(tasksPath, JSON.stringify(filteredTasks));

        console.log(`Task "${taskToDelete.title}" deleted successfully`);
        return taskToDelete;
      } else {
        throw new Error(`There is no task with the ID of ${taskId}`);
      }
    } else {
      // Handle deleting all tasks
      checkTasksFile();
      const tasks = JSON.parse(fs.readFileSync(tasksPath));

      if (tasks.length === 0) {
        throw new Error("No task currently in memory");
      }

      fs.writeFileSync(tasksPath, JSON.stringify([]));
      console.log("All tasks deleted successfully");
    }
  } catch (error) {
    throw error;
  }
};

const saveTaskstoFile = () => {
  
};

const loadTasksFromFile = () => {
  
};

const checkTasksFile = () => {
  if (!fs.existsSync(tasksPath)) {
    throw new Error("No task currently in memory");
  }
};

module.exports = {
  addTask,
  getAllTasks,
  markTaskComplete,
  deleteTask,
  saveTaskstoFile,
  loadTasksFromFile,
};