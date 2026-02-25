# Module 1: Foundations — How AI Coding Tools Actually Work

!!! info "Duration"
    30 min lecture + 60 min hands-on + 15 min discussion

## Learning Objectives

By the end of this module, you will:

- Understand how LLMs generate code at a high level
- Know the key constraints (tokens, context windows) and how they affect your work
- Have a mental model for when AI helps and when it doesn't
- Be familiar with the major AI coding tools landscape

## Topics

### How LLMs Understand and Generate Code

- Tokens, not characters — how code gets broken down
- Next-token prediction and why it matters for code quality
- Training data: what the model has "seen"

### Token Limits and Context Windows

- What is a context window and why you hit limits
- How to work within constraints effectively
- Long context vs. short context strategies

### The AI Coding Tools Landscape

- **Chat interfaces:** ChatGPT, Claude.ai
- **IDE integrations:** GitHub Copilot, Cursor, Windsurf
- **CLI agents:** Claude Code, Aider, OpenAI Codex
- Strengths and trade-offs of each category

### Mental Model

> Think of AI as a **junior developer with perfect memory but no judgment**. It can write any pattern it's seen before, but it can't tell you if it's the *right* pattern for your situation.

## Hands-On Exercise

### Tool Comparison Challenge

**Goal:** Compare 3 different AI tools on the same coding task.

**Task:** Ask each tool to build a REST API endpoint that:

1. Accepts a JSON payload with `name` and `email`
2. Validates the input
3. Returns appropriate error messages
4. Follows best practices for your language of choice

**Try it with:**

- A chat interface (Claude.ai or ChatGPT)
- An IDE tool (Copilot or Cursor)
- A CLI agent (Claude Code or Aider)

**Evaluate:**

- Which produced the most complete code?
- Which required the least back-and-forth?
- Which best understood your project context?
- How did error handling differ?

## Discussion Questions

1. When would you choose a chat interface vs. an IDE agent vs. a CLI agent?
2. What surprised you about the differences in output?
3. Where did the AI tools struggle, and why do you think that is?

## Key Takeaways

- AI tools are powerful but have fundamental constraints you need to understand
- Different tools excel at different tasks — there's no single best option
- Context is king: the more context you provide, the better the output
- Always review AI output critically — it's a starting point, not a final answer
