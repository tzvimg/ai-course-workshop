# AI for Software Engineers — Workshop Syllabus

## Overview
A practical, hands-on workshop teaching developers how to effectively leverage AI tools throughout the software development lifecycle. No fluff — just patterns that work.

**Target Audience:** Software developers (junior to senior) who want to 10x their productivity with AI.

**Prerequisites:** Basic programming experience in any language. No ML/AI background needed.

---

## Module 1: Foundations — How AI Coding Tools Actually Work
- How LLMs understand and generate code
- Token limits, context windows, and why they matter
- The landscape: Copilot, Claude Code, Cursor, Aider, ChatGPT, etc.
- Mental model: AI as a junior developer with perfect memory but no judgment

**Exercise:** Compare outputs from 3 different AI tools for the same coding task. Analyze strengths and weaknesses.

---

## Module 2: Prompt Engineering for Code
- Writing effective prompts (specificity, context, constraints)
- Few-shot examples and their power
- System prompts and persona patterns
- Chain-of-thought for complex problems
- Anti-patterns: what NOT to do

**Exercise:** Take a vague requirement and iteratively refine prompts until you get production-quality code.

---

## Module 3: AI-Assisted Development Workflows
- Code generation: scaffolding, boilerplate, CRUD
- Code review and bug detection with AI
- Refactoring with AI guidance
- Test generation (unit, integration, e2e)
- Documentation generation

**Exercise:** Take a legacy codebase and use AI to add tests, refactor, and document it.

---

## Module 4: Agentic Coding — AI as Your Pair Programmer
- CLI agents: Claude Code, Aider, Codex
- IDE agents: Cursor, Copilot, Windsurf
- Setting up effective project context (CLAUDE.md, .cursorrules, etc.)
- Multi-step task delegation
- When to trust and when to verify

**Exercise:** Use an agentic tool to implement a feature end-to-end, from spec to tests to PR.

---

## Module 5: Building AI-Powered Features
- Integrating LLM APIs into your applications
- RAG (Retrieval-Augmented Generation) basics
- Structured outputs and function calling
- Streaming responses and UX patterns
- Cost management and rate limiting

**Exercise:** Build a simple AI-powered feature (e.g., smart search, content summarizer, or code explainer).

---

## Module 6: Advanced Patterns & Production Concerns
- Prompt caching and optimization
- Evaluation and testing AI outputs
- Handling hallucinations and errors gracefully
- Security considerations (prompt injection, data leakage)
- CI/CD integration with AI tools

**Exercise:** Add AI-powered code review to a CI pipeline.

---

## Module 7: Capstone Project
Participants build a real tool or feature using everything learned:
- Choose a problem from their actual work
- Design the AI integration approach
- Implement, test, and present
- Peer review and feedback

---

## Workshop Logistics
- **Duration:** Can be delivered as 2-day intensive or 7-week series (1 module/week)
- **Format:** Each module = 30 min lecture + 60 min hands-on + 15 min discussion
- **Tools needed:** Laptop with IDE, API keys for Claude/OpenAI, Git
