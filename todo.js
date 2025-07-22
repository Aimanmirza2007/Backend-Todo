const http = require("http");
const PORT = 5000
let todo = [
  {
    id: 1,
    task: "Learn React",
    completed: true,
  },
  {
    id: 2,
    task: "Learn Next",
    completed: false,
  },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  const method = req.method;
  const urlParts = req.url.split("/").filter(Boolean); // ['todo'] or ['todo', '1']

  // Get Route
  if (method === "GET" && urlParts.length === 1 && urlParts[0] === "todo") {
    res.writeHead(200);
    res.end(JSON.stringify(todo));
  }

  // Get Route by id
  else if (
    method === "GET" &&
    urlParts.length === 2 &&
    urlParts[0] === "todo"
  ) {
    const id = parseInt(urlParts[1]);
    const item = todo.find((t) => t.id === id);

    if (item) {
      res.writeHead(200);
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Todo not found" }));
    }
  }

  // Post Route
  else if (
    method === "POST" &&
    urlParts.length === 1 &&
    urlParts[0] === "todo"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);
      newUser.id = todo.length + 1;
      todo.push(newUser);
      res.writeHead(201);
      res.end("new data added");
    });
  }

  // Put Route by id
  else if (method === "PUT" && urlParts[0] === "todo" && urlParts[1]) {
    const id = +urlParts[1];
    const item = todo.find((t) => t.id === id);
    if (!item)
      return res.writeHead(404).end(JSON.stringify({ message: "Not found" }));

    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        item.task = data.task ?? item.task;
        item.completed = data.completed ?? item.completed;
        res.writeHead(200).end(JSON.stringify(item));
      } catch {
        res.writeHead(400).end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // Delete Route by id
  else if (method === "DELETE" && urlParts[0] === "todo" && urlParts[1]) {
    const id = +urlParts[1];
    const index = todo.findIndex((u) => u.id === id);

    if (index !== -1) {
      todo.splice(index, 1);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "User deleted successfully" }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "User not found" }));
    }
  }

  else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
