# מודול 2: עבודה עם כלי פיתוח מבוססי AI

!!! info "משך"
    30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- לנווט בביטחון בכלי פיתוח AI (Kiro, Cursor, Claude Code, Windsurf וכו׳)
- להבין את העקרונות המשותפים לכל הכלים — בלי קשר לכלי הספציפי
- לנהל context, הרשאות, כללים וסשנים בצורה יעילה
- להרחיב את יכולות הכלי עם MCP servers

!!! tip "למה עקרונות ולא כלי ספציפי?"
    הכלים משתנים כל כמה חודשים. העקרונות נשארים. מי שמבין את הבסיס יכול לעבור בין כלים בקלות.

## הממשק — מה יש בפנים

### הפאנל של ה-Agent

כל כלי AI לפיתוח מכיל פאנל שבו מתנהלת האינטראקציה עם המודל. בין אם זה sidebar ב-IDE או terminal ב-CLI — העקרונות זהים:

- **שדה קלט** — כאן כותבים את ההנחיה (prompt)
- **היסטוריית שיחה** — ההודעות ההלוך-חזור בין המשתמש למודל
- **פעולות בזמן אמת** — הכלי מראה מה הוא עושה (קורא קובץ, כותב, מריץ פקודה)
- **אזור אישורים** — חלק מהפעולות דורשות אישור לפני ביצוע

**ב-Kiro** זה ה-AI Panel שנפתח בצד. **ב-Cursor** זה ה-Composer/Chat. **ב-Claude Code** זה ה-terminal עצמו.

### השוואת כלי פיתוח AI פופולריים

יש היום כמה כלים מרכזיים בשוק. הנה סקירה של כל אחד — מה שחשוב לדעת כדי לבחור את המתאים לכם:

- **Kiro**
    - **סוג:** IDE מבוסס VS Code (fork)
    - **חוזקות עיקריות:** מצב Spec לתכנון מובנה (דרישות → design → קוד), skills מובנים, integration עם AWS
    - **מתאים במיוחד ל:** צוותים שרוצים workflow מובנה מתכנון עד מימוש, פרויקטים עם דרישות ברורות
    - **תמיכה במודלים:** Claude Sonnet, Claude Opus (דרך Amazon Bedrock)

- **Cursor**
    - **סוג:** IDE מבוסס VS Code (fork)
    - **חוזקות עיקריות:** Composer חזק לעריכות multi-file, Tab autocomplete מצוין, Cmd+K לעריכות inline
    - **מתאים במיוחד ל:** מפתחים שרוצים AI משולב בתוך IDE מוכר עם חוויית עריכה חלקה
    - **תמיכה במודלים:** Claude Sonnet, Claude Opus, GPT-4o, Gemini, ועוד — מגוון רחב של ספקים

- **Claude Code**
    - **סוג:** CLI (כלי שורת פקודה)
    - **חוזקות עיקריות:** agentic לחלוטין — קורא, כותב, מריץ פקודות באופן עצמאי. אין ממשק גרפי שמגביל. SDK לבניית agents מותאמים
    - **מתאים במיוחד ל:** מפתחים שאוהבים terminal, משימות אוטומציה, CI/CD pipelines, בניית multi-agent systems
    - **תמיכה במודלים:** Claude Sonnet, Claude Opus (ישירות מ-Anthropic)

- **Windsurf**
    - **סוג:** IDE מבוסס VS Code (fork)
    - **חוזקות עיקריות:** Cascade flow — שיחה שמתורגמת לפעולות על הקוד, מעקב context אוטומטי טוב
    - **מתאים במיוחד ל:** מפתחים שרוצים חוויה conversational חלקה עם הבנת context טובה
    - **תמיכה במודלים:** Claude Sonnet, GPT-4o, ועוד

- **GitHub Copilot**
    - **סוג:** Extension ל-VS Code ול-IDEs אחרים + CLI
    - **חוזקות עיקריות:** autocomplete מהיר ומדויק, integration טבעי עם GitHub (PRs, issues, Actions), Agent mode עם שיפורים משמעותיים
    - **מתאים במיוחד ל:** צוותים שכבר עובדים עם GitHub ecosystem, מפתחים שרוצים autocomplete חכם בלי להחליף IDE
    - **תמיכה במודלים:** Claude Sonnet, Claude Opus, GPT-4o, Gemini — תמיכה רחבה

!!! note "הכלים משתנים מהר"
    ההשוואה הזו מדויקת לתאריך הכתיבה. כלים מוסיפים יכולות כל כמה שבועות. העיקרון החשוב: כולם בנויים על אותם עקרונות בסיסיים (context, rules, permissions, agent loop) — ולכן מי שמבין עקרון אחד, יכול לעבור בין כלים בקלות.

### מבט על הפאנל — Kiro כדוגמה

![פאנל ה-AI ב-Kiro](../assets/kiro-panel.jpg){ width="380" }

<div class="annotated-panel" markdown>

| # | אזור | תפקיד |
|---|---|---|

1. **ניהול סשנים** (למעלה) — פתיחת סשן חדש, היסטוריית סשנים, טיימר
2. **בחירת מצב עבודה** — **Vibe** (chat חופשי → build) או **Spec** (תכנון → דרישות → קוד). רוב הכלים מציעים וריאציה של זה
3. **שדה קלט** (למטה) — כאן כותבים את ה-prompt. כולל:
      - `#` — הוספת context (קבצים, סמלים, תיקיות)
      - צירוף תמונות — screenshots, דיאגרמות, UI mockups
      - `○` — בחירת כללים (rules) רלוונטיים לשיחה
4. **בורר מודל** — `Auto` בוחר אוטומטית, אפשר לשנות ל-Claude Sonnet/Opus וכו׳
5. **Autopilot toggle** — כשפעיל, המודל מבצע פעולות בלי לבקש אישור (כמו YOLO mode). כשכבוי — מבקש אישור לכל כתיבה/הרצה

</div>

!!! note "נראה שונה בכלי אחר?"
    הממשק משתנה, אבל **כל הרכיבים האלה קיימים בכל כלי**. ב-Cursor יש Composer עם בורר מודל ו-context. ב-Claude Code הכל דרך ה-terminal עם flags ו-slash commands. העקרון זהה.

### בחירת מודל

רוב הכלים מאפשרים לבחור איזה מודל לעבוד איתו:

- **Claude Sonnet** — מהיר, חסכוני, מספיק לרוב המשימות
- **Claude Opus** — חכם יותר, איטי יותר, למשימות מורכבות
- **GPT-4o, Gemini** — חלק מהכלים תומכים גם במודלים של ספקים אחרים

!!! warning "טיפ חשוב"
    אל תבחרו תמיד את המודל הכי חזק. Sonnet מספיק ל-80% מהמשימות, ואתם חוסכים עלויות וזמן.

### מודעות לעלויות

כלי AI לפיתוח עולים כסף — בין אם דרך מנוי חודשי ובין אם לפי שימוש (API). חשוב להבין את מבנה העלויות:

| מודל | רמת עלות | עלות משוערת (API, לכל מיליון tokens) | מתאים ל- |
|---|---|---|---|
| **Claude Sonnet** | נמוכה | ~$3 input / ~$15 output | רוב המשימות היומיומיות |
| **Claude Opus** | גבוהה | ~$15 input / ~$75 output | משימות מורכבות, ארכיטקטורה, debugging קשה |
| **GPT-4o** | בינונית | ~$2.5 input / ~$10 output | אלטרנטיבה, תלוי בכלי |

!!! info "Context window = עלות"
    ככל שה-context window מלא יותר, כל הודעה עולה יותר — כי המודל צריך "לקרוא" את כל ה-context מחדש בכל תשובה. סשן ארוך עם context מלא יכול לעלות פי 10 מסשן קצר וממוקד.

**טיפים לחיסכון:**

- התחילו עם **Sonnet** ועברו ל-Opus רק כשצריך
- פתחו **סשנים קצרים וממוקדים** — סשן ארוך = context גדול = עלות גבוהה
- צרפו רק קבצים רלוונטיים ל-context — לא "הכל"
- השתמשו ב-**rules** טובים כדי להפחית הלוך-חזור (iterations) מיותרים
- אם יש לכם מנוי חודשי (כמו Cursor Pro או Kiro), שימו לב למגבלות השימוש

## ניהול Context

### למה Context חשוב?

המודל יודע **רק** מה שנמצא ב-context window שלו. אם הוא לא רואה את הקובץ — הוא לא יודע מה יש בו. כל מה שלא ב-context כאילו לא קיים.

### צירוף קבצים

כל הכלים מאפשרים לצרף קבצים ל-context בצורה כזו או אחרת:

- **Kiro / Cursor** — גררו קובץ לפאנל, או השתמשו ב-`@` כדי לציין קובץ
- **Claude Code** — הכלי קורא קבצים אוטומטית לפי הצורך, או ציינו נתיב ב-prompt
- **כולם** — אפשר לצרף תמונות (screenshots, דיאגרמות), URLs, ואפילו שגיאות מה-terminal

### מעקב אחרי ה-Context

ה-context window מוגבל. כשהוא מתמלא, קורים דברים רעים:

- המודל "שוכח" דברים מתחילת השיחה
- האיכות של התשובות יורדת
- חלק מהכלים עושים compression אוטומטי (מסכמים הודעות ישנות). בפרקטיקה, ה-compression שומר על הנחיות מערכת (system prompt), כללי הפרויקט, וסיכום תמציתי של ההחלטות והפעולות שנעשו — אבל מוותר על פרטים כמו קוד מלא שהוצג קודם, ניסויים שנכשלו, ודיאלוגים ארוכים של הבהרות. המשמעות: אחרי compression, ייתכן שהמודל "ישכח" שהוא כבר ניסה גישה מסוימת ולא עבדה, או יאבד הקשר של שינויים ספציפיים שבוצעו מוקדם בסשן.

**איך לעקוב:**

- **Kiro** — מראה אינדיקטור של ניצול ה-context
- **Claude Code** — מציג את מספר ה-tokens בשורת הסטטוס
- **Cursor** — מראה כמה context נשאר

> כשאתם מרגישים שהמודל "הולך לאיבוד" — זה בדרך כלל בגלל שה-context התמלא. פתחו סשן חדש.

## ניהול סשנים ו-Snapshots

### סשנים

סשן = שיחה אחת עם המודל. כללי אצבע:

- **משימה אחת = סשן אחד** — אל תערבבו נושאים
- **סשן ארוך מדי = תוצאות גרועות** — אחרי 30-50 הודעות, שקלו להתחיל מחדש
- **סשן חדש לא אומר לאבד context** — אפשר לתת למודל סיכום של מה שקרה בסשן הקודם

### Snapshots

חלק מהכלים (Cursor, Kiro) שומרים snapshots — נקודות שחזור של הקבצים:

- לפני כל שינוי משמעותי, הכלי שומר את המצב הקודם
- אם המודל שבר משהו, אפשר לחזור ל-snapshot
- זה כמו `git stash` אוטומטי — רשת ביטחון חשובה

!!! tip "טיפ"
    גם אם יש snapshots, עדיין עשו `git commit` לפני שאתם נותנים למודל לעשות שינויים גדולים. Snapshots הם רשת ביטחון נוספת, לא תחליף ל-version control.

## כללים (Rules)

### מה זה?

קבצי כללים הם הוראות קבועות שנטענים אוטומטית בכל סשן. הם אומרים למודל:

- איזה סגנון קוד לשמור (tabs/spaces, naming conventions)
- אילו frameworks וכלים לעדיף
- מה לא לעשות (למשל: "אל תשתמש ב-any ב-TypeScript")
- מבנה הפרויקט ודפוסים קיימים

### השמות משתנים, העיקרון אחד

- **Kiro** — קבצי `.kiro/rules/`
- **Claude Code** — `CLAUDE.md` בשורש הפרויקט
- **Cursor** — `.cursor/rules/` או `.cursorrules`
- **Windsurf** — `.windsurfrules`

### דוגמה לקובץ כללים

```markdown
# Project Rules

## Stack
- TypeScript with strict mode
- React 19 + Next.js 15
- Tailwind CSS for styling
- Prisma for database

## Conventions
- Use named exports, not default exports
- Error handling: use Result type pattern, not try/catch
- Tests: vitest, co-located with source files (*.test.ts)
- Always use Hebrew for user-facing strings

## Do NOT
- Use `any` type
- Add console.log (use the logger utility)
- Install new dependencies without asking
```

**מה טוב בדוגמה הזו?** הכללים **ספציפיים ואקציוניים** — המודל יודע בדיוק מה לעשות ומה לא. הם מחולקים לקטגוריות ברורות (stack, conventions, do NOT), קצרים וממוקדים, ולא סותרים אחד את השני.

### דוגמה לקובץ כללים גרוע

```markdown
# Rules

- Write good code
- Follow best practices
- Make sure everything works
- Use modern technologies
- Be consistent
- Don't write bad code
- Always add comments to everything
- Never add comments (they clutter the code)
- Use functional programming
- Use OOP design patterns
- Always use TypeScript strict mode
- It's OK to use `any` when it's convenient
- Test everything thoroughly
- Use Jest for testing
- Use Vitest for testing
- Use Mocha for testing
- Make sure the code is clean
- Follow SOLID principles
- Use dependency injection
- Keep functions small
- Don't over-engineer
- Always handle errors
- Performance is the top priority
- Readability is the top priority
- Always optimize for bundle size
```

**למה זה גרוע?**

- **כללים מעורפלים** — "Write good code" ו-"Follow best practices" לא אומרים למודל כלום. הוא צריך הנחיות קונקרטיות
- **סתירות** — "Always add comments" מול "Never add comments", "Use `any` when convenient" מול "TypeScript strict mode", שלושה frameworks שונים ל-testing
- **יותר מדי כללים** — 20+ כללים גנריים יוצרים רעש. המודל לא יודע מה באמת חשוב. עדיף 8-12 כללים ספציפיים מאשר 25 כללים מעורפלים
- **אין היררכיה** — הכל ברשימה שטוחה, בלי קטגוריות. קשה למודל לדעת מה קריטי ומה nice-to-have
- **עדיפויות סותרות** — "Performance is the top priority" מול "Readability is the top priority". אם הכל top priority — שום דבר לא top priority

!!! tip "כלל אצבע לכתיבת rules"
    לכל כלל שאתם כותבים, שאלו את עצמכם: **"האם המודל יכול לפעול לפי הכלל הזה בלי לשאול שאלות?"** אם התשובה לא — הכלל לא ספציפי מספיק.

## מעבר בין כלים — העקרונות אוניברסליים

אחד הדברים החשובים ביותר שנלמד במודול הזה הוא שהעקרונות **זהים בכל הכלים**. המשמעות המעשית: אם למדתם לעבוד עם כלי אחד, המעבר לכלי אחר הוא עניין של כמה דקות — לא ימים.

### דוגמה: העברת rules בין כלים

נניח שיש לכם קובץ rules ב-Cursor. ככה הוא נראה בכל כלי:

**ב-Cursor** — קובץ `.cursor/rules/project.md`:

```markdown
# Project Rules
- TypeScript strict mode
- Use named exports
- Tests with vitest, co-located (*.test.ts)
- Do NOT use `any` type
```

**ב-Kiro** — קובץ `.kiro/rules/project.md`:

```markdown
# Project Rules
- TypeScript strict mode
- Use named exports
- Tests with vitest, co-located (*.test.ts)
- Do NOT use `any` type
```

**ב-Claude Code** — קובץ `CLAUDE.md`:

```markdown
# Project Rules
- TypeScript strict mode
- Use named exports
- Tests with vitest, co-located (*.test.ts)
- Do NOT use `any` type
```

שימו לב: **התוכן זהה לחלוטין**. ההבדל היחיד הוא שם הקובץ והמיקום שלו. זה נכון גם ל-MCP (אותו `mcp.json` עם הבדלי נתיב בלבד), הרשאות (אותם עקרונות, ממשק שונה), וניהול סשנים.

### מה כן שונה בין כלים?

- **חוויית המשתמש** — IDE לעומת CLI, keybindings, ממשק גרפי
- **פיצ'רים ייחודיים** — Spec mode ב-Kiro, Tab completion ב-Cursor, SDK ב-Claude Code
- **מודלים זמינים** — לא כל כלי תומך בכל מודל
- **תמחור** — מנוי חודשי לעומת pay-per-use

**מה לא שונה:**

- איך כותבים rules טובים
- איך מנהלים context
- איך עובדים עם MCP
- איך נותנים הרשאות
- מתי פותחים סשן חדש

!!! tip "טיפ מעשי"
    כשמתחילים עם כלי חדש, העתיקו את קובץ ה-rules מהכלי הקודם, שנו את שם הקובץ והמיקום, ואתם מוכנים. 90% מהעבודה כבר עשויה.

## MCP — Model Context Protocol

### מה זה?

MCP הוא פרוטוקול שמאפשר לכלי AI להתחבר ל**שירותים חיצוניים**. במקום שהמודל יידע רק לקרוא ולכתוב קבצים, MCP מאפשר לו:

- לחפש ב-Jira/Linear
- לגשת ל-database
- לקרוא דוקומנטציה מ-Confluence
- להריץ queries ב-Grafana
- כל דבר שיש לו MCP server

### איך זה עובד?

```
AI Tool <--> MCP Client <--> MCP Server <--> External Service
```

ה-MCP server חושף **כלים** (tools) — כפי שנלמד בהמשך כשנצלול לתוך ה-agent loop. המודל קורא לכלי, ה-MCP server מבצע, ומחזיר תוצאה.

### הגדרת MCP

ההגדרה נעשית בקובץ JSON, בדרך כלל בתיקיית ההגדרות של הכלי:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_YOUR_TOKEN_HERE"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

!!! tip "איך להשיג tokens ל-MCP servers"
    - **GitHub Token** — GitHub → Settings → Developer settings → Personal access tokens → Generate new token. תנו הרשאות `repo` לגישה לריפוזיטוריים
    - **Database URL** — בדרך כלל מופיע ב-dashboard של ספק ה-DB (Supabase, Neon, Railway) או בקובץ `.env` המקומי
    - **כלל חשוב:** לעולם אל תשמרו tokens ישירות בקובץ MCP שנמצא ב-git! השתמשו ב-environment variables או בקובץ `mcp.json` שנמצא ב-`.gitignore`

- **Kiro** — `.kiro/mcp.json`
- **Claude Code** — `.claude/mcp.json` או `~/.claude/mcp.json` (גלובלי)
- **Cursor** — `.cursor/mcp.json`

## הרשאות

### למה זה חשוב?

ה-AI agent יכול לקרוא קבצים, לכתוב קבצים, ולהריץ פקודות. בלי הרשאות — הוא יכול לעשות כל דבר. זה מפחיד.

### רמות הרשאה

רוב הכלים מציעים מספר רמות:

- **אישור לכל פעולה** — הכי בטוח, הכי איטי
- **אישור אוטומטי לקריאה, ידני לכתיבה** — איזון טוב
- **YOLO mode** — הכל אוטומטי, מתאים רק לסביבות sandbox

!!! danger "הסיכונים של YOLO mode"
    ב-YOLO mode המודל מבצע כל פעולה בלי לבקש אישור. זה אומר שהוא יכול:

    - **למחוק קבצים** — כולל קבצי production או configuration חשובים
    - **לבצע `git push`** — לדחוף קוד שבור ישירות ל-main
    - **להריץ פקודות הרסניות** — כמו `rm -rf`, `DROP TABLE`, או `docker system prune`
    - **להתקין packages זדוניים** — typosquatting של packages עם שמות דומים לפופולריים
    - **לחשוף סודות** — לשלוח tokens או credentials ל-API חיצוני דרך MCP

    השתמשו ב-YOLO mode **רק** בסביבות שאפשר למחוק ולשחזר (containers, devcontainers, codespaces).

### מה לאשר ומה לא?

- **תמיד לאשר:** מחיקת קבצים, `git push`, פקודות עם `sudo`, התקנת packages
- **בדרך כלל בטוח:** קריאת קבצים, הרצת tests, `git status/diff`
- **תלוי בהקשר:** כתיבת קבצים חדשים, הרצת scripts

## מענה על שאלות של המודל

לפעמים המודל שואל שאלות לפני שהוא פועל. **אל תתעלמו מזה!**

- אם המודל שואל — כנראה שחסר לו מידע חשוב
- תשובה מפורטת חוסכת iterations ותוצאות שגויות
- אם לא בטוחים, עדיף לענות "אני לא בטוח, תבחר את הגישה שנראית לך הכי נכונה" מאשר להתעלם

## Skills

### מה זה?

Skills הם "מתכונים" מוכנים מראש — workflows שהמודל יודע לבצע. במקום להסביר בכל פעם "תכתוב לי test", אפשר להגדיר skill של "כתיבת test" שכולל:

- באיזה framework להשתמש
- מבנה הקובץ
- naming conventions
- דוגמאות

### דוגמה ב-Kiro

```markdown
# Skill: Create API Endpoint

## Steps
1. Create route handler in `src/routes/`
2. Add Zod validation schema
3. Add integration test in `__tests__/`
4. Update OpenAPI spec in `docs/api.yaml`

## Template
- Handler: src/routes/{name}.ts
- Test: __tests__/routes/{name}.test.ts
```

Skills חוסכים זמן וגורמים לתוצאות עקביות — במיוחד כשצוות שלם עובד עם אותם כלים.

## תרגיל מעשי

### הכרת הכלי — Guided Tour (30 דקות)

פתחו את Kiro (או כלי AI אחר) על פרויקט קיים ובצעו:

1. **פאנל ושיחה** — פתחו את הפאנל, שלחו prompt פשוט, עקבו אחרי הפעולות
      - פתחו את הכלי על פרויקט קיים (אפילו פרויקט פשוט עם 2-3 קבצים)
      - שלחו prompt: "תסביר לי את מבנה הפרויקט הזה"
      - עקבו אחרי מה שהכלי עושה: אילו קבצים הוא קורא? באיזה סדר?
      - שימו לב לאזור האישורים — האם הוא ביקש אישור לפני קריאת קבצים?
      - **תוצאה צפויה:** המודל מזהה את שפת התכנות, frameworks, ומבנה התיקיות

2. **צירוף context** — צרפו קובץ, צרפו תמונה, צרפו שגיאה מה-terminal
      - צרפו קובץ ספציפי לשיחה (ב-Kiro: `#`, ב-Cursor: `@`)
      - שאלו שאלה על הקובץ הזה: "יש bugs בקובץ הזה?"
      - צלמו screenshot של שגיאה בדפדפן וצרפו אותה לשיחה
      - בקשו מהמודל לתקן את השגיאה על בסיס ה-screenshot
      - **תוצאה צפויה:** המודל מתייחס ספציפית לתוכן שצירפתם, לא מנחש

3. **בחירת מודל** — החליפו מודל ובדקו את ההבדל בתשובות
      - שלחו את אותו prompt ב-Sonnet וב-Opus
      - השוו: מהירות תשובה, רמת פירוט, איכות הקוד
      - נסו משימה פשוטה (שינוי שם משתנה) — האם Opus שווה את ההמתנה?
      - **תוצאה צפויה:** Sonnet מגיב מהר עם תשובה טובה, Opus לוקח יותר זמן אבל נותן תשובה מעמיקה יותר

4. **מעקב context** — שלחו 10+ הודעות ועקבו אחרי ניצול ה-context window
      - התחילו סשן חדש ושלחו 10-15 הודעות עם שאלות על חלקים שונים בפרויקט
      - עקבו אחרי אינדיקטור ה-context (tokens/אחוזים)
      - שימו לב: מתי האיכות מתחילה לרדת? מתי המודל "שוכח" דברים מתחילת השיחה?
      - נסו לפתוח סשן חדש ולתת סיכום קצר — האם התוצאות משתפרות?
      - **תוצאה צפויה:** אחרי 10+ הודעות, ה-context תופס 30-60%. אחרי סשן חדש, האיכות חוזרת

### הגדרות (15 דקות)

5. **קובץ כללים** — צרו קובץ rules לפרויקט עם לפחות 5 כללים
      - זהו את השפה, framework, וכלי testing של הפרויקט
      - צרו את הקובץ המתאים לכלי שלכם (`.kiro/rules/`, `CLAUDE.md`, `.cursorrules`)
      - כתבו לפחות 5 כללים: stack, conventions, naming, דברים לא לעשות, מבנה תיקיות
      - שלחו prompt ובדקו: האם המודל מתנהג לפי הכללים?
      - **תוצאה צפויה:** המודל מייצר קוד שתואם את ה-conventions שהגדרתם (למשל, named exports במקום default)

6. **הרשאות** — בדקו את הגדרות ההרשאות, שנו רמה ובדקו את ההבדל
      - מצאו את הגדרות ההרשאות בכלי שלכם
      - בקשו מהמודל ליצור קובץ חדש — האם הוא ביקש אישור?
      - שנו לרמת הרשאות מחמירה יותר וחזרו על הבקשה
      - שימו לב: אילו פעולות תמיד דורשות אישור?
      - **תוצאה צפויה:** ברמה מחמירה, כל כתיבה דורשת אישור. ברמה פתוחה, רק פעולות מסוכנות

### MCP (15 דקות)

7. **הגדרת MCP** — הגדירו MCP server אחד (למשל: GitHub, filesystem, או sqlite)
      - בחרו MCP server להתקנה (מומלץ להתחיל עם GitHub — הכי פשוט)
      - צרו token מתאים (ראו הטיפ למעלה על השגת tokens)
      - צרו את קובץ `mcp.json` בתיקייה המתאימה לכלי שלכם
      - הפעילו מחדש את הכלי / הסשן כדי שה-MCP ייטען
      - **תוצאה צפויה:** הכלי מזהה את ה-MCP server ומציג את הכלים הזמינים (למשל: `list_repos`, `create_issue`)

8. **שימוש** — בקשו מהמודל לבצע פעולה דרך ה-MCP server
      - שלחו prompt: "תראה לי את ה-issues הפתוחים ב-repo שלי"
      - בדקו: האם המודל השתמש ב-MCP tool או ניסה לגשת ישירות?
      - נסו פעולת כתיבה: "תפתח issue חדש עם סיכום של ה-bugs שמצאת"
      - **תוצאה צפויה:** המודל משתמש ב-MCP tools, מבקש אישור לפעולות כתיבה, ומציג תוצאות אמיתיות מהשירות

!!! warning "פתרון בעיות נפוצות"
    **MCP server לא מתחבר:**

    - וודאו שה-token תקין ולא פג תוקף
    - בדקו שהנתיב לקובץ `mcp.json` נכון לכלי שלכם
    - הפעילו מחדש את הכלי (לא רק סשן חדש — סגירה מלאה ופתיחה)
    - הריצו `npx -y @modelcontextprotocol/server-github` ב-terminal כדי לבדוק שה-server עצמו עובד

    **Context מתמלא מהר מדי:**

    - צמצמו את מספר הקבצים שאתם מצרפים ל-context
    - פתחו סשן חדש ותנו סיכום של מה שעשיתם עד כה
    - אל תצרפו קבצים גדולים (lock files, generated code) — הם בזבוז context

    **המודל נותן תשובות לא רלוונטיות:**

    - בדקו שקובץ ה-rules נטען (שאלו: "מה ה-rules שלי?")
    - וודאו שהקבצים הנכונים ב-context — המודל לא יכול לנחש מה אתם רוצים אם הוא לא רואה את הקוד
    - נסחו את ה-prompt מחדש עם יותר פירוט: במקום "תתקן את הבאג" כתבו "בקובץ X, פונקציה Y מחזירה null במקום array ריק"

## שאלות לדיון

1. מתי פותחים סשן חדש לעומת ממשיכים באותו סשן?
2. מה ההבדל בין rules טובים לגרועים? איך זה משפיע על התוצאות?
3. אילו MCP servers הייתם רוצים לבנות לצוות שלכם?
4. איפה הגבול הנכון בהרשאות — בין מהירות לבטיחות?

## נקודות מפתח

- כל כלי AI לפיתוח בנוי על אותם עקרונות — למדו אחד, תבינו את כולם
- **Context הוא המשאב הכי חשוב** — נהלו אותו בתבונה
- קבצי כללים הם ה-force multiplier הכי גדול — השקיעו בהם
- MCP מרחיב את יכולות ה-agent מעבר לקריאה וכתיבה של קבצים
- הרשאות הן לא מטרד — הן רשת ביטחון. השתמשו בהן
