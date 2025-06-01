#!/usr/bin/env node

const readline = require("readline");
const {
  addTask, getAllTasks, markTaskComplete, deleteTask, saveTaskstoFile,
  loadTasksFromFile } = require("./taskManager.js");

// CLI logic
const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

switch (command) {
  case "add":
    try {
      if (args.length < 3) {
        throw new Error("The 'add' command needs a title and description");
      }

      addTask(args[1], args[2]);
    } catch (error) {
      console.log(error.message);
    }
    break;

  case "list":
    try {
      getAllTasks();
    } catch (error) {
      console.log(error.message);
    }
    break;

  case "delete":
    try {
      if (args.length < 2) {
        throw new Error(
          "The 'delete' command needs an 'id' value or delete all tasks with the 'all' option"
        );
      }

      if (args[1] === "all") {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question(
          `Are you sure you want to delete all your tasks? (Y/n): `,
          (answer) => {
            try {
              if (answer === "" || answer.toLowerCase() === "y") {
                deleteTask("all");
              } else if (answer.toLowerCase() === "n") {
                console.log("Deletion cancelled");
              } else {
                throw new Error(
                  `Unknown command: '${answer}'. Enter either 'y' or 'n'`
                );
              }
            } catch (error) {
              console.log(error.message);
            } finally {
              rl.close();
            }
          }
        );
      } else {
        deleteTask(args[1]);
      }
    } catch (error) {
      console.log(error.message);
    }
    break;

  case "complete":
    try {
      if (args.length < 2) {
        throw new Error("The 'complete' command needs an id option");
      }

      markTaskComplete(args[1]);
    } catch (error) {
      console.log(error.message);
    }
    break;

  case "help":
    // displayHelp();
    break;

  default:
    console.log(`<command> ${command} not found`);
    // displayHelp();
    break;
}