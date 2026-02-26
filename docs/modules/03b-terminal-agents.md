# מודול 3B: הכוח של Terminal Agents — Kiro CLI

!!! info "משך"
    30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- להבין מה מייחד terminal agents (Kiro CLI, Claude Code) לעומת IDE agents
- לעבוד עם Kiro CLI כ-"עוזר מערכת" — לא רק עורך קוד
- **לפתוח תיקייה ריקה ולבצע כל משימה** — לא חייבים פרויקט קוד קיים
- למנף גישה מלאה למערכת ההפעלה למשימות שחורגות מעריכת קוד
- להשתמש ב-terminal agents לאוטומציה של תחזוקה, DevOps, ותקשורת עם שרתים

!!! tip "למה סשן נפרד?"
    במודול 3 למדנו את העקרונות המשותפים לכל כלי ה-AI. כאן נתמקד ביתרון הייחודי של terminal agents: **הם לא רק עורכי קוד — הם agents עם גישה מלאה למחשב**.

## מה מייחד Terminal Agents?

### IDE Agent לעומת Terminal Agent

**IDE agents** (Cursor, Windsurf, Kiro IDE) חיים בתוך ה-IDE. הם מצוינים ב:

- עריכת קוד בקבצים פתוחים
- ניווט בפרויקט
- Refactoring
- כתיבת tests

**Terminal agents** (Kiro CLI, Claude Code, Aider) חיים ב-terminal. הם עושים את כל מה שלמעלה, ובנוסף:

- **גישה מלאה ל-shell** — כל פקודה שאתם יכולים להריץ, הם יכולים להריץ
- **לא צריכים פרויקט** — אפשר לפתוח תיקייה ריקה ולבצע כל משימה
- **עבודה מרובת פרויקטים** — לא מוגבלים ל-workspace אחד
- **אוטומציה של תהליכים** — scripts, cron jobs, CI/CD
- **תקשורת עם שרתים** — SSH, API calls, database queries
- **ניהול מערכת** — התקנות, תצורה, ניקוי

> בקיצור: IDE agent הוא כמו עובד שיושב בחדר עם מחשב ורואה רק את ה-IDE. Terminal agent הוא כמו עובד עם גישה מלאה לחדר השרתים.

### Kiro CLI — התקנה מהירה

```bash
# התקנה גלובלית
npm install -g @anthropic-ai/kiro-cli

# הפעלה בתיקייה כלשהי
cd ~/my-folder
kiro
```

Kiro CLI עובד כמו Claude Code — פותחים terminal, מריצים `kiro`, וכותבים מה שרוצים. הוא יכול לקרוא קבצים, לכתוב קבצים, להריץ פקודות, ולשאול שאלות.

### הארכיטקטורה

```
┌─────────────────────────────────────────────┐
│           Kiro CLI / Terminal Agent           │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Read/    │  │ Execute  │  │ Network   │ │
│  │ Write    │  │ Commands │  │ Access    │ │
│  │ Files    │  │ (bash)   │  │ (curl,    │ │
│  │          │  │          │  │ ssh, etc) │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Package  │  │ Git      │  │ System    │ │
│  │ Managers │  │ Ops      │  │ Admin     │ │
│  │ (npm,    │  │          │  │ (disk,    │ │
│  │ pip...)  │  │          │  │ proc...)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
└─────────────────────────────────────────────┘
```

## דפוס "תיקיית משימה" — לא חייבים פרויקט

!!! tip "הרעיון המרכזי"
    Terminal agent **לא חייב לעבוד בתוך פרויקט קוד**. אפשר לפתוח תיקייה ריקה, להפעיל את Kiro CLI, ולבקש ממנו כל דבר. התיקייה היא פשוט "שטח עבודה" לביצוע המשימה.

### איך זה עובד?

```bash
# יצירת תיקייה למשימה
mkdir ~/missions/disk-cleanup
cd ~/missions/disk-cleanup

# הפעלת Kiro CLI
kiro
```

עכשיו אפשר לבקש **כל דבר** — לא חייב שיהיה קשור לקוד:

```
> "תבדוק כמה מקום פנוי בדיסק ותציע מה לנקות"
> "תוריד את כל התמונות מהתיקייה הזו וכווץ אותן ל-50% מהגודל"
> "תיצור script שמגבה את ה-database כל לילה"
> "תבדוק מה הIP הציבורי שלי ואיזה ports פתוחים"
```

### דוגמאות למשימות "לא-קוד"

**ניהול קבצים:**
```
mkdir ~/missions/photo-organize && cd $_
kiro
> "יש לי 500 תמונות ב-~/Downloads/photos. תמיין אותן לתיקיות לפי שנה וחודש"
```

**מחקר:**
```
mkdir ~/missions/api-research && cd $_
kiro
> "תבדוק את ה-API של OpenWeatherMap, תראה לי דוגמה של response,
  ותכתוב לי סיכום של מה שהוא מציע"
```

**תחזוקת מערכת:**
```
mkdir ~/missions/server-health && cd $_
kiro
> "תתחבר לשרת production דרך SSH (user@server.example.com)
  ותייצר דוח על מצב השרת — CPU, RAM, דיסק, uptime"
```

**עיבוד נתונים:**
```
mkdir ~/missions/csv-transform && cd $_
kiro
> "יש לי קובץ CSV ב-~/data/sales.csv. תנתח אותו,
  תייצר גרף של מכירות לפי חודש, ותשמור כ-PNG"
```

> הדפוס הזה משחרר אתכם מהחשיבה ש-"AI agent = עורך קוד". Kiro CLI הוא **עוזר מערכת** שיכול לבצע כל משימה שאתם עושים ב-terminal.

## Use Cases — מה Kiro CLI יכול לעשות

### 1. ניקוי ותחזוקת דיסק

Kiro CLI יכול לנתח שימוש בדיסק ולנקות בצורה חכמה:

```
> "תבדוק מה תופס הכי הרבה מקום בדיסק ותציע מה אפשר לנקות"
```

מה ה-agent יעשה:

- יריץ `du -sh` ו-`df -h` כדי להבין את המצב
- יזהה `node_modules` ישנים, caches של Docker, log files ענקיים
- יציע מה בטוח למחוק ויבקש אישור לפני כל פעולה
- ינקה `npm cache`, `docker system prune`, logs ישנים

```bash
# דוגמה למה שה-agent עשוי להריץ
du -sh /home/*/.cache/* | sort -rh | head -20
docker system df
find /tmp -type f -mtime +30 -size +10M
```

!!! warning "אישורים"
    Kiro CLI **תמיד** יבקש אישור לפני מחיקת קבצים. ודאו שאתם עובדים במצב שדורש אישור לפעולות הרסניות.

### 2. תקשורת עם שרתים

Kiro CLI יכול לתקשר עם שרתים מרוחקים:

```
> "תתחבר לשרת הסטייג'ינג ותבדוק למה ה-API מחזיר 500"
```

מה ה-agent יעשה:

- יתחבר דרך SSH או יבצע API calls עם `curl`
- יקרא logs בשרת (`journalctl`, `docker logs`)
- יבדוק status של services
- ינתח את הבעיה ויציע פתרון

```
> "תבדוק את ה-health של כל ה-microservices שלנו"
```

```bash
# ה-agent יכול להריץ סדרת בדיקות
curl -s https://api.example.com/health | jq
curl -s https://auth.example.com/health | jq
ssh staging-server "docker ps --format '{{.Names}}: {{.Status}}'"
```

### 3. התקנה והגדרת סביבות

```
> "תקין את כל מה שצריך כדי להריץ את הפרויקט הזה על המחשב שלי"
```

מה ה-agent יעשה:

- יקרא את ה-README, `package.json`, `Dockerfile`, `docker-compose.yml`
- יזהה dependencies חסרים
- יריץ את ההתקנות ברצף הנכון
- יטפל בשגיאות ויתאים הגדרות למערכת ההפעלה

```
> "תתקין Python 3.12, תיצור virtual environment, ותתקין את כל ה-requirements"
```

```bash
# ה-agent מטפל בכל השלבים
pyenv install 3.12.0
pyenv local 3.12.0
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. שינוי פורמט ועיצוב קוד

```
> "תעביר את כל הפרויקט מ-tabs ל-spaces, תוסיף prettier, ותפרמט את הכל"
```

מה ה-agent יעשה:

- יתקין את הכלי (`prettier`, `black`, `gofmt`)
- ייצור קובץ הגדרות (`.prettierrc`, `pyproject.toml`)
- יריץ את הפורמט על כל הפרויקט
- יבצע `git diff` לוודא שהשינויים הגיוניים
- יעשה commit נפרד לשינויי הפורמט

```
> "תעביר את הפרויקט מ-CommonJS ל-ES Modules"
```

זו משימה שדורשת שילוב של עריכת קוד + הרצת פקודות + בדיקות — בדיוק הכוח של terminal agent.

### 5. ניתוח וניטור

```
> "תנתח את ביצועי ה-API שלנו מה-logs של השבוע האחרון"
```

```bash
# ה-agent יכול לעבד logs ולתת תובנות
cat /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn
# יחפש request times חריגים
# ייצור סיכום של שגיאות לפי סוג
```

```
> "תבדוק אם יש memory leaks בשרת"
```

```bash
# ניטור בזמן אמת
ps aux --sort=-%mem | head -20
free -h
docker stats --no-stream
```

### 6. ניהול Git מתקדם

Terminal agents מצוינים במשימות Git מורכבות:

```
> "תעשה rebase אינטראקטיבי שמאחד את 5 הקומיטים האחרונים לאחד"
```

```
> "תמצא את הקומיט שהכניס את הבאג הזה (git bisect)"
```

```
> "תנקה את כל הענפים שכבר מורגו ל-main"
```

### 7. עבודה עם Databases

```
> "תתחבר ל-database, תראה לי את הסכמה, ותכתוב migration שמוסיף עמודת email_verified"
```

```bash
# ה-agent יכול להתחבר ישירות
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\d users"
# ואז לכתוב ולהריץ migration
```

### 8. אוטומציה של CI/CD

```
> "תיצור GitHub Actions workflow שבודק, בונה, ומפרסם Docker image"
```

```
> "ה-CI נכשל, תבדוק למה ותתקן"
```

Terminal agent יכול:

- לקרוא את ה-workflow file
- להריץ את אותן פקודות מקומית כדי לשחזר את הבעיה
- לתקן ולבדוק שהכל עובר
- לעשות push ולעקוב אחרי ה-CI

## מתי להשתמש ב-Terminal Agent?

### Terminal Agent מנצח כש:

- **המשימה חורגת מעריכת קוד** — התקנות, הגדרות, ניקוי, ניטור
- **צריך אינטראקציה עם שרתים** — SSH, API calls, database queries
- **צריך להריץ פקודות מורכבות** — pipelines, scripts, workflows
- **עובדים ב-headless** — שרתים, Docker containers, CI/CD
- **צריך לעבד כמויות גדולות** — logs, migrations, bulk operations

### IDE Agent מנצח כש:

- **עובדים על קוד ספציפי** — יש LSP, autocomplete, go-to-definition
- **צריך feedback ויזואלי** — inline diffs, preview, error highlighting
- **עובדים בפרויקט אחד** — הכלי כבר מבין את ה-codebase
- **צריך אינטראקציה מהירה** — שינויים קטנים, שאלות על קוד

### השילוב האידיאלי

מפתחים מנוסים משתמשים ב**שניהם**:

- **Kiro IDE** (או Cursor) לכתיבת קוד ו-refactoring בתוך פרויקט
- **Kiro CLI** לכל השאר — DevOps, automation, debugging, system tasks, ומשימות ad-hoc

## תרגיל מעשי

!!! note "דפוס עבודה"
    בכל תרגיל — **צרו תיקיית משימה חדשה**, הפעילו את Kiro CLI, ובצעו את המשימה. ככה אתם מתרגלים את הדפוס של "תיקייה למשימה".

### תרגיל 1: ניקוי וסריקה (15 דקות)

```bash
mkdir ~/missions/disk-cleanup && cd $_
kiro
```

בקשו מ-Kiro CLI לבצע את המשימות הבאות:

1. **סריקת דיסק** — "תנתח את השימוש בדיסק ב-home directory שלי, תראה לי מה תופס הכי הרבה מקום"
2. **מציאת קבצים מיותרים** — "תמצא `node_modules` ישנים, קבצי log גדולים, או cache שאפשר לנקות"
3. **ניקוי בטוח** — "תנקה את מה שבטוח למחוק" — שימו לב שהוא מבקש אישור לפני כל פעולה

### תרגיל 2: הגדרת סביבה (15 דקות)

```bash
mkdir ~/missions/project-setup && cd $_
kiro
```

1. שכפלו פרויקט דוגמה (או קחו פרויקט קיים)
2. בקשו מ-Kiro CLI: **"תתקין את כל מה שצריך כדי להריץ את הפרויקט הזה"**
3. עקבו אחרי מה שהוא עושה — אילו פקודות הוא מריץ, באיזה סדר, ואיך הוא מטפל בשגיאות

### תרגיל 3: פורמט ו-Linting (15 דקות)

```bash
mkdir ~/missions/code-format && cd $_
kiro
```

1. בקשו מ-Kiro CLI להגדיר linter ו-formatter לפרויקט:
    - **"תוסיף ESLint ו-Prettier לפרויקט, תגדיר כללים סבירים, ותפרמט את כל הקוד"**
2. בדקו את התוצאה — האם Kiro CLI:
    - התקין את הכלים
    - יצר קבצי הגדרות
    - הריץ את הפורמט
    - בדק שאין שגיאות

### תרגיל 4: תקשורת ודיבוג (15 דקות)

```bash
mkdir ~/missions/debug && cd $_
kiro
```

בצעו אחת מהמשימות הבאות (לפי הסביבה שלכם):

**אופציה A — API debugging:**

```
> "תשלח GET request ל-https://jsonplaceholder.typicode.com/posts/1,
  תנתח את ה-response, ותכתוב test שבודק שה-API מחזיר את המבנה הנכון"
```

**אופציה B — Docker:**

```
> "תראה לי את כל ה-containers שרצים, כמה משאבים הם צורכים,
  ותנקה images שלא בשימוש"
```

**אופציה C — Git archaeology:**

```
> "תמצא את 5 הקבצים שהשתנו הכי הרבה פעמים בחודש האחרון
  ותגיד לי מי המפתחים שעבדו עליהם"
```

## דפוסים לעבודה אפקטיבית עם Terminal Agents

### 1. תנו context מלא

```
# ❌ לא מספיק
> "תתקן את הבאג"

# ✅ מספיק context
> "ה-API ב-/users מחזיר 500 כשיש user בלי email.
  תבדוק את src/routes/users.ts ואת ה-logs"
```

### 2. משימה אחת בכל פעם

```
# ❌ יותר מדי בבת אחת
> "תתקין Docker, תגדיר CI, תכתוב tests, ותעשה deploy"

# ✅ צעד אחד
> "תתקין Docker ותיצור Dockerfile לפרויקט"
# (ואז בסשן הבא: CI, וכו')
```

### 3. בדקו את הפלט

Terminal agents מראים לכם **בדיוק** מה הם מריצים. קראו את הפקודות ואת הפלט — זו הזדמנות ללמוד כלים חדשים.

### 4. נצלו את ההרשאות

עבדו במצב שדורש אישור לפעולות כתיבה. זה:

- מונע טעויות
- נותן לכם הזדמנות ללמוד
- יוצר audit trail

## שאלות לדיון

1. אילו משימות יום-יומיות שלכם מתאימות ל-terminal agent אבל אתם עושים ידנית?
2. מה הסיכונים בלתת ל-agent גישה מלאה ל-shell? איך מצמצמים אותם?
3. איך terminal agents משנים את התפקיד של DevOps/SRE?
4. האם יש משימות שלעולם לא הייתם נותנים ל-agent לעשות? למה?

## נקודות מפתח

- Kiro CLI ו-terminal agents הם **יותר מעורכי קוד** — הם agents עם גישה מלאה למערכת
- **לא חייבים פרויקט** — תיקייה ריקה + Kiro CLI = עוזר מערכת לכל משימה
- הכוח הייחודי: התקנות, ניקוי, תקשורת עם שרתים, ניהול Git, databases, CI/CD
- **אישורים הם קריטיים** — תמיד עבדו במצב שדורש אישור לפעולות הרסניות
- השילוב של IDE agent (Kiro IDE / Cursor) + terminal agent (Kiro CLI) נותן כיסוי מלא
- קראו את הפקודות שה-agent מריץ — זו דרך מצוינת ללמוד כלים חדשים
