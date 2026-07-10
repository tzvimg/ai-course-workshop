# AI for Software Engineering — Workshop

> **[Live Site](https://tzvimg.github.io/ai-course-workshop/)**

A practical, hands-on workshop teaching developers how to leverage AI tools throughout the software development lifecycle.

## What is this?

A Hebrew (RTL) workshop site built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), covering AI-assisted software engineering — from fundamentals to building your own coding agent.

## Modules

1. **Prompt Engineering** — Writing prompts that produce production-grade code
2. **Working with AI Dev Tools** — Context management, sessions, rules
3. **Terminal Agents (Kiro CLI)** — Full-system missions from the terminal
4. **Plan Mode** — Planning complex features before coding
5. **Steering** — Navigating the agent to success with feedback loops
6. **Building a Coding Agent** — Implementing an agent loop from scratch
7. **Agentic Coding Loop** — Automating the loop itself
8. **MCP Servers** — Extending agent capabilities
9. **Skills** — Automating workflows with custom slash commands
10. **Sub-Agents** — Orchestrating multiple agents
11. **Building AI-Powered Features** — Integrating LLMs into your applications
12. **Advanced Patterns** — Production considerations, security, CI/CD
13. **Final Project** — GitHub Repo Summarizer, using everything you've learned

## Tech Stack

- **Site generator:** MkDocs Material
- **Language:** Hebrew (RTL)
- **Features:** Code syntax highlighting, Mermaid diagrams, dark mode, search, PWA

## Local Development

```bash
pip install -r requirements.txt
mkdocs serve
```

The site will be available at `http://localhost:8000`.

## Project Structure

```
docs/
├── index.md                   # Homepage
├── modules/                   # Workshop modules 01–13 (one .md per module)
├── assets/icons/              # Favicon, PWA icons
├── stylesheets/rtl.css        # RTL layout, LTR code blocks
├── javascripts/rtl-code.js    # Direction auto-detection for code blocks
└── manifest.webmanifest       # PWA manifest
overrides/main.html            # Theme override (PWA meta tags)
.github/workflows/deploy.yml   # GitHub Pages deployment
mkdocs.yml                     # Site config + navigation
syllabus.md                    # Course syllabus (source outline)
FACILITATOR-GUIDE.md           # Notes for whoever delivers the workshop
CLAUDE.md                      # Project instructions for AI-assisted authoring
requirements.txt               # Pinned build dependencies
```

## License

All rights reserved.
