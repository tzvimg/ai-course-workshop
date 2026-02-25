# Module 2: Prompt Engineering for Code

!!! info "Duration"
    30 min lecture + 60 min hands-on + 15 min discussion

## Learning Objectives

By the end of this module, you will:

- Write prompts that produce production-quality code on the first try
- Use few-shot examples, personas, and chain-of-thought effectively
- Recognize and avoid common prompting anti-patterns

## Topics

### Writing Effective Prompts

- **Be specific:** "Add input validation" vs. "Add Zod validation for email format, required name field, and optional phone with E.164 format"
- **Provide context:** Language, framework, existing patterns, constraints
- **State constraints:** Performance requirements, style guides, no external deps

### Few-Shot Examples

Show the AI what you want by example:

```
Here's how we write API handlers in this project:

// GET /users/:id
export async function getUser(req: Request, res: Response) {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}

Now write a similar handler for DELETE /users/:id that also
checks authorization.
```

### Chain-of-Thought for Complex Problems

Ask the AI to think step by step:

```
I need to migrate our authentication from JWT to session-based auth.

Before writing code, please:
1. List all files that would need to change
2. Outline the migration strategy
3. Identify potential breaking changes
4. Then implement the changes one file at a time
```

### Anti-Patterns

- **Too vague:** "Make it better"
- **Too much at once:** Asking for an entire app in one prompt
- **No context:** Prompting without specifying language, framework, or patterns
- **Ignoring errors:** Not feeding error messages back to the AI

## Hands-On Exercise

### Prompt Refinement Challenge

**Start with this vague requirement:**

> "Build a user registration system"

**Round 1:** Send this as-is to an AI tool. Note what you get.

**Round 2:** Add specifics — language, framework, validation rules, database.

**Round 3:** Add project context — existing patterns, file structure, coding style.

**Round 4:** Add constraints — security requirements, error handling, tests.

**Compare the outputs.** How much did each refinement improve the result?

## Key Takeaways

- Prompting is a skill — the difference between a vague and precise prompt is massive
- Always provide context: language, framework, existing patterns
- Use few-shot examples when you want consistent style
- Break complex tasks into steps with chain-of-thought
- Feed errors back — AI tools learn from the conversation
