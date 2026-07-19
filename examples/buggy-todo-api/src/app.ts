import express from "express";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  getTodo,
  listTodos,
} from "./store.js";

export const app = express();
app.use(express.json());

app.get("/todos", (_req, res) => {
  res.json(listTodos());
});

app.get("/todos/:id", (req, res) => {
  const todo = getTodo(Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

app.post("/todos", (req, res) => {
  const todo = createTodo(req.body.title);
  res.status(201).json(todo);
});

app.patch("/todos/:id/complete", (req, res) => {
  const todo = completeTodo(Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  deleteTodo(Number(req.params.id));
  res.status(204).end();
});
