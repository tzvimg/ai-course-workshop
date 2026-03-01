# מודול 11: פרויקט מסכם — GitHub Repo Summarizer API

!!! info "משך"
    סשן מורחב — 3+ שעות

## סקירה

בפרויקט הזה תבנו שירות API שמקבל URL של repository ב-GitHub ומחזיר סיכום קריא של הפרויקט: מה הוא עושה, אילו טכנולוגיות בשימוש, ומה המבנה שלו.

הפרויקט מאתגר אתכם לעבוד עם APIs חיצוניים, לעבד תוכן של repositories, ולהשתמש ב-LLM בצורה יעילה — תוך יישום כל מה שלמדתם בסדנה.

---

## דרישות טכניות

- **שפה:** Python 3.10+
- **Web framework:** FastAPI או Flask (לפי בחירתכם)
- **LLM:** Nebius Token Factory API או ספק LLM חלופי
- אתם בוחרים איזה מודל להשתמש בו מתוך המודלים הזמינים

---

## ה-Endpoint

### POST /summarize

מקבל URL של repository ב-GitHub, מביא את תוכן ה-repository, ומחזיר סיכום שנוצר על ידי LLM.

**Request body:**

```json
{
  "github_url": "https://github.com/psf/requests"
}
```

- **github_url** (string, חובה) — URL של repository ציבורי ב-GitHub

**Response (הצלחה):**

```json
{
  "summary": "**Requests** is a popular Python library for making HTTP requests...",
  "technologies": ["Python", "urllib3", "certifi"],
  "structure": "The project follows a standard Python package layout with the main source code in `src/requests/`, tests in `tests/`, and documentation in `docs/`."
}
```

- **summary** (string) — תיאור קריא של מה שהפרויקט עושה
- **technologies** (string[]) — רשימת הטכנולוגיות, השפות והפריימוורקים העיקריים
- **structure** (string) — תיאור קצר של מבנה הפרויקט

**Response (שגיאה):**

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

בשגיאה — החזירו HTTP status code מתאים.

---

## האתגר המרכזי

החלק המעניין בפרויקט הזה הוא **איך אתם מטפלים בתוכן ה-repository** לפני שליחתו ל-LLM:

- **Repositories יכולים להיות גדולים** — אי אפשר פשוט לשלוח הכל ל-LLM
- **צריך להחליט אילו קבצים חשובים** ואילו אפשר לדלג עליהם (למשל: קבצים בינאריים, lock files, `node_modules/` וכו׳)
- **ל-LLM יש context window מוגבל** — צריך אסטרטגיה להכנסת המידע הרלוונטי ביותר
- **חשבו מה נותן ל-LLM את ההבנה הטובה ביותר** של פרויקט: README? עץ תיקיות? קבצי מקור מרכזיים? קבצי config?

!!! tip "אין תשובה אחת נכונה"
    אנחנו רוצים לראות איך אתם חושבים על הבעיה הזו. הגישה שלכם לבחירת התוכן והעברתו ל-LLM היא חלק מרכזי מההערכה.

---

## איך הקוד צריך לרוץ

ודאו שה-solution שלכם עומד בדרישות הבאות:

- ה-README מכיל **הוראות צעד-אחר-צעד** להתקנת dependencies והרצת השרת
- אחרי מעקב אחרי ההוראות, השרת עולה וחושף את ה-endpoint `POST /summarize`
- אפשר לבדוק אותו עם:

```bash
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/psf/requests"}'
```

- מפתח ה-API מוגדר דרך **environment variable** (למשל `NEBIUS_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)
- **אל תעשו hardcode למפתחות API**

---

## מה להגיש

- **קוד מקור עובד** של שירות ה-API
- **requirements.txt** (או pyproject.toml) עם כל ה-dependencies
- **README.md** עם:
    - הוראות setup והרצה צעד-אחר-צעד (הניחו מכונה נקייה עם Python מותקן)
    - איזה מודל בחרתם ולמה (1-2 משפטים מספיקים)
    - הגישה שלכם לטיפול בתוכן ה-repository (מה אתם כוללים, מה אתם מדלגים, ולמה)
- העלו את ה-solution כ-**zip archive**

---

## קריטריונים להערכה

ההגשה מדורגת בסקאלה של 10 נקודות. **לא צריך ציון מושלם כדי לעבור** — אנחנו מחפשים פתרון עובד עם החלטות מחושבות.

### קריטריונים חוסמים

אם אחד מאלה לא מתקיים, ההגשה לא תיבדק:

- **הקוד לא רץ** — לא מצליחים להריץ את השרת לפי ההוראות ב-README
- **אין endpoint עובד** — `POST /summarize` לא מחזיר תשובה תקינה
- **מפתחות API מוטמעים בקוד** — hardcoded API keys

### קריטריונים חוסמים נוספים

אם אחד מאלה לא מתקיים, ההגשה לא תיבדק:

- **שימוש ב-LLM** — חייבים להשתמש ב-Nebius Token Factory API (או ספק LLM חלופי) לקריאות ה-LLM

### קריטריונים לניקוד

- **פונקציונליות (0-20)** — ה-endpoint מחזיר סיכום משמעותי ומדויק עבור repositories שונים. ה-response תואם את הפורמט שהוגדר (summary, technologies, structure).
- **עיבוד Repository (0-20)** — קבצים מסוננים בצורה הגיונית (קבצים בינאריים, lock files וכו׳ מדולגים). יש אסטרטגיה ברורה לבחירת הקבצים האינפורמטיביים ביותר.
- **ניהול Context (0-20)** — הפתרון מטפל ב-repositories גדולים בלי לקרוס או לשלוח יותר מדי ל-LLM. יש אסטרטגיה כלשהי לעמידה במגבלות ה-context (חיתוך, תיעדוף, סיכום וכו׳).
- **Prompt Engineering (0-10)** — ה-prompts ל-LLM ברורים ומייצרים פלט מובנה ושימושי.
- **איכות קוד וטיפול בשגיאות (0-20)** — הקוד קריא ומאורגן. edge cases מטופלים (URL לא תקין, repo פרטי, repo ריק, שגיאות רשת). מפתחות API לא מוטמעים בקוד.
- **תיעוד (0-10)** — ה-README כולל הוראות setup עובדות והסבר קצר על החלטות העיצוב.

**סה״כ: 100 נקודות**

> אל תסבכו את זה יותר מדי. פתרון נקי ועובד שמטפל בתרחישים העיקריים — זה מה שאנחנו מחפשים. אם יש לכם זמן ואתם רוצים ללכת רחוק יותר — מעולה, אבל זה לא חובה.

---

## דוגמת קוד התחלתית

### חיבור בסיסי ל-LLM

```python
import anthropic
import os

client = anthropic.Anthropic(
    api_key=os.environ["ANTHROPIC_API_KEY"]
)

def summarize_repo(repo_content: str) -> dict:
    """שולח את תוכן ה-repo ל-LLM ומקבל סיכום מובנה."""
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"""Analyze this GitHub repository content and return a JSON object with:
- "summary": A clear description of what the project does (2-3 sentences)
- "technologies": A list of main technologies, languages, and frameworks
- "structure": A brief description of the project layout

Repository content:
{repo_content}

Return ONLY valid JSON, no extra text."""
            }
        ]
    )

    import json
    return json.loads(response.content[0].text)
```

### בניית ה-prompt לסיכום

טיפ: שלחו ל-LLM את **המידע הרלוונטי ביותר**, לא הכל:

```python
def build_repo_context(files: dict) -> str:
    """בונה context מתומצת מקבצי ה-repo."""
    context_parts = []

    # 1. README תמיד ראשון — הכי אינפורמטיבי
    if "README.md" in files:
        context_parts.append(f"## README.md\n{files['README.md'][:3000]}")

    # 2. קבצי config מגלים את ה-stack
    for config in ["package.json", "pyproject.toml", "go.mod", "Cargo.toml"]:
        if config in files:
            context_parts.append(f"## {config}\n{files[config][:1000]}")

    # 3. מבנה התיקיות
    tree = "\n".join(f"  {f}" for f in sorted(files.keys())[:50])
    context_parts.append(f"## File tree\n{tree}")

    return "\n\n---\n\n".join(context_parts)
```

### טיפול בשגיאות API

```python
import time

def call_llm_with_retry(prompt: str, max_retries: int = 3) -> str:
    """קריאה ל-LLM עם retry ו-error handling."""
    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text

        except anthropic.RateLimitError:
            # Rate limit — מחכים ומנסים שוב
            wait = 2 ** attempt  # exponential backoff
            print(f"Rate limited. Waiting {wait}s...")
            time.sleep(wait)

        except anthropic.APIStatusError as e:
            if e.status_code == 529:  # overloaded
                time.sleep(5)
                continue
            raise  # שגיאות אחרות — מעלים הלאה

        except anthropic.BadRequestError as e:
            if "too long" in str(e).lower():
                # Context ארוך מדי — צריך לקצר
                raise ValueError(
                    "Repository content exceeds context window. "
                    "Try filtering more files."
                )
            raise

    raise RuntimeError(f"Failed after {max_retries} retries")
```

## ניהול עלויות

!!! tip "עלויות API"
    - **בפיתוח:** השתמשו ב-Haiku (הזול ביותר) לבדיקות. עברו ל-Sonnet רק כשהכל עובד
    - **הערכת עלות:** ~1,000 tokens ≈ 750 מילים. Repo ממוצע ≈ 5,000-20,000 tokens
    - **Caching:** שמרו תוצאות ב-cache (Redis, קובץ, DB) — אין סיבה לשלוח את אותו repo פעמיים
    - **הגבלות:** הגדירו spending limit ב-console.anthropic.com
    - **מודל לפי צורך:** Haiku לrepos קטנים ופשוטים, Sonnet לrepos מורכבים

## פתרון בעיות נפוצות

!!! warning "Troubleshooting"
    **GitHub API rate limiting:**

    - ללא authentication: 60 requests/שעה בלבד
    - עם token: 5,000 requests/שעה
    - הגדירו `GITHUB_TOKEN` ושלחו אותו ב-header: `Authorization: Bearer {token}`

    **Context window exceeded:**

    - סננו קבצים בינאריים, lock files, `node_modules/`, `.git/`
    - הגבילו גודל קובץ בודד (למשל, עד 5,000 תווים)
    - תעדפו: README > config files > source files > tests
    - אם עדיין גדול מדי — שלחו רק עץ תיקיות + README

    **Repos גדולים — timeout:**

    - השתמשו ב-GitHub API (לא cloning) — מהיר יותר
    - הגבילו מספר קבצים שקוראים (50-100 המשמעותיים ביותר)
    - הוסיפו timeout לכל request

    **Environment variable לא מוגדר:**

    - וודאו ש-`ANTHROPIC_API_KEY` (או מפתח אחר) מוגדר: `echo $ANTHROPIC_API_KEY`
    - ב-Python: `os.environ.get("KEY")` מחזיר `None` בשקט. השתמשו ב-`os.environ["KEY"]` כדי לקבל שגיאה ברורה

    **JSON parsing fails:**

    - LLMs לפעמים עוטפים JSON ב-markdown (` ```json ... ``` `). חלצו את ה-JSON עם regex
    - הוסיפו `"Return ONLY valid JSON"` ל-prompt
    - השתמשו ב-`tool_use` עם `tool_choice` לקבלת structured output מובטח

## טיפים

!!! example "שלבי עבודה מומלצים"
    1. **התחילו פשוט** — endpoint שמקבל URL ומחזיר response סטטי
    2. **הוסיפו fetch מ-GitHub** — השתמשו ב-GitHub API או cloning כדי לקבל את תוכן ה-repo
    3. **בנו את הלוגיקה לסינון קבצים** — החליטו מה רלוונטי ומה לא
    4. **חברו ל-LLM** — שלחו את התוכן המסונן וקבלו סיכום
    5. **טפלו בשגיאות** — URLs לא תקינים, repos פרטיים, timeouts
    6. **כתבו README** — תעדו הכל כאילו מישהו אחר צריך להריץ את זה

!!! warning "דגשים חשובים"
    - **אל תשלחו את כל ה-repo ל-LLM** — זה יחרוג מה-context window וגם יעלה הרבה כסף
    - **חשבו על edge cases** — repos ריקים, repos ענקיים, URLs לא תקינים
    - **השתמשו בכל הכלים שלמדתם** — זה הזמן ליישם prompt engineering, כלי AI לפיתוח, ודפוסים מתקדמים

---

## קשר למודולים קודמים

פרויקט זה משלב ידע מכל הסדנה:

- **מודול 2 (Prompt Engineering)** — כתיבת prompt יעיל ל-LLM לסיכום repositories
- **מודול 3 (כלי פיתוח AI)** — שימוש בכלי AI לפיתוח ה-service עצמו
- **מודול 4 (Coding Agent)** — בניית ה-agent שמנתח את ה-repository
- **מודול 5 (בניית פיצ׳רים עם AI)** — שילוב LLM API בפרודקשן
- **מודול 6 (דפוסים מתקדמים)** — טיפול ב-context window, caching, error handling
