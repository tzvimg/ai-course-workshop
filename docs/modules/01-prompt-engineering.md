# מודול 1: Prompt Engineering לקוד

!!! info "משך"
    30 דקות הרצאה + 60 דקות hands-on + 15 דקות דיון

## מטרות למידה

בסוף המודול הזה, תוכלו:

- לכתוב prompts שמייצרים קוד ברמת production מהניסיון הראשון
- להשתמש ב-few-shot examples, personas ו-chain-of-thought בצורה יעילה
- לזהות ולהימנע מ-anti-patterns נפוצים ב-prompting

## נושאים

### כתיבת Prompts יעילים

- **היו ספציפיים:** "תוסיפו input validation" לעומת "תוסיפו Zod validation לפורמט email, שדה name חובה, ו-phone אופציונלי בפורמט E.164"
- **ספקו context:** שפה, framework, דפוסים קיימים, אילוצים
- **ציינו אילוצים:** דרישות ביצועים, style guides, בלי dependencies חיצוניים

### Few-Shot Examples

הראו ל-AI מה אתם רוצים באמצעות דוגמה:

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

### Chain-of-Thought לבעיות מורכבות

בקשו מה-AI לחשוב צעד אחר צעד:

```
I need to migrate our authentication from JWT to session-based auth.

Before writing code, please:
1. List all files that would need to change
2. Outline the migration strategy
3. Identify potential breaking changes
4. Then implement the changes one file at a time
```

### Anti-Patterns

- **מעורפל מדי:** "Make it better"
- **יותר מדי בבת אחת:** לבקש אפליקציה שלמה ב-prompt אחד
- **בלי context:** prompting בלי לציין שפה, framework או דפוסים
- **התעלמות משגיאות:** לא להזין הודעות שגיאה חזרה ל-AI

## תרגיל מעשי

### אתגר שיפור Prompts

**התחילו עם דרישה מעורפלת:**

> "Build a user registration system"

**סיבוב 1:** שלחו את זה כמו שזה לכלי AI. רשמו מה קיבלתם.

**סיבוב 2:** הוסיפו פרטים — שפה, framework, כללי validation, database.

**סיבוב 3:** הוסיפו הקשר פרויקט — דפוסים קיימים, מבנה קבצים, סגנון קוד.

**סיבוב 4:** הוסיפו אילוצים — דרישות אבטחה, טיפול בשגיאות, בדיקות.

**השוו את הפלטים.** כמה כל שיפור שיפר את התוצאה?

## נקודות מפתח

- Prompting הוא מיומנות — ההבדל בין prompt מעורפל למדויק הוא עצום
- תמיד ספקו context: שפה, framework, דפוסים קיימים
- השתמשו ב-few-shot examples כשאתם רוצים סגנון עקבי
- פרקו משימות מורכבות לצעדים עם chain-of-thought
- הזינו שגיאות חזרה — כלי AI לומדים מהשיחה
