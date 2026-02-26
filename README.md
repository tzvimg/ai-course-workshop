# AI for Software Engineering — Workshop

A practical, hands-on workshop teaching developers how to leverage AI tools throughout the software development lifecycle.

## What is this?

A Hebrew (RTL) workshop site built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), covering AI-assisted software engineering — from fundamentals to building your own coding agent.

## Modules

2. **Prompt Engineering** — Writing prompts that produce production-grade code
3. **Working with AI Dev Tools** — Context management, sessions, rules, MCP
   - 3B. Terminal Agents (Kiro CLI)
   - 3C. Plan Mode — Planning complex features before coding
4. **Building a Coding Agent** — Implementing an agent loop from scratch
   - 4B. MCP Servers — Extending agent capabilities
   - 4C. Skills — Automating workflows with custom slash commands
5. **Building AI-Powered Features** — Integrating LLMs into your applications
6. **Advanced Patterns** — Production considerations, security, CI/CD
7. **Capstone Project** — Build a real tool with everything you've learned

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
├── index.md                  # Homepage
├── modules/
│   ├── 02-prompt-engineering.md
│   ├── 03-ai-workflows.md
│   ├── 03b-terminal-agents.md
│   ├── 03c-plan-mode.md
│   ├── 04-agentic-coding.md
│   ├── 04b-mcp-servers.md
│   ├── 04c-skills.md
│   ├── 05-building-ai-features.md
│   ├── 06-advanced-patterns.md
│   └── 07-capstone.md
├── assets/
│   └── icons/
├── stylesheets/
│   └── rtl.css
└── overrides/
mkdocs.yml
CLAUDE.md
```

## License

All rights reserved.
