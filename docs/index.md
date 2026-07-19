# AI להנדסת תוכנה

סדנה מעשית ופרקטית שמלמדת מפתחים איך למנף כלי AI לאורך כל מחזור חיי הפיתוח. **בלי בלופים — רק דפוסים שעובדים.**

---

## למי הסדנה מיועדת?

מפתחי תוכנה (מ-junior עד senior) שרוצים להכפיל את הפרודוקטיביות שלהם עם AI. לא צריך רקע ב-ML או AI — רק ניסיון בפיתוח.

## מה תלמדו

- **Prompt Engineering** — כתיבת prompts שמייצרים קוד ברמת production
- **עבודה עם כלי פיתוח AI** — context, rules, הרשאות וסשנים — העקרונות שמשותפים לכל הכלים
- **Terminal Agents ו-Plan Mode** — עבודה עם Kiro CLI, תכנון פיצ׳רים מורכבים, ו-steering של ה-agent להצלחה
- **בניית Coding Agent מאפס** — מימוש agent loop משלכם, ואוטומציה שלו עם agentic coding loop
- **הרחבת יכולות** — שרתי MCP, custom agents, ותזמור sub-agents
- **בניית פיצ׳רים עם AI** — שילוב LLMs באפליקציות שלכם
- **דפוסים מתקדמים** — שיקולי production, אבטחה ושילוב ב-CI/CD
- **פרויקט מסכם** — בנו כלי אמיתי עם כל מה שלמדתם

## פורמט הסדנה

- **סדנה אינטנסיבית (יומיים)** — מבחר המודולים המרכזיים ביומיים מלאים, מתאים לצוותים ו-bootcamps (ראו מדריך מנחה לחלוקה מומלצת)
- **סדרה שבועית (13 שבועות)** — מודול אחד בשבוע, מתאים ללמידה מתמשכת
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

**כלי AI:**

- **Kiro CLI** — ה-agent המרכזי בסדנה ([תיעוד](https://kiro.dev/docs/cli/))

    === "macOS / Linux"

        ```bash
        curl -fsSL https://cli.kiro.dev/install | bash

        # אחרי ההתקנה, אתחלו בתיקיית פרויקט עם:
        kiro-cli
        ```

    === "Windows"

        הריצו את אותה פקודת התקנה בתוך **Git Bash** (מגיע עם Git for Windows):

        ```bash
        curl -fsSL https://cli.kiro.dev/install | bash
        ```

        לאחר מכן `kiro-cli` זמין גם מ-PowerShell (פתחו terminal חדש).

    בהרצה הראשונה תתבקשו להתחבר עם חשבון (AWS Builder ID / Google / GitHub). יש מסלול חינמי עם מכסת שימוש — מספיק לסדנה.

- **Cursor IDE** (אופציונלי) — [cursor.com](https://www.cursor.com/) — IDE עם agent מובנה (חינמי עם מגבלות, Pro ב-$20/חודש)
- **Kiro IDE** (אופציונלי) — [kiro.dev](https://kiro.dev/) — ה-IDE המלא של Kiro, עם Spec mode לתכנון מובנה

**Python** (למודול הפרויקט המסכם):

- **Python 3.10+** — [python.org](https://www.python.org/)
- מומלץ להתקין גם `pyenv` לניהול גרסאות

### מפתחות API (חובה)

!!! danger "נדרש לפני הסדנה"
    בלי מפתח API פעיל, לא ניתן לבצע את התרגילים במודולים 6, 7, 10, 11, 12 ו-13. וודאו שיש לכם יתרה בחשבון.

- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com/)
    - נדרש למודולים שבהם בונים agents ופיצ׳רים ישירות מול ה-API (בניית coding agent, agentic loop, sub-agents, פיצ׳רים עם AI, דפוסים מתקדמים, ופרויקט מסכם)
    - **שימו לב:** Kiro CLI עצמו מתחבר עם חשבון Kiro — הוא **לא** משתמש במפתח ה-Anthropic. המפתח נדרש לקוד שאתם כותבים בעצמכם עם ה-SDK
    - המודלים שנשתמש בהם: **Claude Sonnet 5** (ברירת מחדל), **Claude Opus 4.8** (למשימות מורכבות)
    - עלות משוערת לסדנה: $5–$15 (תלוי בשימוש)

### חשבון GitHub

- **חשבון GitHub פעיל** — [github.com](https://github.com/)
- מומלץ ליצור **Personal Access Token** מראש (Settings → Developer Settings → Personal Access Tokens)
- נדרש למודולים: MCP Servers ופרויקט מסכם

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
| Kiro CLI | ✅ חובה | מסלול חינמי (מנוי Pro אופציונלי) |
| Anthropic API Key | ✅ חובה | ~$5–15 לסדנה |
| GitHub Account | ✅ חובה | חינם |
| Python 3.10+ | ⚠️ מומלץ | חינם |
| Cursor IDE | 📋 אופציונלי | חינם / $20 לחודש |
| Kiro IDE | 📋 אופציונלי | חינם |
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

# בדיקת Kiro CLI
kiro-cli --version

# בדיקת Python (אופציונלי)
python3 --version  # צפוי: 3.10 או גבוה יותר
```

!!! note "Windows"
    כל הפקודות עובדות גם ב-PowerShell, חוץ מ-`python3` — ב-Windows בדקו עם `python --version`.

!!! tip "בעיות בהתקנה?"
    אם נתקלתם בבעיה, פנו למנחה הסדנה לפני יום הפתיחה. עדיף לפתור בעיות התקנה מראש ולא לבזבז זמן סדנה.

---

## בואו נתחיל

עברו ל[מודול 1: Prompt Engineering](modules/01-prompt-engineering.md) כדי להתחיל.
