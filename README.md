# AI for Software Engineering — Workshop

> **[Live Site](https://tzvimg.github.io/ai-course-workshop/)**

A practical, hands-on workshop teaching developers how to leverage AI tools throughout the software development lifecycle.

## What is this?

A Hebrew (RTL) workshop site built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), covering AI-assisted software engineering — from prompt fundamentals to building your own coding agent and multi-agent orchestrator. The workshop's terminal agent is **Kiro CLI**; the agent-building modules use the **Anthropic API** directly.

## Modules

1. **Prompt Engineering** — Writing prompts that produce production-grade code
2. **Working with AI Dev Tools** — Context, rules/steering, permissions, sessions
3. **Terminal Agents (Kiro CLI)** — The "mission folder" pattern and full-system tasks
4. **Plan Mode** — Planning complex features before writing code
5. **Steering** — Feedback loops, tests as spec, explicit exit criteria
6. **Building a Coding Agent** — Implementing an agent loop from scratch
7. **Agentic Coding Loop** — Automating the loop: state, verification, guardrails
8. **MCP Servers** — Extending agent capabilities with the Model Context Protocol
9. **Custom Agents** — Automating workflows with Kiro CLI custom agents
10. **Sub-Agents** — Orchestrating multiple agents (fan-out, pipeline, supervisor)
11. **Building AI-Powered Features** — Integrating LLMs into your applications
12. **Advanced Patterns** — Production considerations, evals, security, CI/CD
13. **Capstone Project** — GitHub Repo Summarizer API

See `syllabus.md` for the full English syllabus and `FACILITATOR-GUIDE.md` for running it as a 2-day intensive.

## Tech Stack

- **Site generator:** MkDocs Material
- **Language:** Hebrew (RTL)
- **Features:** Code syntax highlighting, Mermaid diagrams, dark mode, search, PWA

## Local Development

```bash
pip install mkdocs-material
mkdocs serve
```

The site will be available at `http://localhost:8000`.

## Project Structure

```
docs/
├── index.md                      # Homepage + prerequisites
├── modules/
│   ├── 01-prompt-engineering.md
│   ├── 02-ai-workflows.md
│   ├── 03-terminal-agents.md
│   ├── 04-plan-mode.md
│   ├── 05-steering.md
│   ├── 06-agentic-coding.md
│   ├── 07-agentic-coding-loop.md
│   ├── 08-mcp-servers.md
│   ├── 09-skills.md              # Custom Agents module
│   ├── 10-subagents.md
│   ├── 11-building-ai-features.md
│   ├── 12-advanced-patterns.md
│   └── 13-final-project.md
├── assets/
├── stylesheets/rtl.css
└── javascripts/rtl-code.js
examples/
└── buggy-todo-api/               # Starter project with failing tests (modules 3, 5, 7)
overrides/
mkdocs.yml
syllabus.md                       # English syllabus
FACILITATOR-GUIDE.md              # 2-day intensive planning (not published)
CLAUDE.md
```

## License

All rights reserved.
