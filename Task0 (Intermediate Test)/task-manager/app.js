#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const http = require("http");

const {
  addTask, getAllTasks, markTaskComplete, deleteTask, 
  loadTasksFromFile,
  checkTasksFile} = require("./taskManager.js");

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

  case "server":
    const tasksPath = path.join(__dirname, "tasks.json");

    const server = http.createServer((req, res) => {
      const { method, url } = req;

      try {
          // Enable CORS and set JSON response headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");

        if (method === "GET" && url === "/") {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Welcome to the Task API");
        } else if (method === "GET" && url === "/tasks") {
          try {
            checkTasksFile();
            const tasks = loadTasksFromFile(tasksPath);
  
            res.writeHead(200);
            res.end(JSON.stringify(tasks));
          } catch (error) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "No item currently in memory" }));
          }
        } else if (method === "POST" && url === "/tasks") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", () => {
            try {
              const task = JSON.parse(body);
              if (!task || !task.title || !task.description) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Task must have a title and a description" }));
              } else {
                const newTask = addTask(task.title, task.description);
                res.writeHead(201);
                res.end(JSON.stringify({ message: "Task added", newTask }));
              }
            } catch (e) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "Invalid JSON body" }));
            }
          });

          req.on('error', err => {
            console.error('Request Error:', err.message);
            res.writeHead(500);
            res.end(JSON.stringify({error: "Server error during request handling"}))
          })
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Not Found" }));
        }
      } catch (error) {
        console.error(`Unexpected server error:`, error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }

    });

      

    server.on('error', (err) => {
      console.error('Server failed to start:', err.message);
      process.exit(1);
    });

    // Start server
    server.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });

    break;
  
  case "help":
    // displayHelp();
    break;

  default:
    console.log(`<command> ${command} not found`);
    // displayHelp();
    break;
}