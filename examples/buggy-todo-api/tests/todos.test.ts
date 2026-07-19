import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { resetStore } from "../src/store.js";

beforeEach(() => {
  resetStore();
});

describe("POST /todos", () => {
  it("creates a todo and returns it", async () => {
    const res = await request(app).post("/todos").send({ title: "Buy milk" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: "Buy milk", done: false });
  });

  it("rejects a missing or empty title with 400", async () => {
    const missing = await request(app).post("/todos").send({});
    expect(missing.status).toBe(400);

    const empty = await request(app).post("/todos").send({ title: "   " });
    expect(empty.status).toBe(400);
  });
});

describe("GET /todos", () => {
  it("lists created todos", async () => {
    await request(app).post("/todos").send({ title: "One" });
    await request(app).post("/todos").send({ title: "Two" });

    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns 404 for a todo that does not exist", async () => {
    const res = await request(app).get("/todos/999");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /todos/:id/complete", () => {
  it("marks a todo as done — and the change persists", async () => {
    const created = await request(app).post("/todos").send({ title: "Task" });

    const patch = await request(app).patch(`/todos/${created.body.id}/complete`);
    expect(patch.status).toBe(200);
    expect(patch.body.done).toBe(true);

    const after = await request(app).get(`/todos/${created.body.id}`);
    expect(after.body.done).toBe(true);
  });
});

describe("DELETE /todos/:id", () => {
  it("deletes an existing todo", async () => {
    const created = await request(app).post("/todos").send({ title: "Task" });

    const del = await request(app).delete(`/todos/${created.body.id}`);
    expect(del.status).toBe(204);

    const after = await request(app).get(`/todos/${created.body.id}`);
    expect(after.status).toBe(404);
  });

  it("returns 404 when deleting a todo that does not exist — without touching others", async () => {
    await request(app).post("/todos").send({ title: "Keep me" });

    const del = await request(app).delete("/todos/999");
    expect(del.status).toBe(404);

    const list = await request(app).get("/todos");
    expect(list.body).toHaveLength(1);
  });
});
