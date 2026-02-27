# AI להנדסת תוכנה

סדנה מעשית ופרקטית שמלמדת מפתחים איך למנף כלי AI לאורך כל מחזור חיי הפיתוח. **בלי בלופים — רק דפוסים שעובדים.**

---

## למי הסדנה מיועדת?

מפתחי תוכנה (מ-junior עד senior) שרוצים להכפיל את הפרודוקטיביות שלהם עם AI. לא צריך רקע ב-ML או AI — רק ניסיון בפיתוח.

## מה תלמדו

- **Prompt Engineering** — כתיבת prompts שמייצרים קוד ברמת production
- **תהליכי עבודה עם AI** — Code review, בדיקות, refactoring ותיעוד עם AI
- **Agentic Coding** — שימוש ב-Claude Code, Cursor ו-Copilot כ-pair programmers
- **בניית פיצ׳רים עם AI** — שילוב LLMs באפליקציות שלכם
- **דפוסים מתקדמים** — שיקולי production, אבטחה ושילוב ב-CI/CD
- **פרויקט מסכם** — בנו כלי אמיתי עם כל מה שלמדתם

## פורמט הסדנה

- **סדנה אינטנסיבית (יומיים)** — כל המודולים ביומיים מלאים, מתאים לצוותים ו-bootcamps
- **סדרה שבועית (7 שבועות)** — מודול אחד בשבוע, מתאים ללמידה מתמשכת
- **כל מודול** — 30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

---

## דרישות מוקדמות

### ידע נדרש

- ניסיון בסיסי בתכנות (עדיפות ל-JavaScript/TypeScript או Python)
- היכרות בסיסית עם Git ו-command line
- הבנה של REST APIs ו-JSON
- **לא נדרש** רקע ב-ML או בינה מלאכותית

### התקנות חובה

!!! warning "חשוב להתקין לפני הסדנה"
    וודאו שכל הכלים מותקנים ועובדים **לפני** היום הראשון. חלק מההתקנות דורשות הרשמה והורדה שלוקחים זמן.

**סביבת פיתוח:**

- **Node.js** (גרסה 18+) — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)
- **עורך קוד** — VS Code, Cursor, או כל IDE שמכירים

**כלי AI (לפחות אחד מהבאים):**

- **Claude Code (Kiro CLI)** — ה-agent המרכזי בסדנה
    ```bash
    npm install -g @anthropic-ai/kiro-cli
    ```
- **Cursor IDE** — [cursor.com](https://www.cursor.com/) — IDE עם agent מובנה (חינמי עם מגבלות, Pro ב-$20/חודש)
- **Kiro IDE** — [kiro.dev](https://kiro.dev/) — IDE של AWS עם יכולות agent

**Python** (למודול הפרויקט המסכם):

- **Python 3.10+** — [python.org](https://www.python.org/)
- מומלץ להתקין גם `pyenv` לניהול גרסאות

### מפתחות API (חובה)

!!! danger "נדרש לפני הסדנה"
    בלי מפתח API פעיל, לא ניתן לבצע את התרגילים. וודאו שיש לכם יתרה בחשבון.

- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com/)
    - נדרש לעבודה עם Claude Code / Kiro CLI
    - המודלים שנשתמש בהם: **Claude Sonnet 4.5** (ברירת מחדל), **Claude Opus 4.6** (למשימות מורכבות)
    - עלות משוערת לסדנה: $5–$15 (תלוי בשימוש)

- **OpenAI API Key** (אופציונלי) — [platform.openai.com](https://platform.openai.com/)
    - חלופה או תוספת ל-Anthropic
    - שימושי למודול בניית פיצ׳רים עם AI

### חשבון GitHub

- **חשבון GitHub פעיל** — [github.com](https://github.com/)
- מומלץ ליצור **Personal Access Token** מראש (Settings → Developer Settings → Personal Access Tokens)
- נדרש למודולים: MCP Servers, Skills, ופרויקט מסכם

### התקנות מומלצות (לא חובה)

כלים שישפרו את חוויית הסדנה אבל לא חובה מהיום הראשון:

- **Docker** — [docker.com](https://www.docker.com/) — למודול דפוסים מתקדמים ו-CI/CD
- **jq** — כלי לעיבוד JSON בשורת הפקודה
    ```bash
    # macOS
    brew install jq
    # Ubuntu/Debian
    sudo apt install jq
    ```
- **TypeScript** (גלובלי) — לבדיקת קומפילציה
    ```bash
    npm install -g typescript
    ```

### סיכום התקנות

| מה | חובה? | עלות |
|---|---|---|
| Node.js 18+ | ✅ חובה | חינם |
| Git | ✅ חובה | חינם |
| Claude Code (Kiro CLI) | ✅ חובה | חינם (הכלי עצמו) |
| Anthropic API Key | ✅ חובה | ~$5–15 לסדנה |
| GitHub Account | ✅ חובה | חינם |
| Python 3.10+ | ⚠️ מומלץ | חינם |
| Cursor IDE | 📋 אופציונלי | חינם / $20 לחודש |
| Kiro IDE | 📋 אופציונלי | חינם |
| OpenAI API Key | 📋 אופציונלי | משתנה |
| Docker | 📋 אופציונלי | חינם |

---

## בדיקת סביבה מהירה

הריצו את הפקודות הבאות כדי לוודא שהכל מותקן:

```bash
# בדיקת Node.js
node --version    # צפוי: v18.x.x או גבוה יותר

# בדיקת npm
npm --version

# בדיקת Git
git --version

# בדיקת Claude Code / Kiro CLI
kiro --version

# בדיקת Python (אופציונלי)
python3 --version  # צפוי: 3.10 או גבוה יותר
```

!!! tip "בעיות בהתקנה?"
    אם נתקלתם בבעיה, פנו למנחה הסדנה לפני יום הפתיחה. עדיף לפתור בעיות התקנה מראש ולא לבזבז זמן סדנה.

---

## בואו נתחיל

עברו ל[מודול 1: Prompt Engineering](modules/01-prompt-engineering.md) כדי להתחיל.
