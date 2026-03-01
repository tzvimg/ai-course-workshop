# מודול 10: בניית פיצ׳רים מבוססי AI

!!! info "משך"
    30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- לשלב LLM APIs באפליקציות שלכם
- להבין RAG, structured outputs ו-function calling
- לטפל ב-streaming responses ולנהל עלויות

---

## חלק 1: אינטגרציה עם LLM APIs (10 דקות)

### למה להוסיף AI לאפליקציה שלכם?

עד עכשיו בסדנה עבדנו עם כלי AI לפיתוח — כלים שעוזרים *לנו* לכתוב קוד. עכשיו נעבור צד: נבנה פיצ׳רים שמשתמשים ב-LLM כדי לתת ערך ל*משתמשים שלנו*.

דוגמאות מהעולם האמיתי:

- **חיפוש חכם** — המשתמש שואל שאלה בשפה חופשית והמערכת מחזירה תוצאות רלוונטיות
- **סיכום תוכן** — סיכום אוטומטי של מסמכים, pull requests, או שרשורי דיון
- **מסביר קוד** — הסבר של קוד מורכב למפתחים חדשים בצוות
- **עוזר תמיכה** — chatbot שעונה על שאלות על סמך הדוקומנטציה שלכם

### התקנת ה-SDK

```bash
npm install @anthropic-ai/sdk
```

### קריאת API ראשונה

```typescript
import Anthropic from "@anthropic-ai/sdk";

// ה-SDK קורא אוטומטית את ANTHROPIC_API_KEY מ-environment variables
const client = new Anthropic();

async function generateExplanation(code: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `הסבר את הקוד הבא בצורה ברורה ותמציתית:\n\n${code}`,
      },
    ],
  });

  // message.content הוא מערך של content blocks
  const textBlock = message.content[0];
  if (textBlock.type === "text") {
    return textBlock.text;
  }
  throw new Error("Unexpected response type");
}

// שימוש
const explanation = await generateExplanation(`
  const debounce = (fn, ms) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  };
`);

console.log(explanation);
```

### פרמטרים חשובים

- **`model`** — איזה מודל להשתמש. `claude-sonnet-4-20250514` הוא האיזון הטוב ביותר בין מהירות, איכות ועלות. `claude-opus-4-0-20250514` לאיכות מקסימלית
- **`max_tokens`** — מגבלה על אורך התשובה. חשוב להגדיר — אחרת המודל עלול לייצר תשובות ארוכות מדי ולעלות יותר
- **`temperature`** — בין 0 ל-1. ערך נמוך (0) = תשובות עקביות ודטרמיניסטיות. ערך גבוה (1) = יותר יצירתיות ומגוון. לקוד ולמשימות מדויקות — השתמשו ב-0
- **`system`** — הוראות מערכת שמגדירות את התנהגות המודל. מקום מצוין להגדיר persona, פורמט תשובה, ושפה

### ניהול API Keys

!!! warning "אבטחה"
    לעולם אל תכניסו API key ישירות לקוד. גם לא ב-comment, גם לא "זמנית".

```bash
# .env (לא נכנס ל-git!)
ANTHROPIC_API_KEY=sk-ant-...
```

```typescript
// ה-SDK של Anthropic קורא אוטומטית מ-process.env.ANTHROPIC_API_KEY
// אין צורך להעביר את המפתח ידנית
const client = new Anthropic();
```

הוסיפו `.env` ל-`.gitignore`:

```
# .gitignore
.env
.env.local
.env.*.local
```

### טיפול בשגיאות

API calls יכולים להיכשל — rate limits, timeout, שגיאות שרת. חשוב לטפל בזה:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function callWithRetry(
  code: string,
  maxRetries: number = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: `Explain this code:\n\n${code}` }],
      });

      const textBlock = message.content[0];
      if (textBlock.type === "text") return textBlock.text;
      throw new Error("Unexpected response type");
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        // Rate limit — ממתינים ומנסים שוב
        const waitTime = Math.pow(2, attempt) * 1000; // exponential backoff
        console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (error instanceof Anthropic.APIError && error.status >= 500) {
        // שגיאת שרת — מנסים שוב
        console.warn(`Server error (${error.status}). Retrying...`);
        continue;
      }

      // שגיאות אחרות — לא מנסים שוב
      throw error;
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
}
```

!!! tip "ה-SDK מטפל ב-retries אוטומטית"
    ה-SDK של Anthropic כולל retry logic מובנה עם exponential backoff עבור שגיאות זמניות. הדוגמה למעלה מדגימה את העיקרון, אבל בפרקטיקה ה-SDK עושה הרבה מזה בשבילכם.

---

## חלק 2: Structured Outputs (5 דקות)

### הבעיה: טקסט חופשי לא מספיק

כשאנחנו בונים פיצ׳רים, אנחנו צריכים **מידע מובנה** — לא טקסט חופשי. אנחנו רוצים JSON שאפשר לפרסר, להציג ב-UI, ולשמור ב-database.

### הפתרון: Tool Use

הדרך הטובה ביותר לקבל structured output מ-Claude היא דרך `tool_use`. אנחנו מגדירים "כלי" עם schema — והמודל מחזיר JSON שמתאים ל-schema.

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function extractProductInfo(reviewText: string) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "extract_product_info",
        description:
          "Extract structured product information from a review text",
        input_schema: {
          type: "object" as const,
          properties: {
            product_name: {
              type: "string",
              description: "The name of the product being reviewed",
            },
            rating: {
              type: "number",
              description: "Rating from 1-5, inferred from sentiment",
            },
            pros: {
              type: "array",
              items: { type: "string" },
              description: "List of positive aspects mentioned",
            },
            cons: {
              type: "array",
              items: { type: "string" },
              description: "List of negative aspects mentioned",
            },
            summary: {
              type: "string",
              description: "One-sentence summary of the review",
            },
          },
          required: ["product_name", "rating", "pros", "cons", "summary"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "extract_product_info" },
    messages: [
      {
        role: "user",
        content: `Extract product information from this review:\n\n${reviewText}`,
      },
    ],
  });

  // כשמשתמשים ב-tool_choice, התשובה תכיל tool_use block
  const toolBlock = message.content.find((block) => block.type === "tool_use");
  if (toolBlock && toolBlock.type === "tool_use") {
    return toolBlock.input as {
      product_name: string;
      rating: number;
      pros: string[];
      cons: string[];
      summary: string;
    };
  }
  throw new Error("No tool use in response");
}

// שימוש
const info = await extractProductInfo(`
  I've been using the Sony WH-1000XM5 for three months now.
  The noise cancellation is incredible — best I've ever tried.
  Sound quality is warm and detailed. Battery easily lasts 30 hours.
  However, they don't fold flat like the XM4s, and the carrying case is huge.
  Also quite expensive at $400. Overall highly recommended for frequent travelers.
`);

console.log(info);
// {
//   product_name: "Sony WH-1000XM5",
//   rating: 4,
//   pros: ["Incredible noise cancellation", "Warm and detailed sound", "30-hour battery life"],
//   cons: ["Don't fold flat", "Large carrying case", "Expensive ($400)"],
//   summary: "Excellent noise-cancelling headphones recommended for travelers despite bulky design and high price."
// }
```

!!! info "למה `tool_choice` ולא רק `tools`?"
    `tool_choice: { type: "tool", name: "extract_product_info" }` מכריח את המודל להשתמש בכלי הספציפי. בלי זה, המודל עשוי להחליט לענות בטקסט רגיל במקום להחזיר JSON מובנה.

---

## חלק 3: RAG — Retrieval-Augmented Generation (5 דקות)

### מה זה RAG?

RAG הוא pattern פשוט אבל חזק:

> במקום לקוות שהמודל יודע את התשובה — **תנו לו את המסמכים הרלוונטיים.**

### התהליך

1. **Search** — המשתמש שואל שאלה, מחפשים מסמכים רלוונטיים (full-text search, vector search, או אפילו חיפוש פשוט)
2. **Retrieve** — שולפים את המסמכים שנמצאו
3. **Augment** — מכניסים את המסמכים ל-prompt כ-context
4. **Generate** — המודל עונה על סמך המסמכים

### מתי להשתמש ב-RAG?

- **RAG** — כשיש לכם מידע שמשתנה (דוקומנטציה, מאגר ידע, תוכן שמתעדכן)
- **Prompt Engineering** — כשהמידע הנדרש קבוע וקטן מספיק להיכנס ל-prompt
- **Fine-tuning** — כשרוצים לשנות את *סגנון* או *התנהגות* המודל (נדיר — ברוב המקרים RAG או prompting מספיקים)

### דוגמת קוד: RAG פשוט

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// שלב 1: "מאגר מסמכים" פשוט (בעולם האמיתי — database עם vector search)
const docs = [
  {
    title: "Cancellation Policy",
    content:
      "Customers can cancel within 30 days for a full refund. After 30 days, a 20% fee applies.",
  },
  {
    title: "Shipping Policy",
    content:
      "Standard shipping takes 5-7 business days. Express shipping (2-3 days) costs $15.",
  },
  {
    title: "Return Policy",
    content:
      "Items can be returned within 60 days in original packaging. Refund processed in 5-10 business days.",
  },
];

// שלב 2: חיפוש פשוט (בעולם האמיתי — vector similarity search)
function searchDocs(query: string) {
  const queryWords = query.toLowerCase().split(" ");
  return docs.filter((doc) =>
    queryWords.some(
      (word) =>
        doc.content.toLowerCase().includes(word) ||
        doc.title.toLowerCase().includes(word)
    )
  );
}

// שלב 3: RAG — חיפוש + שליחה למודל
async function answerQuestion(question: string): Promise<string> {
  const relevantDocs = searchDocs(question);

  const context = relevantDocs
    .map((doc) => `## ${doc.title}\n${doc.content}`)
    .join("\n\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system:
      "You are a helpful customer support assistant. Answer based ONLY on the provided documents. If the answer is not in the documents, say so.",
    messages: [
      {
        role: "user",
        content: `Documents:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const textBlock = message.content[0];
  if (textBlock.type === "text") return textBlock.text;
  throw new Error("Unexpected response type");
}

// שימוש
const answer = await answerQuestion("How long do I have to return an item?");
console.log(answer);
```

!!! tip "בפרודקשן"
    בפרויקט אמיתי, השלב של "חיפוש" יהיה vector database (כמו Pinecone, Weaviate, או pgvector) שמחפש על סמך דמיון סמנטי — לא רק keyword matching.

---

## חלק 4: Streaming Responses (5 דקות)

### למה streaming?

כשמודל מייצר תשובה ארוכה, המשתמש מחכה כמה שניות בלי לראות כלום. **Streaming** מאפשר להציג את התשובה מילה-אחרי-מילה, כמו שמישהו מקליד — מה שמשפר משמעותית את חוויית המשתמש.

- **בלי streaming:** המשתמש מחכה 3-5 שניות → רואה תשובה שלמה
- **עם streaming:** המשתמש רואה טקסט מתחיל להופיע אחרי ~200ms

### דוגמת קוד: Streaming

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function streamExplanation(code: string): Promise<string> {
  let fullResponse = "";

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `הסבר את הקוד הזה:\n\n${code}`,
      },
    ],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text); // הדפסה בזמן אמת
      fullResponse += event.delta.text;
    }
  }

  console.log(); // שורה חדשה בסוף
  return fullResponse;
}
```

### מתי *לא* להשתמש ב-streaming?

- כשאתם צריכים structured output (tool use) — עדיף לחכות לתשובה מלאה
- כשהתשובה קצרה (עד ~100 tokens) — ההבדל לא מורגש
- ב-batch processing — כשאין משתמש שמחכה

---

## חלק 5: ניהול עלויות (5 דקות)

### הבנת תמחור

LLM APIs מתומחרים לפי **tokens** (יחידות טקסט, בערך 3/4 מילה באנגלית):

- **Input tokens** — מה שאתם שולחים (prompt + context)
- **Output tokens** — מה שהמודל מייצר (התשובה)

תמחור משוער (נכון ל-2025, בדקו מחירים עדכניים):

- **Claude Sonnet** — $3 per 1M input tokens, $15 per 1M output tokens
- **Claude Opus** — $15 per 1M input tokens, $75 per 1M output tokens
- **Claude Haiku** — $0.25 per 1M input tokens, $1.25 per 1M output tokens

### מחשבון עלויות פשוט

```typescript
interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

// מחירים לפי מיליון tokens
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-20250514": { input: 3, output: 15 },
  "claude-opus-4-0-20250514": { input: 15, output: 75 },
  "claude-haiku-3-5-20241022": { input: 0.25, output: 1.25 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): CostEstimate {
  const prices = PRICING[model];
  if (!prices) throw new Error(`Unknown model: ${model}`);

  const inputCost = (inputTokens / 1_000_000) * prices.input;
  const outputCost = (outputTokens / 1_000_000) * prices.output;

  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

// דוגמה: 1000 קריאות עם 500 input tokens ו-200 output tokens כל אחת
const estimate = estimateCost("claude-sonnet-4-20250514", 500_000, 200_000);
console.log(`Estimated cost for 1000 calls: $${estimate.totalCost.toFixed(4)}`);
// Estimated cost for 1000 calls: $0.0045
```

### אסטרטגיות לחיסכון

- **בחרו את המודל הנכון** — Haiku למשימות פשוטות (סיווג, extraction), Sonnet לרוב המשימות, Opus רק כשצריך את האיכות הגבוהה ביותר
- **הגבילו `max_tokens`** — אל תבקשו 4096 tokens כשאתם צריכים 200
- **Prompt caching** — Anthropic תומך ב-prompt caching שחוסך עד 90% על input tokens חוזרים. אם ה-system prompt שלכם גדול ונשלח שוב ושוב — זה חיסכון משמעותי
- **Batch processing** — אם לא צריך תשובה מיידית, השתמשו ב-Message Batches API שנותן 50% הנחה
- **מוניטורינג** — עקבו אחרי usage ב-Anthropic Console. הגדירו alerts על חריגה מתקציב

### תיעוד usage מכל קריאה

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function callWithTracking(prompt: string) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  // ה-API מחזיר את ה-token usage בתשובה
  console.log(`Input tokens: ${message.usage.input_tokens}`);
  console.log(`Output tokens: ${message.usage.output_tokens}`);

  const cost = estimateCost(
    "claude-sonnet-4-20250514",
    message.usage.input_tokens,
    message.usage.output_tokens
  );
  console.log(`Cost: $${cost.totalCost.toFixed(6)}`);

  return message;
}
```

!!! warning "אבטחת קלט"
    כשאתם מקבלים קלט מהמשתמש ומכניסים אותו ל-prompt — חשוב לעשות **input validation**. הגבילו אורך קלט, סננו תוכן לא רצוי, ובדקו את הפלט של המודל לפני שמציגים אותו למשתמש. זה מונע prompt injection ושימוש לרעה.

---

## תרגיל מעשי (60 דקות)

!!! tip "מה נבנה?"
    נבנה **Code Explainer** — פיצ׳ר שמקבל קוד ומחזיר הסבר מפורט. נתחיל פשוט ונוסיף שכבות: structured output, streaming, ומעקב עלויות.

### הכנה

```bash
mkdir code-explainer && cd code-explainer
npm init -y
npm install @anthropic-ai/sdk typescript tsx
npx tsc --init
```

וודאו שיש לכם API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

---

### חלק A: קריאת API בסיסית (20 דקות)

**מטרה:** שליחת קוד ל-Claude וקבלת הסבר חזרה.

צרו קובץ `explainer-basic.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function explainCode(code: string): Promise<string> {
  // TODO: implement
  // 1. Call client.messages.create with:
  //    - model: "claude-sonnet-4-20250514"
  //    - max_tokens: 1024
  //    - system prompt that tells Claude to be a helpful code explainer
  //    - user message with the code
  // 2. Extract the text from the response
  // 3. Return the explanation

  throw new Error("Not implemented");
}

// קוד לדוגמה להסבר
const sampleCode = `
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
`;

async function main() {
  console.log("Explaining code...\n");
  const explanation = await explainCode(sampleCode);
  console.log(explanation);
}

main().catch(console.error);
```

הריצו עם:

```bash
npx tsx explainer-basic.ts
```

!!! success "מה צריך לעבוד"
    כשתמלאו את ה-TODO ותריצו, אתם צריכים לראות הסבר טקסטואלי של פונקציית ה-memoize.

---

### חלק B: Structured Output עם Tool Use (20 דקות)

**מטרה:** במקום טקסט חופשי, נקבל JSON מובנה עם שדות מוגדרים.

צרו קובץ `explainer-structured.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface CodeExplanation {
  summary: string;
  complexity_level: "beginner" | "intermediate" | "advanced";
  key_concepts: string[];
  suggestions: string[];
}

async function explainCodeStructured(
  code: string
): Promise<CodeExplanation> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "explain_code",
        description:
          "Provide a structured explanation of the given code",
        input_schema: {
          type: "object" as const,
          properties: {
            summary: {
              type: "string",
              description:
                "A clear 2-3 sentence explanation of what the code does",
            },
            complexity_level: {
              type: "string",
              enum: ["beginner", "intermediate", "advanced"],
              description: "The complexity level of the code",
            },
            key_concepts: {
              type: "array",
              items: { type: "string" },
              description:
                "List of programming concepts used (e.g., generics, closures, memoization)",
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              description:
                "Suggestions for improving the code or things to watch out for",
            },
          },
          required: [
            "summary",
            "complexity_level",
            "key_concepts",
            "suggestions",
          ],
        },
      },
    ],
    // TODO: Add tool_choice to force the model to use the tool
    // TODO: Send a message asking to explain the code
    messages: [],
  });

  // TODO: Extract the tool_use block from message.content
  // TODO: Return the input as CodeExplanation
  throw new Error("Not implemented");
}

const sampleCode = `
async function retry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}
`;

async function main() {
  console.log("Analyzing code...\n");
  const result = await explainCodeStructured(sampleCode);
  console.log("Summary:", result.summary);
  console.log("Complexity:", result.complexity_level);
  console.log("Key Concepts:", result.key_concepts);
  console.log("Suggestions:", result.suggestions);
}

main().catch(console.error);
```

!!! success "מה צריך לעבוד"
    כשתמלאו את ה-TODOs ותריצו, אתם צריכים לקבל אובייקט JSON מובנה עם ארבעה שדות — לא טקסט חופשי.

---

### חלק C: Streaming + מעקב עלויות (20 דקות)

**מטרה:** הצגת התשובה בזמן אמת + לוג של tokens ועלות.

צרו קובץ `explainer-streaming.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// מחשבון עלויות
function calculateCost(
  inputTokens: number,
  outputTokens: number
): { inputCost: number; outputCost: number; totalCost: number } {
  // Claude Sonnet pricing per 1M tokens
  const INPUT_PRICE = 3; // $3 per 1M input tokens
  const OUTPUT_PRICE = 15; // $15 per 1M output tokens

  const inputCost = (inputTokens / 1_000_000) * INPUT_PRICE;
  const outputCost = (outputTokens / 1_000_000) * OUTPUT_PRICE;

  return { inputCost, outputCost, totalCost: inputCost + outputCost };
}

async function explainCodeWithStreaming(code: string): Promise<void> {
  console.log("--- Explanation (streaming) ---\n");

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system:
      "You are a code explainer. Explain the given code clearly and concisely.",
    messages: [
      {
        role: "user",
        content: `Explain this code:\n\n${code}`,
      },
    ],
  });

  // TODO: Iterate over stream events
  // For each content_block_delta with text_delta:
  //   - Write the text to stdout with process.stdout.write()
  //   - Track the number of text chunks received

  // TODO: After the stream ends, get the final message with stream.finalMessage()
  // Use message.usage to get input_tokens and output_tokens

  // TODO: Calculate and display the cost
  // console.log("\n--- Usage ---");
  // console.log(`Input tokens: ${...}`);
  // console.log(`Output tokens: ${...}`);
  // console.log(`Estimated cost: $${...}`);

  throw new Error("Not implemented");
}

const sampleCode = `
class EventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: Set<(data: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(listener);
    return () => this.listeners[event]?.delete(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach(listener => listener(data));
  }
}
`;

async function main() {
  await explainCodeWithStreaming(sampleCode);
}

main().catch(console.error);
```

!!! success "מה צריך לעבוד"
    כשתמלאו את ה-TODOs ותריצו, אתם צריכים לראות: (1) טקסט שמופיע בזמן אמת מילה-אחרי-מילה, (2) סיכום usage עם מספר tokens, (3) עלות משוערת.

---

### אתגר בונוס

סיימתם מוקדם? נסו אחד מאלה:

- **הוסיפו RAG** — צרו "מאגר" של קבצי קוד, חפשו את הקובץ הרלוונטי לפי שם, והוסיפו אותו כ-context ל-prompt
- **שלבו structured + streaming** — קודם stream את ההסבר הטקסטואלי, ואז קבלו structured output עם הסיכום
- **הוסיפו caching** — שמרו תוצאות ב-Map ואל תקראו ל-API שוב עבור אותו קוד

---

## דיון (15 דקות)

### שאלות לדיון

1. **מתי כדאי (ומתי לא כדאי) להוסיף AI לפיצ׳ר?** חשבו על דוגמה מהמוצר שלכם — יש פיצ׳ר ש-AI יכול לשפר? מה ה-trade-offs?

2. **עלות מול ערך** — אם קריאת API עולה $0.01 לבקשה ויש לכם 100K משתמשים פעילים, מה התקציב החודשי? האם הפיצ׳ר שווה את זה?

3. **UX של AI** — איך מציגים למשתמש תשובה שלא בטוח שהיא נכונה? מה ההבדל בין "AI שמחליט" ל"AI שמציע"?

4. **Latency ומשתמשים** — זמן תגובה של 2-3 שניות קביל ב-chatbot, אבל מה עם חיפוש? autocomplete? איפה streaming עוזר ואיפה לא?

5. **אבטחה** — איך מתגוננים מ-prompt injection כשהמשתמש מזין טקסט חופשי שנכנס ל-prompt?

---

## נקודות מפתח

- **Anthropic SDK** מאפשר קריאת API ב-TypeScript עם כמה שורות קוד — `client.messages.create()` הוא כל מה שצריך להתחיל
- **Structured Outputs** דרך `tool_use` נותנים לכם JSON עקבי ומובנה במקום טקסט חופשי — קריטי לבניית פיצ׳רים אמיתיים
- **RAG** הוא הדרך הנכונה לתת למודל ידע ספציפי — חפשו מסמכים רלוונטיים והכניסו אותם ל-prompt
- **Streaming** משפר UX בצורה משמעותית — המשתמש רואה תשובה מתחילה להופיע מיד במקום לחכות
- **ניהול עלויות** מתחיל ביום הראשון — בחרו את המודל הנכון למשימה, הגבילו tokens, ועקבו אחרי usage
- **אבטחה תמיד** — API keys ב-environment variables, validation על קלט, בדיקת פלט לפני הצגה
