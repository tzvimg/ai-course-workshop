# AI for Software Engineers — Workshop Syllabus

## Overview
A practical, hands-on workshop teaching developers how to effectively leverage AI tools throughout the software development lifecycle. No fluff — just patterns that work.

**Target Audience:** Software developers (junior to senior) who want to 10x their productivity with AI.

**Prerequisites:** Basic programming experience in any language. No ML/AI background needed.

**Primary tooling:** Kiro CLI as the workshop's terminal agent; the Anthropic API (TypeScript/Python SDK) for the modules where you build agents and features yourself.

---

## Module 1: Prompt Engineering for Code
- Writing effective prompts (specificity, context, constraints)
- Few-shot examples and their power
- Personas and how they change the output
- Chain-of-thought for complex problems
- Iterative refinement: feeding errors back
- Anti-patterns: what NOT to do

**Exercise:** Take a vague requirement and iteratively refine prompts until you get production-quality code.

---

## Module 2: Working with AI Dev Tools
- The common principles behind every AI dev tool (Kiro, Cursor, Windsurf, Copilot)
- Context management: what the model sees, session hygiene, snapshots
- Rules/steering files: writing rules the model can actually follow
- Permissions: what to auto-approve and what to always review
- MCP at a glance (deep dive in Module 8)
- Cost awareness: models, context size, and what drives spend

**Exercise:** Guided tour of your tool — context, model choice, rules file, permissions, and a first MCP server.

---

## Module 3: The Power of Terminal Agents — Kiro CLI
- What makes terminal agents unique vs IDE agents
- The "mission folder" pattern: open a folder, launch Kiro CLI, execute any task
- Full system access: disk cleanup, log analysis, resource monitoring
- Server communication: SSH, API calls, database queries
- Package management, environment setup, formatting, Git operations, CI/CD debugging
- Safety: approval modes and commands you never auto-approve

**Exercise:** Create mission folders and use Kiro CLI for 4 real-world missions: disk analysis, environment setup, code formatting, and server/API debugging.

---

## Module 4: Plan Mode — Planning Complex Features
- Why complex features fail without a plan
- Plan-first prompting; Kiro IDE Spec mode
- Breaking features into phases and independent tasks
- One session per task; keeping the plan in `PLAN.md`
- Re-planning when things go sideways

**Exercise:** Use plan mode to design a complex feature, then execute the first tasks in separate clean sessions.

---

## Module 5: Steering — Guiding the Agent to Success
- Feedback loops: compilation, tests, and runtime verification
- Tests as spec; red-green-refactor with an agent
- Explicit exit criteria and measurable targets
- Breaking agents out of failure loops

**Exercise:** Three mini-projects: compile-driven development, test-driven steering, and clear-target exit criteria.

---

## Module 6: Building a Coding Agent from Scratch
- The agent loop architecture: model → tool call → tool result → repeat
- The tool-use protocol (tool_use / tool_result)
- Implementing read/write/command/ask tools with the Anthropic SDK
- Error handling, stop reasons, and safety concerns

**Exercise:** Build a working coding agent in TypeScript with four tools, then extend it with your own tools.

---

## Module 7: Agentic Coding Loop — Automating the Loop
- The shift from writing prompts to designing loops that write prompts for you
- A minimal bash loop around the agent you built in Module 6
- Objective verification vs. self-reported completion (maker/checker pattern)
- The five building blocks of a reliable loop: scheduling, isolated environments, persistent state, separate verification, controlled external connectors
- Guardrails: iteration caps, cost budgets, timeouts, sandboxing, human-in-the-loop checkpoints
- The commercial equivalent: Kiro CLI headless mode

**Exercise:** Build a minimal agentic coding loop that re-prompts an agent against a failing test suite, then harden it with a state file and objective (test-based) completion checks.

---

## Module 8: MCP Servers — Extending Agent Capabilities
- What is MCP (Model Context Protocol) and why it exists
- Architecture: client/server, transports (stdio, Streamable HTTP)
- Capabilities: Tools, Resources, Prompts
- Configuring existing MCP servers in Kiro (`.kiro/settings/mcp.json`)
- Building a custom MCP server from scratch with the MCP SDK

**Exercise:** Configure a filesystem MCP server, then build your own "notes" MCP server with TypeScript and use it from Kiro CLI.

---

## Module 9: Custom Agents — Automating Workflows
- What are custom agents in Kiro CLI (JSON-defined agents with prompt + tools + permissions)
- `tools` vs `allowedTools`: least privilege in practice
- Building agents for repetitive workflows: PR review, deploy checks, migrations
- Sharing agents with your team via Git
- Custom agents vs steering files

**Exercise:** Install and use a prebuilt agent, then build a custom agent that automates a repetitive task in your workflow.

---

## Module 10: Sub-Agents — Orchestrating Multiple Agents
- What are sub-agents and when to use them
- Orchestration patterns: Fan-Out/Fan-In, Pipeline, Supervisor
- Building an orchestrator over the Anthropic SDK (extending Module 6's agent)
- Conflict resolution, failure handling, and cost control

**Exercise:** Run a manual fan-out with parallel Kiro CLI sessions, then build a programmatic orchestrator with restricted-tool sub-agents.

---

## Module 11: Building AI-Powered Features
- Integrating LLM APIs into your applications
- RAG (Retrieval-Augmented Generation) basics
- Structured outputs and function calling
- Streaming responses and UX patterns
- Cost management and rate limiting

**Exercise:** Build a Code Explainer feature in three layers: basic API call, structured output, streaming with cost tracking.

---

## Module 12: Advanced Patterns & Production Concerns
- Prompt caching and optimization
- Evaluation and testing AI outputs (assert-based, LLM-as-judge, human sampling)
- Handling hallucinations and errors gracefully
- Security considerations (prompt injection, data leakage)
- Monitoring, failure recovery, and CI/CD integration

**Exercise:** Build an eval harness, then add AI-powered code review to a CI pipeline.

---

## Module 13: Capstone Project — GitHub Repo Summarizer
Build an API service that accepts a GitHub repository URL and returns an LLM-generated summary:
- Repository content fetching and smart file filtering
- Context-window management strategies
- Structured LLM output, error handling, and documentation
- Graded on a 100-point rubric; blocking criteria include a working endpoint and no hardcoded keys

---

## Workshop Logistics
- **Duration:** 2-day intensive (selected modules — see FACILITATOR-GUIDE.md) or 13-week series (1 module/week)
- **Format:** Each module = 30 min lecture + 60 min hands-on + 15 min discussion
- **Tools needed:** Laptop with IDE, Kiro CLI (free tier), Anthropic API key, Git, Node.js 18+, Python 3.10+ for the capstone
