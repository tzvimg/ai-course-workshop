# מודול 5: בניית Coding Agent מאפס

!!! info "משך"
    30 דקות הרצאה + 90 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- להבין את הארכיטקטורה של agent loop ואיך הוא שונה מ-chat רגיל
- לממש agent loop שלם עם כלים בסיסיים: read, write, prompt, command
- להבין את הפרוטוקול בין ה-model לבין ה-agent (tool calls ו-tool results)
- לזהות את הדפוסים והאתגרים בבניית coding agents

## רקע: מה ההבדל בין Chat לבין Agent?

### Chat רגיל

```
User → Model → Response → סוף
```

המשתמש שולח הודעה, המודל עונה, וזהו. אין לו יכולת לעשות שום דבר מעבר לייצר טקסט.

### Agent Loop

```
User → Model → Tool Call → Tool Result → Model → Tool Call → ... → Response
```

ה-agent נותן למודל **כלים** (tools). במקום רק לענות בטקסט, המודל יכול *לבקש* לבצע פעולות: לקרוא קובץ, לכתוב קובץ, להריץ פקודה. ה-agent מבצע את הפעולה ומחזיר את התוצאה למודל, והמודל ממשיך — עד שהוא מחליט שסיים.

> זה בדיוק מה שקורה כש-Claude Code או Cursor עובדים. הם לא קסם — הם loop פשוט עם כלים.

## הארכיטקטורה

### הרכיבים

- **System Prompt** — הוראות קבועות שאומרות למודל מי הוא ומה הכלים שלו
- **Messages Array** — היסטוריית השיחה (user, assistant, tool results)
- **Tools Definition** — הגדרת הכלים שהמודל יכול לקרוא להם
- **Agent Loop** — הלולאה שמפעילה את המודל, מבצעת tool calls, ומחזירה תוצאות

### זרימה

```
┌─────────────────────────────────────────┐
│                Agent Loop               │
│                                         │
│  1. שלח messages + tools ל-API          │
│  2. קבל response מהמודל                 │
│  3. אם יש tool_use בתשובה:             │
│     a. בצע את הכלי (read/write/exec)    │
│     b. הוסף tool_result ל-messages      │
│     c. חזור לשלב 1                      │
│  4. אם אין tool_use → סיימנו           │
│                                         │
└─────────────────────────────────────────┘
```

### Tool Use Protocol

כשהמודל רוצה להשתמש בכלי, הוא מחזיר block מסוג `tool_use`:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "בוא נקרא את הקובץ כדי להבין את המבנה"
    },
    {
      "type": "tool_use",
      "id": "toolu_abc123",
      "name": "read_file",
      "input": { "path": "src/index.ts" }
    }
  ]
}
```

ה-agent מבצע את הפעולה ומחזיר `tool_result`:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "const express = require('express');\n..."
    }
  ]
}
```

המודל מקבל את התוצאה וממשיך — אולי קורא לכלי נוסף, אולי עונה למשתמש.

## הכלים שנבנה

### 1. `read_file` — קריאת קובץ

```json
{
  "name": "read_file",
  "description": "Read the contents of a file at the given path",
  "input_schema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "The file path to read"
      }
    },
    "required": ["path"]
  }
}
```

### 2. `write_file` — כתיבת קובץ

```json
{
  "name": "write_file",
  "description": "Write content to a file at the given path. Creates the file if it doesn't exist.",
  "input_schema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "The file path to write to"
      },
      "content": {
        "type": "string",
        "description": "The content to write"
      }
    },
    "required": ["path", "content"]
  }
}
```

### 3. `run_command` — הרצת פקודה

```json
{
  "name": "run_command",
  "description": "Run a shell command and return its output",
  "input_schema": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "The shell command to execute"
      }
    },
    "required": ["command"]
  }
}
```

### 4. `ask_user` — שאלה למשתמש

```json
{
  "name": "ask_user",
  "description": "Ask the user a question and wait for their response",
  "input_schema": {
    "type": "object",
    "properties": {
      "question": {
        "type": "string",
        "description": "The question to ask the user"
      }
    },
    "required": ["question"]
  }
}
```

## הגדרת API Key

לפני שמתחילים לבנות, צריך מפתח API של Anthropic:

### קבלת מפתח

1. היכנסו ל-[console.anthropic.com](https://console.anthropic.com)
2. צרו חשבון (או התחברו)
3. לכו ל-**API Keys** ולחצו **Create Key**
4. העתיקו את המפתח (מתחיל ב-`sk-ant-...`)

### הגדרה כ-environment variable

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

!!! danger "אל תשמרו מפתחות בקוד"
    - **לעולם** אל תכתבו את המפתח ישירות בקוד
    - אל תעשו commit לקבצי `.env`
    - הוסיפו `.env` ל-`.gitignore`

לפרויקטים אמיתיים, השתמשו בקובץ `.env` עם `dotenv`:

```bash
# .env (אל תעשו commit!)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

```typescript
import "dotenv/config"; // טוען את .env אוטומטית
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic(); // קורא ANTHROPIC_API_KEY מ-env
```

## תרגיל מעשי: בניית Coding Agent

### שלב 1 — שלד ה-Agent (15 דקות)

ממשו את ה-agent loop הבסיסי. הנה שלד בשפת TypeScript:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as readline from "readline";
import { execSync } from "child_process";

const client = new Anthropic();

// הגדרת הכלים
const tools: Anthropic.Tool[] = [
  {
    name: "read_file",
    description: "Read the contents of a file at the given path",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "The file path to read" },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description: "Write content to a file. Creates the file if it doesn't exist.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "The file path to write to" },
        content: { type: "string", description: "The content to write" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "run_command",
    description: "Run a shell command and return its output",
    input_schema: {
      type: "object" as const,
      properties: {
        command: { type: "string", description: "The shell command to execute" },
      },
      required: ["command"],
    },
  },
  {
    name: "ask_user",
    description: "Ask the user a question and wait for their response",
    input_schema: {
      type: "object" as const,
      properties: {
        question: { type: "string", description: "The question to ask" },
      },
      required: ["question"],
    },
  },
];

// מימוש הכלים
async function executeTool(name: string, input: any): Promise<string> {
  switch (name) {
    case "read_file":
      return fs.readFileSync(input.path, "utf-8");
    case "write_file":
      fs.writeFileSync(input.path, input.content);
      return `File written to ${input.path}`;
    case "run_command":
      try {
        return execSync(input.command, { encoding: "utf-8", timeout: 30000 });
      } catch (error: any) {
        return `Command failed: ${error.message}\n${error.stderr || ""}`;
      }
    case "ask_user": {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      return new Promise<string>((resolve) => {
        rl.question(`\n🤖 ${input.question}\n> `, (answer) => {
          rl.close();
          resolve(answer);
        });
      });
    }
    default:
      return `Unknown tool: ${name}`;
  }
}

// ה-Agent Loop
async function agentLoop(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  const systemPrompt = `You are a coding agent.
You can read files, write files, and run commands.
Always read a file before editing it.
Think step by step.`;

  while (true) {
    // 1. קריאה ל-API
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    // 2. הוספת התשובה ל-messages
    messages.push({ role: "assistant", content: response.content });

    // 3. בדיקה אם יש tool_use
    if (response.stop_reason === "end_turn") {
      // המודל סיים — הדפיסו את הטקסט הסופי
      for (const block of response.content) {
        if (block.type === "text") console.log(block.text);
      }
      break;
    }

    // 4. בדיקה: האם הגענו ל-max_tokens?
    if (response.stop_reason === "max_tokens") {
      console.log("⚠️ הגענו למגבלת tokens — התשובה נחתכה");
      // אפשר להמשיך עם prompt "continue" או לעצור
      break;
    }

    // 5. ביצוע כל ה-tool calls
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        console.log(`🔧 ${block.name}(${JSON.stringify(block.input)})`);
        try {
          const result = await executeTool(block.name, block.input);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        } catch (error: any) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Error: ${error.message}`,
          });
        }
      }
    }

    // 5. הוספת התוצאות ל-messages וחזרה ללולאה
    messages.push({ role: "user", content: toolResults });
  }
}
```

### שלב 2 — השלימו את הכלים (20 דקות)

1. הוסיפו את הכלים `write_file`, `run_command` ו-`ask_user` ל-tools array
2. ממשו את `ask_user` ב-`executeTool` (רמז: `readline` interface)
3. הוסיפו טיפול בשגיאות ב-`executeTool` — אם כלי נכשל, החזירו את השגיאה כ-string במקום לקרוס

### שלב 3 — בדקו את ה-Agent (20 דקות)

הריצו את ה-agent עם המשימות הבאות ובדקו איך הוא מתנהג:

1. **משימה פשוטה:** "צור קובץ `hello.py` שמדפיס Hello World והרץ אותו"
2. **משימה עם קריאה:** "קרא את הקובץ `package.json` וספר לי מה ה-dependencies"
3. **משימה מרובת שלבים:** "צור פרויקט Node.js חדש עם Express server שמחזיר JSON על הנתיב `/health`"

!!! warning "שימו לב"
    ה-agent שלכם יכול להריץ פקודות על המחשב! בסביבת workshop זה בסדר, אבל ב-production חובה להוסיף sandboxing ואישורים.

!!! danger "אבטחה: run_command הוא מסוכן"
    הכלי `run_command` מריץ **כל פקודת shell** — כולל `rm -rf /`, `curl | bash`, ופקודות הרסניות אחרות. ב-production חובה להגן:

    - **Docker container** — הריצו את ה-agent בcontainer מבודד עם resources מוגבלים
    - **Allowlist** — הגבילו לפקודות בטוחות בלבד (`npm test`, `tsc`, `git status`)
    - **אישור משתמש** — הציגו את הפקודה למשתמש ובקשו אישור לפני הרצה (שילוב `ask_user` לפני `run_command`)
    - **לעולם אל תחשפו ל-input לא מהימן** — אם משתמש חיצוני יכול לשלוט ב-prompt, הוא יכול להריץ קוד על השרת שלכם

### שלב 4 — שיפורים (20 דקות)

נסו להוסיף אחד או יותר מהשיפורים הבאים:

- **Streaming** — הציגו את תשובת המודל בזמן אמת (לא רק בסוף)
- **אישור פעולות** — בקשו אישור מהמשתמש לפני `write_file` או `run_command`
- **לוג צבעוני** — הדפיסו tool calls בצבעים שונים עם `chalk`
- **היסטוריית שיחה** — אפשרו למשתמש להמשיך לשלוח הודעות (multi-turn)
- **הגבלת iterations** — הגנה מפני loop אינסופי (max 20 iterations)

### שלב 5 — דיון (15 דקות)

עברו על ה-messages array בסוף הריצה:

```typescript
console.log(JSON.stringify(messages, null, 2));
```

שימו לב ל:

- כמה tool calls נדרשו למשימה
- האם המודל קרא קובץ לפני שערך אותו
- איך המודל תיקן את עצמו כשכלי נכשל
- מה גודל ה-context שנצבר

## מושגים מפתח

### Stop Reason

ה-API מחזיר `stop_reason` שאומר למה המודל הפסיק לייצר:

- **`end_turn`** — המודל סיים, אין עוד tool calls
- **`tool_use`** — המודל רוצה להשתמש בכלי, צריך לבצע ולהחזיר תוצאה
- **`max_tokens`** — נגמרו ה-tokens (בעייתי — צריך לטפל)

### Tool Results כ-User Messages

שימו לב שה-tool results נשלחים כ-`role: "user"`. זה כי מבחינת ה-API, כל מה שלא מגיע מהמודל הוא "user". הפרוטוקול תמיד מתחלף: `user → assistant → user → assistant → ...`

### Error Handling

כשכלי נכשל, **אל תקרסו**. החזירו את השגיאה כטקסט למודל:

```typescript
try {
  result = executeTool(block.name, block.input);
} catch (error) {
  result = `Error: ${error.message}`;
}
```

המודל מספיק חכם כדי להבין את השגיאה ולנסות גישה אחרת.

## נקודות מפתח

- Agent loop הוא פשוט: `call model → execute tools → repeat`
- המודל לא מריץ כלים — הוא **מבקש** מה-agent להריץ אותם
- ה-agent שולט: הוא מחליט אילו כלים לאפשר, מה לאשר, ומתי לעצור
- כל כלי AI agent (Claude Code, Cursor, Aider) עובד על אותו העיקרון — רק עם יותר כלים ויותר הגנות
- ה-system prompt הוא קריטי — הוא קובע את ההתנהגות של ה-agent
