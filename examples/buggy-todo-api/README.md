# Buggy Todo API — Workshop Starter Project

A small Express + TypeScript Todo API used as the hands-on playground for the AI workshop
(modules 3, 5 and 7).

**⚠️ Three tests fail on purpose.** The API has real bugs, and the failing tests describe the
correct behavior. Your job (or your agent's job) is to make all tests pass — by fixing the
bugs, **not** by changing the tests.

## Setup

```bash
npm install
npm test        # expect 3 failures — that's the starting point
```

## Run the server

```bash
npm run dev     # http://localhost:3000
```

## API

| Method | Path                    | Description                |
|--------|-------------------------|----------------------------|
| GET    | `/todos`                | List all todos             |
| GET    | `/todos/:id`            | Get a single todo          |
| POST   | `/todos`                | Create a todo (`{title}`)  |
| PATCH  | `/todos/:id/complete`   | Mark a todo as done        |
| DELETE | `/todos/:id`            | Delete a todo              |

## How this is used in the workshop

- **Module 3 (Terminal Agents):** environment-setup mission — ask the agent to install and run it
- **Module 5 (Steering):** practice test-driven steering against the failing suite
- **Module 7 (Agentic Coding Loop):** the loop re-prompts an agent until `npm test` passes
