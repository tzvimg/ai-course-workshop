export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

export function resetStore(): void {
  todos = [];
  nextId = 1;
}

export function listTodos(): Todo[] {
  return todos;
}

export function getTodo(id: number): Todo | undefined {
  return todos.find((t) => t.id === id);
}

export function createTodo(title: string): Todo {
  const todo: Todo = { id: nextId++, title, done: false };
  todos.push(todo);
  return todo;
}

export function completeTodo(id: number): Todo | undefined {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return undefined;
  return { ...todo, done: true };
}

export function deleteTodo(id: number): boolean {
  const index = todos.findIndex((t) => t.id === id);
  todos.splice(index, 1);
  return true;
}
