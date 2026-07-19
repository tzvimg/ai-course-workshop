# מודול 10: Sub-Agents — תזמור של agents מרובים

!!! info "משך"
    30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- להבין מה הם sub-agents ולמה צריך אותם
- להגדיר sub-agents עם הרשאות, משאבים ומגבלות
- לתזמר מספר agents שעובדים יחד על משימה מורכבת
- לזהות מתי כדאי לפצל משימה ל-sub-agents ומתי לא

!!! tip "למה sub-agents?"
    במודול 6 בנינו agent בודד עם loop אחד. אבל מה קורה כשהמשימה מורכבת מדי? Agent אחד שמנסה לעשות הכל — חוקר, כותב קוד, בודק, מתקן — מתחיל לאבד פוקוס ולצרוך context מיותר. הפתרון: **לפצל את העבודה ל-agents מתמחים**.

## הרעיון: Agent שמפעיל agents

### Agent בודד לעומת multi-agent

**Agent בודד:**
```
User → Agent → [קריאת קבצים, כתיבה, הרצה, תיקון, ...] → Response
```

הבעיה: ככל שהמשימה מתארכת, ה-context window מתמלא. ה-agent "שוכח" החלטות מוקדמות, מאבד פוקוס, ועושה טעויות.

**Multi-agent עם sub-agents:**
```
User → Main Agent (orchestrator)
         ├→ Sub-Agent A: "חקור את ה-codebase"
         ├→ Sub-Agent B: "כתוב את הפיצ'ר"
         └→ Sub-Agent C: "כתוב tests"
       ← Main Agent: מרכיב תשובה סופית
```

כל sub-agent מקבל **context נקי**, מתמקד במשימה אחת, ומחזיר תוצאה ממוקדת.

### האנלוגיה

חשבו על tech lead שמנהל צוות:

- **Tech lead (orchestrator)** — מבין את התמונה הגדולה, מחלק משימות, מרכיב את התוצאה הסופית
- **מפתח A (sub-agent)** — מתמחה בחקירת קוד קיים
- **מפתח B (sub-agent)** — מתמחה בכתיבת קוד חדש
- **מפתח C (sub-agent)** — מתמחה בכתיבת tests

ה-tech lead לא כותב את כל הקוד בעצמו — הוא **מתזמר** את העבודה.

## איך Sub-Agents עובדים בפועל

### העיקרון

Sub-agent הוא פשוט **הפעלה נפרדת של agent** — עם prompt משלו, context נקי, וסט כלים מוגבל. כל sub-agent:

- מקבל **prompt ספציפי** — מה בדיוק לעשות
- רץ עם **context נקי** — לא רואה את כל היסטוריית השיחה
- מקבל **סט כלים מוגבל** — לפי התפקיד שלו
- מחזיר **תוצאה אחת** — ל-agent הראשי (ה-orchestrator)

במודול הזה נממש את זה בעצמנו: נבנה orchestrator ב-TypeScript שמריץ sub-agents מעל ה-Anthropic SDK — הרחבה ישירה של ה-agent שבנינו במודול 6. (ההקבלה ב-Kiro CLI: ה-custom agents ממודול 9, כל אחד עם `tools` ו-`allowedTools` משלו, שאפשר להריץ בסשנים מקבילים.)

```mermaid
graph TD
    U["👤 User"] --> O["🤖 Orchestrator Agent"]
    O --> |"Task: חקור את ה-codebase"| A["🔍 Explorer Agent"]
    O --> |"Task: בנה את הפיצ'ר"| B["💻 Coder Agent"]
    O --> |"Task: כתוב tests"| C["🧪 Test Agent"]
    A --> |"תוצאה: מבנה הפרויקט + קבצים רלוונטיים"| O
    B --> |"תוצאה: קוד חדש"| O
    C --> |"תוצאה: קבצי test"| O
    O --> |"תשובה מרוכזת"| U
```

### סוגי sub-agents

שלושה תפקידים שכדאי להגדיר כמעט בכל orchestrator, כל אחד עם כלים שונים:

**Explorer** — חקירת codebase:

- כלים: קריאת קבצים, חיפוש (list, search), ניווט
- **אין לו**: כתיבה, הרצת פקודות
- שימוש: "תמצא איפה מוגדר ה-authentication middleware"

**Coder** — כתיבת קוד:

- כלים: קריאה, כתיבה, חיפוש, הרצת פקודות
- שימוש: "תוסיף validation לכל ה-API endpoints"

**Planner** — תכנון:

- כלים: קריאה, חיפוש
- **אין לו**: כתיבה, הרצת פקודות
- שימוש: "תתכנן את הארכיטקטורה למערכת notifications"

> כל סוג agent מקבל רק את הכלים שהוא צריך — **עקרון ה-least privilege**. Explorer לא יכול לשנות קבצים, Planner לא יכול להריץ פקודות. זה בדיוק אותו רעיון כמו `tools`/`allowedTools` ב-custom agents של Kiro CLI (מודול 9).

## הגדרת Sub-Agent

### המבנה הבסיסי

כשהאורקסטרטור מפעיל sub-agent, הוא מגדיר:

```
1. סוג ה-agent (subagent_type) — קובע את הכלים הזמינים
2. ה-prompt — מה לעשות
3. מגבלות (אופציונלי) — max turns, timeout
```

!!! note "מה קורה כש-max turns נגמר?"
    כשה-agent מגיע למגבלת ה-max turns, הוא **עוצר ומחזיר את מה שיש לו עד כה**. הוא לא מקבל סיבוב נוסף לסכם או לסיים — פשוט נעצר. לכן חשוב לבחור ערך שנותן ל-agent מספיק סיבובים לסיים את המשימה. אם התוצאה חלקית, ה-orchestrator יכול להחליט לשלוח agent נוסף להשלים.

### דוגמה: הפעלת Explorer sub-agent

```
Task: "חפש בכל ה-codebase שלנו את כל המקומות שמשתמשים
ב-database connection ישירות (לא דרך ORM).
תחזיר רשימה של קבצים עם שורות ספציפיות."

סוג: Explore
```

ה-Explorer ינווט בקבצים, יחפש patterns, ויחזיר תוצאה ממוקדת — בלי לגעת בשום דבר.

### דוגמה: הפעלת Coder sub-agent

```
Task: "קרא את הקובץ src/auth/middleware.ts
ותוסיף rate limiting של 100 requests per minute per IP.
השתמש ב-express-rate-limit."

סוג: Coder
```

ה-Coder יקרא, ישנה, ויוודא שהקוד עובד.

## הרשאות ומשאבים

### עקרון ה-Least Privilege

!!! warning "כלל זהב"
    כל sub-agent צריך לקבל **רק את ההרשאות שהוא צריך** למשימה. Agent שצריך רק לחפש — לא צריך הרשאת כתיבה. Agent שכותב tests — לא צריך גישה ל-production environment.

### מה אפשר לשלוט בו

**כלים זמינים** — לפי סוג ה-agent:

- **Read-only**: קריאת קבצים, חיפוש — בטוח לחלוטין
- **Read-write**: גם כתיבת קבצים — צריך להיזהר
- **Full access**: גם הרצת פקודות — הכי מסוכן

**Context** — מה ה-agent רואה:

- ה-prompt הספציפי שהוא קיבל
- חלק מהאורקסטרטורים חולקים context מהשיחה הראשית
- ככלל: **פחות context = יותר פוקוס**

**מגבלות** — גבולות על ה-agent:

- **Max turns** — מספר מקסימלי של iteraות (מונע loops אינסופיים)
- **Timeout** — מגבלת זמן
- **Working directory** — באיזו תיקייה הוא עובד

### טבלת הרשאות לפי סוג

**Explore Agent:**

- קריאת קבצים — כן
- חיפוש (search) — כן
- כתיבת קבצים — לא
- הרצת פקודות — לא

**Plan Agent:**

- קריאת קבצים — כן
- חיפוש (search) — כן
- כתיבת קבצים — לא
- הרצת פקודות — לא

**Coder Agent:**

- קריאת קבצים — כן
- חיפוש (search) — כן
- כתיבת קבצים — כן
- הרצת פקודות — כן

**General-purpose Agent:**

- קריאת קבצים — כן
- חיפוש (search) — כן
- כתיבת קבצים — כן
- הרצת פקודות — כן
- הפעלת sub-agents — כן

!!! warning "רקורסיה ב-General-purpose Agent"
    General-purpose Agent יכול להפעיל sub-agents שגם הם מסוג general-purpose — מה שיוצר רקורסיה. ברוב ה-frameworks יש **מגבלת עומק** (depth limit) שמונעת רקורסיה אינסופית. ב-SDK, השליטה היא דרך `maxTurns` — כל agent בשרשרת צורך turns, כך שה-budget הכולל מוגבל. אם אתם בונים orchestrator מותאם, הקפידו להגדיר מגבלת עומק מפורשת (למשל: sub-agent לא יכול להפעיל sub-agent מעומק 3 ומעלה).

## דפוסי תזמור

### דפוס 1: Fan-Out / Fan-In

**הרעיון:** שלח כמה agents במקביל, אסוף את התוצאות, ושלב.

```mermaid
graph TD
    O["Orchestrator"] --> A["Agent A:<br/>בדוק frontend"]
    O --> B["Agent B:<br/>בדוק backend"]
    O --> C["Agent C:<br/>בדוק infra"]
    A --> R["אסוף תוצאות<br/>וצור דוח"]
    B --> R
    C --> R
```

**מתי:** כשצריך לבצע אותה פעולה על חלקים שונים של ה-codebase.

**דוגמה — code review מקבילי:**
```
Orchestrator: "צריך לעשות code review ל-PR הזה"
  → Agent A: "בדוק את שינויי ה-frontend ב-src/components/"
  → Agent B: "בדוק את שינויי ה-backend ב-src/api/"
  → Agent C: "בדוק את שינויי ה-infrastructure ב-deploy/"
← Orchestrator: מרכיב review אחד מ-3 התוצאות
```

**דוגמה מפורטת — Security Audit מקבילי:**

תרחיש מציאותי: רוצים לבצע security audit מקיף על הפרויקט. במקום agent אחד שסורק הכל (ומאבד פוקוס), מפצלים ל-3 agents מתמחים שרצים במקביל:

```
Orchestrator: "בצע security audit מלא לפרויקט"
  → Agent A: "סרוק את כל ה-dependencies לפגיעויות ידועות (CVEs)"
  → Agent B: "חפש סיכוני code injection — SQL injection, XSS, command injection"
  → Agent C: "חפש secrets שנשארו בקוד — API keys, passwords, tokens"
← Orchestrator: מרכיב דוח אבטחה אחד עם כל הממצאים
```

```typescript
// Security audit עם Fan-Out
const [vulnerabilities, injectionRisks, secretLeaks] = await Promise.all([
  runSubAgent(
    `Scan all dependencies in package.json / package-lock.json.
     Check for known CVEs using the lock file versions.
     List every dependency with a known vulnerability,
     its severity (critical/high/medium/low), and recommended fix.`,
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 10 }
  ),
  runSubAgent(
    `Search the entire codebase for code injection risks:
     - SQL injection: raw SQL queries with string concatenation
     - XSS: unescaped user input rendered in HTML/templates
     - Command injection: shell commands built from user input
     For each finding, show the file, line, and suggested fix.`,
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 12 }
  ),
  runSubAgent(
    `Search for secrets and credentials leaked in the codebase:
     - API keys, tokens, passwords in source files
     - .env files committed to git
     - Hardcoded connection strings
     - Private keys or certificates
     Check .gitignore to see if sensitive files are properly excluded.`,
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 10 }
  ),
]);

// ה-orchestrator מרכיב דוח מאוחד
const report = await runSubAgent(
  `Compile a security audit report from these findings:

   ## Dependency Vulnerabilities
   ${vulnerabilities}

   ## Code Injection Risks
   ${injectionRisks}

   ## Secret Leaks
   ${secretLeaks}

   Prioritize by severity. Group related issues together.`,
  { allowedTools: ["read_file"], maxTurns: 5 }
);
```

כל agent מתמחה בסוג אחד של בעיית אבטחה, ולכן מדויק יותר מ-agent אחד שמנסה למצוא הכל.

### דפוס 2: Pipeline (שרשרת)

**הרעיון:** כל agent מקבל את התוצאה של הקודם ומוסיף עליה.

```mermaid
graph LR
    A["Agent A:<br/>חקור"] --> B["Agent B:<br/>תכנן"] --> C["Agent C:<br/>מימוש"] --> D["Agent D:<br/>בדוק"]
```

**מתי:** כשיש תלות בין השלבים — אי אפשר לכתוב קוד לפני שחקרנו.

**דוגמה — הוספת פיצ'ר:**
```
Agent A (Explore): "תמצא איך authentication עובד ב-codebase"
  → תוצאה: "Auth middleware ב-src/auth/, משתמש ב-JWT..."
Agent B (Plan): "על בסיס מה שמצאנו, תכנן הוספת 2FA"
  → תוצאה: "תוכנית: 1. הוסף TOTP library 2. עדכן user model..."
Agent C (Coder): "תממש את התוכנית הזו"
  → תוצאה: קבצים שנכתבו
Agent D (Coder): "תכתוב tests לקוד החדש"
  → תוצאה: קבצי test
```

**דוגמה מפורטת — מימוש פיצ'ר עם העברת context בין שלבים:**

הנקודה החשובה ב-Pipeline היא **מה בדיוק עובר בין השלבים**. כל agent צריך לקבל סיכום ממוקד, לא dump מלא:

```
Agent A (Explore) — "חקור את מערכת ה-notifications הקיימת"
  → מעביר הלאה:
    - רשימת קבצים רלוונטיים: src/notifications/, src/models/notification.ts
    - הטכנולוגיות: Redis pub/sub, PostgreSQL לשמירה
    - ה-API הקיים: POST /notify, GET /notifications/:userId
    - חסרונות שזוהו: אין תמיכה ב-batching, אין rate limiting

Agent B (Plan) — מקבל את הסיכום + המשימה "הוסף email notifications"
  → מעביר הלאה:
    - תוכנית מפורטת: 4 קבצים לשנות, 2 קבצים חדשים
    - סדר מימוש: model → service → controller → tests
    - interface מוגדר: EmailNotification { to, subject, template, vars }
    - סיכונים: צריך לוודא שה-email service לא חוסם את ה-event loop

Agent C (Coder) — מקבל את התוכנית המפורטת
  → מעביר הלאה:
    - רשימת קבצים שנוצרו/שונו עם תיאור קצר של כל שינוי
    - ה-interface הסופי שמומש
    - הערות על החלטות שנלקחו במימוש

Agent D (Coder) — מקבל רשימת שינויים + interfaces
  → תוצאה סופית: קבצי test שמכסים את כל ה-cases
```

המפתח להצלחה: כל שלב מחזיר **סיכום מובנה** שה-agent הבא יכול לפעול לפיו, לא סתם טקסט חופשי.

### דפוס 3: Supervisor

**הרעיון:** agent אחד מפקח על אחרים ומתערב כשצריך.

```mermaid
graph TD
    S["Supervisor Agent"] --> W1["Worker 1"]
    S --> W2["Worker 2"]
    W1 --> |"בעיה!"| S
    S --> |"הנחיות מתוקנות"| W1
    W2 --> |"סיימתי"| S
```

**מתי:** כשהמשימה דורשת התאמות תוך כדי עבודה.

**דוגמה — migration:**
```
Supervisor: "העבר את הפרויקט מ-JavaScript ל-TypeScript"
  → Worker 1: "המר את src/utils/ ל-TypeScript"
    ← "נתקלתי בבעיית types ב-3 קבצים"
  → Supervisor: מנתח את הבעיה, שולח הנחיות מתוקנות
  → Worker 1 (שוב): "המר עם ה-type definitions האלה"
  → Worker 2: "המר את src/components/ ל-TypeScript"
```

**מתי ה-Supervisor מתערב? דוגמה מפורטת:**

ה-Supervisor לא סתם "מפקח" — הוא בודק באופן אקטיבי את התוצאות של כל worker ומחליט אם להמשיך, לתקן, או לעצור. הנה מה שמפעיל התערבות:

- **בדיקת איכות:** התוצאה של ה-worker לא עומדת בסטנדרט (קוד לא עובר lint, חסרים error handlers)
- **זיהוי שגיאות:** ה-worker מדווח על בעיה שהוא לא יכול לפתור לבד
- **זיהוי קונפליקטים:** שני workers שינו קבצים בצורה סותרת
- **עדכון הנחיות:** מידע חדש שנחשף בשלב אחד משנה את ההנחיות לשלבים הבאים

```typescript
// Supervisor loop עם validation
async function supervisedMigration(directories: string[]) {
  const sharedTypes: string[] = []; // types שנוצרו ע"י workers קודמים

  for (const dir of directories) {
    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      const workerResult = await runSubAgent(
        `Convert ${dir} from JavaScript to TypeScript.
         Use these shared type definitions from previous conversions:
         ${sharedTypes.join("\n")}

         Return a JSON summary:
         { "convertedFiles": [...], "newTypes": [...], "errors": [...] }`,
        {
          allowedTools: ["read_file", "write_file", "list_files", "search_files", "run_command"],
          maxTurns: 20,
        }
      );

      // Supervisor בודק את התוצאה
      const validation = await runSubAgent(
        `Validate the TypeScript migration of ${dir}.
         Worker reported: ${workerResult}

         Check:
         1. Do all files compile? (run tsc --noEmit)
         2. Are there any 'any' types that should be specific?
         3. Are all imports updated correctly?

         Return: { "valid": true/false, "issues": [...] }`,
        {
          allowedTools: ["read_file", "list_files", "search_files", "run_command"],
          maxTurns: 10,
        }
      );

      if (validation.includes('"valid": true')) {
        success = true;
        // שמור types חדשים לשימוש workers הבאים
        const newTypes = extractTypes(workerResult);
        sharedTypes.push(...newTypes);
      } else {
        attempt++;
        console.log(
          `Supervisor: Worker output for ${dir} failed validation, ` +
          `retrying (attempt ${attempt}/3)`
        );
      }
    }

    if (!success) {
      console.error(
        `Supervisor: Failed to migrate ${dir} after 3 attempts, skipping`
      );
    }
  }
}
```

הלולאה של ה-Supervisor מבטיחה שכל שלב עובר validation לפני שממשיכים הלאה — ואם לא, ה-worker מקבל הזדמנות נוספת עם context מעודכן.

## פתרון קונפליקטים בין agents

כשמספר agents עובדים על אותו codebase, קונפליקטים הם בלתי נמנעים. חשוב להכיר את סוגי הקונפליקטים ולתכנן מראש איך למנוע אותם.

### קונפליקטים בקבצים (File Conflicts)

**הבעיה:** שני agents מנסים לשנות את אותו קובץ בו-זמנית. Agent A מוסיף function בשורה 50, ו-Agent B משנה import בשורה 3 — אבל כל אחד מהם קרא את הקובץ לפני שהשני כתב. התוצאה: השינוי של אחד מהם נדרס.

**פתרונות:**

- **הקצאה בלעדית:** חלקו קבצים בין agents מראש. Agent A אחראי על `src/auth/`, Agent B על `src/api/` — בלי חפיפה
- **השתמשו ב-Pipeline במקום Fan-Out:** אם שני agents צריכים לגעת באותו קובץ, שרשרו אותם — Agent A כותב קודם, Agent B מקבל את הגרסה המעודכנת
- **Orchestrator merge:** ה-orchestrator אוסף את השינויים המבוקשים משני ה-agents ומבצע agent שלישי שמיישם את כולם יחד

### קונפליקטים סמנטיים (Semantic Conflicts)

**הבעיה:** Agent A מוסיף function חדש `validateInput()` ויוצר קריאות אליו. Agent B עושה refactor ומוחק את הקובץ שבו Agent A ציפה שה-function יהיה, או משנה את ה-interface שה-function משתמש בו. כל agent עבד נכון בפני עצמו, אבל ביחד — הקוד שבור.

**פתרון:** הוסיפו **validation agent** שרץ אחרי כל ה-agents האחרים:

```typescript
// Validation agent שבודק עקביות אחרי כל השינויים
const validation = await runSubAgent(
  `All changes have been applied. Verify consistency:
   1. Run the TypeScript compiler (tsc --noEmit) and report errors
   2. Check that all imports resolve to existing files
   3. Check that all function calls match existing function signatures
   4. Run the test suite and report failures

   If there are issues, list each one with the file and line number.`,
  {
    allowedTools: ["read_file", "list_files", "search_files", "run_command"],
    maxTurns: 15,
  }
);
```

### קונפליקטים במשאבים (Resource Conflicts)

**הבעיה:** מספר agents מריצים `npm install` במקביל, או מנסים לעשות `git commit` בו-זמנית, או כותבים לאותו lock file. התוצאה: שגיאות file lock, מצב לא עקבי של `node_modules`, או corrupted git state.

**פתרון:** סדרו (serialize) פעולות שמשנות shared resources:

- הריצו `npm install` פעם אחת לפני שה-agents מתחילים
- אם agent צריך להתקין package, תנו לו לעדכן רק את `package.json` — וה-orchestrator יריץ `npm install` אחר כך
- פעולות git (commit, branch) — רק ב-orchestrator, אף פעם לא ב-sub-agents

!!! tip "כלל אצבע"
    אם agents צריכים לגעת באותם קבצים — השתמשו ב-**Pipeline**, לא ב-**Fan-Out**. Fan-Out בטוח רק כשכל agent עובד על קבצים נפרדים לחלוטין.

## השוואת ביצועים: agent בודד מול sub-agents

מתי multi-agent באמת משתלם מבחינת זמן? הנה הערכות גסות של זמני ביצוע:

- **משימה פשוטה** (עריכת קובץ בודד): Agent בודד ~30 שניות, Multi-agent ~90 שניות (ה-overhead של הקמת agents לא משתלם)
- **משימה בינונית** (3-5 קבצים): Agent בודד ~2 דקות, Multi-agent ~2 דקות (דומה — ה-overhead מתקזז עם המקביליות)
- **משימה מורכבת** (10+ קבצים, שינויים cross-cutting): Agent בודד ~5-8 דקות (או נכשל מ-context overflow), Multi-agent ~3-4 דקות (כאן המקביליות מנצחת)
- **משימה מאוד מורכבת** (פיצ'ר שלם, 20+ קבצים): Agent בודד לרוב נכשל (context overflow, אובד פוקוס), Multi-agent ~5-7 דקות (הדרך היחידה שעובדת)

!!! note "הערה חשובה"
    המספרים האלה הם **הערכות גסות** שתלויות בגורמים רבים: גודל ה-codebase, המודל שבשימוש (Sonnet vs Opus), מורכבות הקוד, מהירות ה-API, וכמה context כל agent צריך. השתמשו בהם כ-guideline כללי, לא כמדד מדויק. מומלץ למדוד בפרויקט שלכם.

## בטיחות: מניעת agents חסרי שליטה

כשמפעילים agents אוטונומיים, חשוב לוודא שהם לא גורמים נזק. הנה הסיכונים העיקריים ואיך למנוע אותם:

### מיצוי משאבים (Resource Exhaustion)

Agent שנתקע ב-loop אינסופי יכול לצרוך tokens ללא הגבלה. השתמשו ב-**הגנה כפולה**: `maxTurns` + timeout:

```typescript
// הגנה כפולה: maxTurns ברמת ה-agent + timeout ברמת הקוד
async function runSubAgentSafely(
  prompt: string,
  options: Partial<SubAgentOptions>
) {
  return Promise.race([
    runSubAgent(prompt, {
      ...options,
      maxTurns: options.maxTurns ?? 15, // הגנה ראשונה: מגבלת סיבובים
    }),
    timeout(120_000).then(() => {  // הגנה שנייה: 2 דקות timeout
      throw new Error("Sub-agent timed out after 120 seconds");
    }),
  ]);
}

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

גם אם `maxTurns` לא מספיק (Agent שכל turn לוקח לו הרבה זמן), ה-timeout יתפוס את זה.

### צריכת שטח דיסק

Agent עם הרשאות כתיבה יכול ליצור מספר גדול של קבצים — למשל, agent שמייצר tests יכול ליצור אלפי קבצים אם ה-prompt לא ברור. הגנות:

- **הגבלת working directory:** תנו ל-agent לעבוד רק בתיקייה ספציפית
- **מעקב אחרי מספר קבצים:** בדקו כמה קבצים נוצרו אחרי שה-agent סיים, ואם המספר חריג — בדקו ידנית
- **הרשאות מינימליות:** אם Agent לא חייב ליצור קבצים חדשים, תנו לו רק `Edit` (עריכת קבצים קיימים) בלי `Write`

### עלויות API שיוצאות משליטה

ב-multi-agent, העלויות יכולות לצמוח מהר. אם orchestrator מפעיל 5 agents שכל אחד מפעיל 3 sub-agents — זה 15 sessions של API calls:

```typescript
// מעקב אחר צריכת tokens כוללת — הוסיפו ל-runSubAgent
let totalTokensUsed = 0;
const TOKEN_BUDGET = 500_000; // תקציב מקסימלי

// בתוך הלולאה של runSubAgent, אחרי כל קריאה ל-client.messages.create:
//   totalTokensUsed += response.usage.input_tokens + response.usage.output_tokens;

async function runSubAgentWithBudget(
  prompt: string,
  options: Partial<SubAgentOptions>
): Promise<string> {
  if (totalTokensUsed >= TOKEN_BUDGET) {
    throw new Error(
      `Token budget exhausted: ${totalTokensUsed}/${TOKEN_BUDGET}`
    );
  }

  const result = await runSubAgent(prompt, options);

  console.log(
    `Token usage: ${totalTokensUsed}/${TOKEN_BUDGET} ` +
    `(${Math.round((totalTokensUsed / TOKEN_BUDGET) * 100)}%)`
  );

  return result;
}
```

### כשלונות מדורגים (Cascading Failures)

כש-Agent A מייצר output שגוי, ו-Agent B מקבל אותו כ-input — Agent B ייכשל גם כן, או גרוע מזה, יייצר קוד שגוי בלי לדעת. הפתרון: **validate intermediate results** לפני שמעבירים אותם הלאה:

```typescript
// Pipeline עם validation בין שלבים
const exploration = await runSubAgent("Explore the auth system...", {
  allowedTools: ["read_file", "list_files", "search_files"],
  maxTurns: 10,
});

// validation לפני שממשיכים לשלב הבא
if (!exploration || exploration.length < 100) {
  throw new Error("Exploration returned insufficient results, aborting pipeline");
}

// בדיקה שה-exploration מכיל מידע שימושי
if (!exploration.includes("src/") && !exploration.includes("file")) {
  throw new Error(
    "Exploration did not find any relevant files, aborting pipeline"
  );
}

// רק אם ה-validation עבר — ממשיכים לשלב הבא
const plan = await runSubAgent(
  `Based on this analysis: ${exploration}\n\nCreate a plan...`,
  { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 10 }
);
```

## טיפול בכשלונות

כשעובדים עם מספר sub-agents, כשלונות הם בלתי נמנעים. חשוב לתכנן מראש איך להתמודד איתם.

### סוגי כשלונות

- **כשל חלקי** — ה-sub-agent החזיר תוצאה, אבל לא השלים את כל המשימה (למשל: תיקן 3 מתוך 5 קבצים)
- **כשל מוחלט** — ה-sub-agent נכשל לחלוטין (timeout, שגיאת API, context מלא)
- **כשל שקט** — ה-sub-agent החזיר תוצאה שנראית תקינה, אבל היא שגויה (למשל: הקוד שכתב לא עובר compilation)

### אסטרטגיות טיפול

**1. Error propagation — העברת שגיאה למעלה:**

הדרך הפשוטה ביותר — אם sub-agent נכשל, ה-orchestrator מקבל את השגיאה ומחליט מה לעשות.

**2. Retry — ניסיון חוזר:**

לפעמים הכשל הוא זמני (rate limit, timeout). ניסיון חוזר עם אותו prompt יכול לעבוד.

**3. Graceful degradation — המשך עם מה שיש:**

ב-fan-out, אם 2 מתוך 3 agents הצליחו — אפשר להמשיך עם התוצאות החלקיות.

### דוגמת קוד: טיפול בכשלונות

```typescript
async function runSubAgentSafe(
  prompt: string,
  options?: Partial<SubAgentOptions>,
  retries = 2
): Promise<{ success: boolean; result: string; error?: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await runSubAgent(prompt, options);

      // בדיקה שהתוצאה לא ריקה
      if (!result || result.trim().length === 0) {
        throw new Error("Sub-agent returned empty result");
      }

      return { success: true, result };
    } catch (error) {
      console.warn(
        `Attempt ${attempt + 1} failed: ${error.message}`
      );

      if (attempt === retries) {
        return {
          success: false,
          result: "",
          error: `Failed after ${retries + 1} attempts: ${error.message}`,
        };
      }

      // המתנה לפני retry (exponential backoff)
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return { success: false, result: "", error: "Unexpected error" };
}

// שימוש ב-fan-out עם graceful degradation
async function parallelExploreWithFallback(task: string) {
  const results = await Promise.allSettled([
    runSubAgentSafe("Analyze project structure", {
      allowedTools: ["read_file", "list_files", "search_files"],
      maxTurns: 8,
    }),
    runSubAgentSafe("Analyze dependencies", {
      allowedTools: ["read_file", "list_files", "search_files"],
      maxTurns: 8,
    }),
    runSubAgentSafe("Find code patterns", {
      allowedTools: ["read_file", "list_files", "search_files"],
      maxTurns: 8,
    }),
  ]);

  // אסוף את התוצאות המוצלחות
  const successful = results
    .filter(
      (r) => r.status === "fulfilled" && r.value.success
    )
    .map((r) => (r as PromiseFulfilledResult<any>).value.result);

  const failed = results.filter(
    (r) =>
      r.status === "rejected" ||
      (r.status === "fulfilled" && !r.value.success)
  );

  if (successful.length === 0) {
    throw new Error("All sub-agents failed");
  }

  console.log(
    `${successful.length}/3 explorations succeeded` +
    (failed.length > 0
      ? ` (${failed.length} failed, continuing with partial results)`
      : "")
  );

  return successful;
}
```

## מודעות לעלויות

### למה זה חשוב ב-multi-agent?

כל sub-agent הוא **קריאת API נפרדת** עם ה-context שלו. המשמעות:

- **כל sub-agent מתחיל מאפס** — ה-system prompt, הכללים, וה-prompt הספציפי נשלחים מחדש
- **כל סיבוב (turn) של sub-agent = input + output tokens** — חקירה של 10 סיבובים יכולה לצרוך 50K-100K tokens
- **Fan-out מכפיל עלויות** — 3 agents במקביל = פי 3 עלות API (אבל שליש מהזמן)

### הערכות עלות גסות

- **Agent חקירה בודד** (Explore, 8-10 turns) — ~50K-100K tokens (~$0.15-$0.30 ב-Sonnet)
- **Agent כתיבה** (Coder, 15-20 turns) — ~100K-200K tokens (~$0.30-$1.00 ב-Sonnet)
- **Orchestrator מלא** (explore + plan + implement) — ~200K-500K tokens (~$1-$3 ב-Sonnet)
- **אותו orchestrator ב-Opus** — פי ~1.7 מ-Sonnet (~$1.7-$5)

### מתי שווה להשתמש ב-sub-agents?

**כן — שווה את העלות כש:**

- המשימה מורכבת ו-agent בודד נכשל או מייצר תוצאה גרועה
- החיסכון בזמן מפתח גדול מעלות ה-API
- צריך הפרדת הרשאות (read-only חקירה לפני כתיבה)
- ה-context window של agent בודד לא מספיק

**לא — חיסכון מיותר כש:**

- המשימה פשוטה (שינוי בקובץ אחד, refactor קטן)
- אתם בתקציב מוגבל ויכולים לעשות את העבודה ב-agent בודד
- ה-overhead של context transfer גדול מהמשימה עצמה

!!! tip "טיפ לחיסכון"
    התחילו תמיד עם agent בודד. רק אם הוא נכשל, מייצר תוצאה חלקית, או שה-context מתמלא — עברו ל-multi-agent. אל תתחילו עם orchestrator מורכב למשימה שאפשר לפתור ב-prompt אחד.

## תרגיל מעשי 1: חקירה מקבילית — אתם ה-Orchestrator (30 דקות)

### התרחיש

לפני שנבנה orchestrator בקוד, נרגיש את הדפוס על הידיים: **אתם** תהיו ה-orchestrator, ושלושה סשנים מקביליים של Kiro CLI יהיו ה-sub-agents.

### שלב 1 — שכפול פרויקט והגדרת Explorer agent

```bash
git clone https://github.com/expressjs/express.git ~/missions/subagent-lab
cd ~/missions/subagent-lab
mkdir -p .kiro/agents
```

צרו `.kiro/agents/explorer.json` — agent חקירה read-only (כמו שלמדנו במודול 9):

```json
{
  "name": "explorer",
  "description": "Read-only codebase explorer. Returns focused, structured summaries.",
  "prompt": "You are a codebase exploration agent. Answer the user's question about the codebase by reading and searching files. You must NOT modify anything. Return a concise, structured summary: relevant files, key findings, and open questions.",
  "tools": ["read"],
  "allowedTools": ["read"]
}
```

### שלב 2 — Fan-Out: שלושה sub-agents במקביל

פתחו **שלושה terminals**, בכל אחד הריצו `kiro-cli --agent explorer` באותה תיקייה, ותנו לכל אחד שאלה אחרת:

- Terminal 1: "מה המבנה הכללי של התיקיות ומהם הקבצים החשובים?"
- Terminal 2: "מהם ה-dependencies העיקריים ומה כל אחד עושה?"
- Terminal 3: "איך מערכת ה-routing עובדת? עקוב אחרי הקוד מה-entry point"

### שלב 3 — Fan-In: מיזוג התוצאות

פתחו סשן רביעי (רגיל, בלי `--agent`) והדביקו את שלושת הסיכומים:

```
"הנה שלושה דוחות חקירה על הפרויקט: [הדביקו]
תמזג אותם לסקירה מאורגנת אחת של הפרויקט."
```

שימו לב:

- כמה מהר שלוש חקירות מקביליות הסתיימו לעומת אחת סדרתית?
- האם ה-explorer ניסה לחרוג מההרשאות שלו?
- כמה עבודה ידנית הייתה בהעברת התוצאות בין הסשנים? **בדיוק את זה נאטמט בתרגיל 2.**

## תרגיל מעשי 2: בניית Orchestrator (55 דקות)

### המטרה

נבנה orchestrator שמתזמר sub-agents — **הרחבה ישירה של ה-agent שבנינו במודול 6**. הפונקציה המרכזית, `runSubAgent`, היא בדיוק אותו agent loop, רק עטוף כך שאפשר להריץ אותו כמה פעמים עם prompts, כלים ומגבלות שונים.

!!! info "מה צריך"
    - `ANTHROPIC_API_KEY` מוגדר (כמו במודול 6)
    - `npm install @anthropic-ai/sdk` ו-`npm install -D tsx typescript @types/node`

### שלב 1 — שלד הקוד

צרו פרויקט חדש:

```bash
mkdir ~/missions/orchestrator && cd $_
kiro-cli
```

בקשו מ-Kiro CLI:

```
"צור פרויקט TypeScript עם קובץ orchestrator.ts ריק.
התקן את @anthropic-ai/sdk, tsx, typescript ו-@types/node."
```

### שלב 2 — מימוש runSubAgent

הנה הלב של ה-orchestrator — agent loop כמו במודול 6, עם שני שינויים: הכלים מסוננים לפי `allowedTools`, ויש תקרת `maxTurns`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

// ===== ארגז הכלים המלא (כמו במודול 6, עם שני כלים נוספים) =====

const ALL_TOOLS: Record<string, Anthropic.Tool> = {
  read_file: {
    name: "read_file",
    description: "Read the contents of a file",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" } },
      required: ["path"],
    },
  },
  list_files: {
    name: "list_files",
    description: "List files in a directory (recursively, up to 200 entries)",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string", description: "Directory path, default: current dir" } },
      required: [],
    },
  },
  search_files: {
    name: "search_files",
    description: "Search for a text pattern in files under a directory",
    input_schema: {
      type: "object" as const,
      properties: {
        pattern: { type: "string" },
        path: { type: "string", description: "Directory to search, default: current dir" },
      },
      required: ["pattern"],
    },
  },
  write_file: {
    name: "write_file",
    description: "Write content to a file (creates it if missing)",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" }, content: { type: "string" } },
      required: ["path", "content"],
    },
  },
  run_command: {
    name: "run_command",
    description: "Run a shell command and return its output",
    input_schema: {
      type: "object" as const,
      properties: { command: { type: "string" } },
      required: ["command"],
    },
  },
};

// עזר: רשימת קבצים רקורסיבית (בלי node_modules/.git)
function listFilesRecursive(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (acc.length >= 200) break;
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFilesRecursive(full, acc);
    else acc.push(full);
  }
  return acc;
}

// עזר: חיפוש טקסט בקבצים (cross-platform, בלי תלות ב-grep)
function searchInFiles(pattern: string, dir: string): string {
  const matches: string[] = [];
  for (const file of listFilesRecursive(dir)) {
    let content: string;
    try { content = fs.readFileSync(file, "utf-8"); } catch { continue; }
    content.split("\n").forEach((line, i) => {
      if (line.includes(pattern) && matches.length < 100) {
        matches.push(`${file}:${i + 1}: ${line.trim()}`);
      }
    });
  }
  return matches.length ? matches.join("\n") : "No matches found";
}

function executeTool(name: string, input: any): string {
  switch (name) {
    case "read_file":
      return fs.readFileSync(input.path, "utf-8");
    case "list_files":
      return listFilesRecursive(input.path ?? ".").join("\n");
    case "search_files":
      return searchInFiles(input.pattern, input.path ?? ".");
    case "write_file":
      fs.writeFileSync(input.path, input.content);
      return `File written to ${input.path}`;
    case "run_command":
      try {
        return execSync(input.command, { encoding: "utf-8", timeout: 30000 });
      } catch (error: any) {
        return `Command failed: ${error.message}\n${error.stderr ?? ""}`;
      }
    default:
      return `Unknown tool: ${name}`;
  }
}

// ===== runSubAgent — agent loop עם כלים מסוננים ותקרת turns =====

interface SubAgentOptions {
  allowedTools: string[];
  maxTurns: number;
}

async function runSubAgent(
  prompt: string,
  options?: Partial<SubAgentOptions>
): Promise<string> {
  const { allowedTools, maxTurns }: SubAgentOptions = {
    allowedTools: ["read_file", "list_files", "search_files"], // read-only by default
    maxTurns: 10,
    ...options,
  };

  // ה-sub-agent מקבל רק את הכלים שהותרו לו — least privilege
  const tools = allowedTools.map((name) => ALL_TOOLS[name]);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: prompt }];

  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4096,
      tools,
      messages,
    });
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      // ה-agent סיים — מחזירים את הטקסט הסופי
      return response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.TextBlock).text)
        .join("\n");
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = response.content
      .filter((b) => b.type === "tool_use")
      .map((block: any) => {
        console.log(`  🔧 ${block.name}(${JSON.stringify(block.input).slice(0, 80)})`);
        let result: string;
        try {
          result = executeTool(block.name, block.input);
        } catch (error: any) {
          result = `Error: ${error.message}`;
        }
        return { type: "tool_result", tool_use_id: block.id, content: result };
      });

    messages.push({ role: "user", content: toolResults });
  }

  return "[maxTurns reached — partial result] The agent ran out of turns before finishing.";
}

// ה-orchestrator
async function orchestrate(task: string) {
  console.log(`📋 Task: ${task}\n`);

  // שלב 1: חקירה
  console.log("🔍 Phase 1: Exploring...");
  const exploration = await runSubAgent(
    `Explore this codebase and answer: ${task}
     Focus on understanding the structure, key files, and patterns.
     Return a concise summary.`,
    {
      allowedTools: ["read_file", "list_files", "search_files"],  // read-only
      maxTurns: 15,
    }
  );
  console.log("✅ Exploration complete\n");

  // שלב 2: תכנון (על בסיס החקירה)
  console.log("📐 Phase 2: Planning...");
  const plan = await runSubAgent(
    `Based on this analysis of the codebase:
     ${exploration}

     Create a detailed implementation plan for: ${task}

     Include:
     - Which files to modify
     - What changes to make in each file
     - Order of operations
     - Potential risks`,
    {
      allowedTools: ["read_file", "list_files", "search_files"],  // still read-only
      maxTurns: 10,
    }
  );
  console.log("✅ Plan ready\n");

  // שלב 3: מימוש (עם הרשאות כתיבה!)
  console.log("💻 Phase 3: Implementing...");
  const implementation = await runSubAgent(
    `Execute this plan:
     ${plan}

     Write the code changes. Follow existing code style.`,
    {
      allowedTools: ["read_file", "write_file", "list_files", "search_files", "run_command"],
      maxTurns: 20,
    }
  );
  console.log("✅ Implementation complete\n");

  console.log("📊 Summary:");
  console.log(implementation);
}

// הרצה
const task = process.argv[2] || "Add input validation to all API endpoints";
orchestrate(task);
```

### שלב 3 — הבנת ההרשאות

שימו לב למבנה ההרשאות:

```typescript
// Phase 1 & 2: read-only — בטוח לחלוטין
allowedTools: ["read_file", "list_files", "search_files"]

// Phase 3: full access — רק כאן צריך כתיבה
allowedTools: ["read_file", "write_file", "list_files", "search_files", "run_command"]
```

!!! warning "למה זה חשוב?"
    שלב החקירה והתכנון **לא יכולים** לשנות קבצים — גם אם ה-model ינסה. זה מונע שינויים מקריים לפני שהתוכנית מוכנה.

### שלב 4 — הרחבה: agents מקביליים

שנו את ה-orchestrator כדי שחקירה של חלקים שונים תרוץ **במקביל**:

```typescript
// במקום חקירה אחת — 3 חקירות מקביליות
console.log("🔍 Phase 1: Parallel exploration...");

const [structure, dependencies, patterns] = await Promise.all([
  runSubAgent(
    "Map the directory structure. What are the key directories and entry points?",
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 8 }
  ),
  runSubAgent(
    "Analyze package.json / requirements.txt. What are the main dependencies and what does each do?",
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 8 }
  ),
  runSubAgent(
    "Find the main code patterns: how is error handling done? Authentication? Database access?",
    { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 8 }
  ),
]);

console.log("✅ All explorations complete\n");

// שלב התכנון מקבל את כל הממצאים
const plan = await runSubAgent(
  `Based on this analysis:

   ## Structure
   ${structure}

   ## Dependencies
   ${dependencies}

   ## Patterns
   ${patterns}

   Create an implementation plan for: ${task}`,
  { allowedTools: ["read_file", "list_files", "search_files"], maxTurns: 10 }
);
```

### שלב 5 — הריצו ובדקו

```bash
npx tsx orchestrator.ts "Add error handling middleware"
```

שימו לב ל:

- כמה זמן לוקח כל שלב
- האם ה-agents המקביליים באמת חוסכים זמן
- איכות התוצאה לעומת agent בודד

## הגדרות מתקדמות של sub-agents

### שליטה ב-allowed tools

```typescript
// agent שיכול רק לחפש — אפילו לא לקרוא קבצים שלמים
const searchOnly: SubAgentOptions = {
  allowedTools: ["list_files", "search_files"],
  maxTurns: 5,
};

// agent שיכול לקרוא ולכתוב אבל לא להריץ פקודות
const readWrite: SubAgentOptions = {
  allowedTools: ["read_file", "write_file", "list_files", "search_files"],
  maxTurns: 15,
};

// agent עם גישה מלאה — כולל הרצת shell commands
const fullAccess: SubAgentOptions = {
  allowedTools: ["read_file", "write_file", "list_files", "search_files", "run_command"],
  maxTurns: 25,
};
```

### הגבלת iterations

```typescript
const cautious: Partial<SubAgentOptions> = {
  maxTurns: 5,   // מקסימום 5 סיבובים — למשימות קצרות
};

const thorough: Partial<SubAgentOptions> = {
  maxTurns: 30,  // יותר סיבובים — למשימות מורכבות
};
```

### העברת context

Sub-agent מקבל **רק** את ה-prompt שנשלח אליו. הוא **לא רואה** את היסטוריית השיחה של ה-orchestrator, קבצים שנקראו בשלבים קודמים, או תוצאות של sub-agents אחרים — אלא אם כן כוללים את המידע הזה במפורש ב-prompt.

**מה כן מועבר:**

- ה-prompt המלא שנשלח ל-`runSubAgent` — וזה הכל
- (בכלים מסחריים כמו Kiro CLI, sub-agent מקבל אוטומטית גם את קבצי ה-steering של הפרויקט והגדרות ה-MCP — ב-orchestrator שלנו, אם רוצים את זה, צריך לכלול את התוכן ב-prompt)

**מה לא מועבר:**

- היסטוריית הודעות מהשיחה הראשית
- תוצאות של sub-agents אחרים (אלא אם שולחים אותן ב-prompt)
- state פנימי של ה-orchestrator
- קבצים שנקראו בשלבים קודמים (ה-agent יצטרך לקרוא אותם מחדש אם צריך)

לכן, אם sub-agent צריך תוצאות משלב קודם — חובה לכלול אותן ב-prompt:

```typescript
// sub-agent שמקבל context מהשיחה הראשית
const contextAware = await runSubAgent(
  `You have the following context from the main conversation:
   - Project: ${projectName}
   - Language: TypeScript
   - Framework: Express
   - User request: ${userRequest}

   Previous exploration found:
   ${explorationResult}

   Now do: analyze the authentication system`,
  { allowedTools: ["read_file", "list_files", "search_files"] }
);
```

!!! warning "שימו לב לגודל ה-prompt"
    אם כוללים תוצאות של sub-agents קודמים ב-prompt, הוא יכול להיות גדול מאוד. זה צורך tokens ועלויות. העבירו רק את המידע ההכרחי — סיכום ממוקד ולא dump מלא.

## מתי להשתמש ב-sub-agents?

### כן — sub-agents מתאימים כש:

- **המשימה מורכבת** ויש חלקים עצמאיים שאפשר להקביל
- **צריך הפרדת הרשאות** — שלב חקירה read-only לפני שלב כתיבה
- **ה-context window מתמלא** — פיצול מאפשר context נקי לכל חלק
- **רוצים ביצוע מקבילי** — חקירת חלקים שונים בו-זמנית

### לא — אל תשתמשו ב-sub-agents כש:

- **המשימה פשוטה** — "תשנה את שם המשתנה" לא צריך 3 agents
- **יש תלות חזקה בין השלבים** — sub-agents מוסיפים overhead של context transfer
- **הביצועים קריטיים** — כל sub-agent הוא API call נוסף (עלות + latency)
- **ה-agent הראשי מסתדר** — אם הכל עובד טוב עם agent אחד, אל תסבכו

!!! tip "כלל אצבע"
    אם המשימה לוקחת ל-agent בודד יותר מ-15-20 tool calls — שקלו לפצל ל-sub-agents. אם פחות — agent בודד עדיף.

!!! warning "פתרון בעיות נפוצות (Troubleshooting)"
    **Sub-agent לא מתנהג כמצופה:**

    - בדקו שה-prompt מספיק ספציפי — sub-agent לא רואה את ההקשר של השיחה הראשית
    - conventions של הפרויקט לא נטענים אוטומטית ב-orchestrator שלנו — כללו אותם ב-prompt של ה-sub-agent
    - נסו להריץ את ה-prompt של ה-sub-agent ישירות (לא דרך orchestrator) כדי לראות את ההתנהגות

    **Infinite loops — agent שלא מסיים:**

    - הגדירו תמיד `maxTurns` — בלי זה, agent יכול לרוץ ללא הגבלה
    - הוסיפו timeout ברמת הקוד: `Promise.race([runSubAgent(...), timeout(60000)])`
    - אם agent חוזר על אותה פעולה — כנראה ה-prompt לא ברור מספיק לגבי תנאי העצירה
    - שימו לב: `maxTurns: 5` אומר 5 סבבי API. משימה שדורשת לקרוא כמה קבצים, לכתוב, ולהריץ בדיקות — יכולה בקלות לצרוך את כולם

    **Context לא מועבר בין agents:**

    - זה by design — כל sub-agent מתחיל עם context נקי
    - אם צריך תוצאות משלב קודם, כללו אותן ב-prompt של ה-agent הבא
    - העבירו **סיכום** ולא את כל הטקסט — חוסך tokens ומשפר פוקוס
    - אם ה-context transfer גדול מדי, שקלו לכתוב את התוצאות לקובץ זמני שה-agent הבא יקרא

    **Debugging tips:**

    - הוסיפו logging לכל שלב: `console.log("Agent prompt:", prompt.substring(0, 200))`
    - הריצו כל sub-agent בנפרד לפני שמחברים את ה-orchestrator
    - השתמשו ב-`maxTurns` נמוך בפיתוח (3-5) כדי לחסוך עלויות וזמן
    - `runSubAgent` כבר מדפיס כל tool call — עקבו אחרי הפלט כדי לראות מה ה-agent באמת עושה

## שאלות לדיון

1. איך מחליטים כמה sub-agents להפעיל ואיך לחלק את העבודה?
2. מה קורה כש-sub-agent נכשל באמצע? איך ה-orchestrator צריך לטפל בזה?
3. למה חשוב לתת ל-exploration agents רק הרשאות read-only?
4. מה היתרון של `Promise.all` על agents, ומה הסיכון?
5. איך sub-agents משנים את עלות השימוש ב-API? מתי זה שווה את ההשקעה?

## נקודות מפתח

- **Sub-agents** הם agents שרצים בתוך agent אחר — כל אחד עם context נקי, כלים מוגדרים ומשימה ספציפית
- **Orchestrator** הוא ה-agent הראשי שמחלק משימות, אוסף תוצאות ומרכיב תשובה
- **הרשאות** — כל sub-agent צריך לקבל רק את הכלים שהוא צריך (least privilege)
- **דפוסי תזמור**: Fan-out (מקבילי), Pipeline (סדרתי), Supervisor (עם פיקוח)
- **מקביליות** עם `Promise.all` חוסכת זמן כשהמשימות עצמאיות
- **אל תסבכו** — agent בודד שעובד טוב עדיף על מערכת multi-agent מיותרת
- orchestrator הוא לא קסם — בנינו אחד שלם עם ה-Anthropic SDK, כהרחבה של ה-agent loop ממודול 6
