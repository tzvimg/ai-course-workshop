# Facilitator Guide — 2-Day Intensive

Internal planning doc for whoever is running the workshop. Not part of the published site — keep it out of `mkdocs.yml` nav.

## The scope decision you need to make first

The syllabus math doesn't fit: 13 modules × (30 lecture + 60 hands-on + 15 discussion) = 22.75 hours. A realistic 2-day intensive gives you about 15 hours total (two ~7.5-hour days with breaks and lunch). Something has to give, and it's better to cut deliberately now than to discover it live on stage.

Timing audit of the actual exercises (not the syllabus estimate) shows a hard difficulty cliff:

- **Modules 1–4 and 9** are chat/CLI-driven, no real coding required. Good for everyone, including devs with zero AI-tool experience.
- **Module 5** needs Node/TS/vitest comfort but is still concept-light.
- **Modules 6, 7, 8, 10, 11, 12** require real TypeScript/Python (or bash) programming, SDK installs, and API keys. Module 10's own exercise, honestly timed, is ~90–120 min, not the stated 60.
- **Module 13** (capstone) is a 3–5 hour backend build. It does not fit inside a 2-day agenda alongside everything else, full stop.

**Recommendation:** run Modules 1–6 and 8–10 hands-on across the two days. Send Module 7 (Agentic Coding Loop) home together with Modules 11–12 as a self-paced extension pack. Module 7 slots in conceptually right after Module 6 — it's the natural next step of automating the agent loop you just built — but the day genuinely has no room left for it live; it's still valuable and skippable without breaking the narrative arc: prompting → tools → building an agent → extending it. Give Module 13 a compressed **sprint** slot at the end of Day 2 — a working `/summarize` endpoint, not the full spec — and let people finish it on their own time. Offer an optional follow-up session (async Slack thread or a 1-hour call a week later) for people who want to demo their finished capstones.

If you'd rather cover all 13 with full hands-on time, the honest alternative is a 3rd day. Say so to your team now rather than mid-workshop.

---

## Day 1 — Foundations (works for every skill level)

Target: 9:00–17:50. This is a full, intensive day — protect the breaks, they're not padding.

| Time | Block | Duration | Notes |
|---|---|---|---|
| 09:00–09:20 | Welcome, goals, environment check | 20 | Confirm every laptop has a working AI tool + API key *before* Module 1 starts — see prep checklist below |
| 09:20–10:50 | **Module 1** — Prompt Engineering | 90 | Chat-tool only, no setup. Safe on-ramp even for skeptics |
| 10:50–11:05 | Break | 15 | |
| 11:05–12:35 | **Module 2** — AI Dev Workflows | 90 | Trim scope: do the **filesystem MCP server only**; treat the GitHub MCP + PAT setup as optional/take-home to avoid token-creation rabbit holes eating group time |
| 12:35–13:20 | Lunch | 45 | |
| 13:20–14:50 | **Module 3** — Terminal Agents (Kiro CLI) | 90 | Verify Kiro CLI install succeeded for everyone *before* lunch ends, not during the slot |
| 14:50–15:05 | Break | 15 | |
| 15:05–16:35 | **Module 4** — Plan Mode | 90 | Builds directly on Module 3 — don't let stragglers fall behind here, it compounds into Day 2 |
| 16:35–16:50 | Break | 15 | |
| 16:50–17:35 | **Module 9** — Skills | 45 | Trim hands-on to the 2 prebuilt skills + 1 custom skill; skip the 3 debugging scenarios unless the room is ahead of schedule |
| 17:35–17:50 | Day 1 wrap, preview Day 2 | 15 | Flag: tomorrow is programming-heavy — pair up if you're not a confident TS/Python dev |

## Day 2 — Building (programming-heavy — pair juniors with seniors)

Target: 9:00–18:00. Also a long day; the release valve if you're running behind is Module 10's second half (see per-module notes).

| Time | Block | Duration | Notes |
|---|---|---|---|
| 09:00–09:15 | Kickoff, pairing check, API key verification | 15 | Confirm `ANTHROPIC_API_KEY` (or equivalent) is live for every pair — this is the #1 Day 2 blocker |
| 09:15–10:45 | **Module 5** — Steering | 90 | Trim to 1–2 of the 3 mini-projects (recommend the TDD one — most transferable). Bridge module: reinforces Day 1, previews "guardrails for agents" |
| 10:45–11:00 | Break | 15 | |
| 11:00–13:00 | **Module 6** — Building a Coding Agent from Scratch | 120 | The anchor module of the day. Full 120 min matches the actual exercise scope — don't compress this one |
| 13:00–13:45 | Lunch | 45 | |
| 13:45–15:15 | **Module 8** — MCP Servers | 90 | Build the notes MCP server; skip the GitHub MCP walkthrough (redundant with Module 2's optional piece) |
| 15:15–15:30 | Break | 15 | |
| 15:30–16:30 | **Module 10** — Sub-Agents | 60 | Trim to: observe parallel exploration + walk through the orchestrator skeleton together. Skip building the full parallelized implementation — demo it instead if you're on time |
| 16:30–16:45 | Break | 15 | |
| 16:45–18:00 | **Module 13 sprint** — Repo Summarizer | 75 | Explicitly framed as a sprint: get a working endpoint with basic file filtering. Full spec (error handling, edge cases, polish) goes home as take-home. Last ~15 min: 2–3 volunteers demo what they have |

**Sent home, not covered live:** Module 7 (Agentic Coding Loop), Module 11 (Building AI Features), and Module 12 (Advanced Patterns / Production). Package these as a follow-up email with the module links and an offer to review their work async or in an optional follow-up session.

---

## Handling a mixed-skill room

You flagged this as a specific concern — some devs have AI-tool experience, some don't, within the same room. Concrete tactics, roughly in order of effort:

1. **Pair, don't stream-separate, for Day 1.** Modules 1–4 and 9 don't require programming fluency, so mixed pairs work fine and the less-experienced partner gets to drive. Rotate pairs at lunch so nobody's stuck with a bad match all day.
2. **Pair by skill for Day 2, deliberately.** Put one confident TS/Python dev with one less-confident dev per pair for Modules 6, 8, 10, 13. The stronger dev unblocks tooling/syntax issues; the weaker dev should still type and drive at least half the time — don't let it become "senior codes, junior watches."
3. **Pre-work closes the gap before Day 1, not during it.** If some attendees have literally never used an AI coding tool, send them a 20-minute pre-workshop task: install the tool, run one prompt, read Module 1's intro. This means Module 1 isn't their first exposure and they're not visibly behind from minute one.
4. **Give fast finishers a stated extension, not idle time.** For every hands-on block, have one line ready: "if you finish early, try [X]" — e.g. Module 1: try the same prompts against a second model and compare; Module 6: add a 5th tool to the agent loop; Module 10: try a 3rd parallel exploration angle. Idle fast finishers get bored and start distracting others; a stated extension keeps them engaged without penalizing slower pairs.
5. **Name the two speeds explicitly at the start of Day 2.** Tell the room outright: "Modules 6, 8, 10, and 13 are real programming — if this isn't your daily language, lean on your pair, and that's the expected mode, not a failure." This defuses the anxiety of feeling like the slow one, which is often worse for morale than the actual skill gap.
6. **If you have 2+ facilitators, consider a split track for Day 2 afternoon only.** One facilitator runs Module 10 + capstone at full pace for confident devs; the other runs a slower, more guided version (more live-coding together, less "go build it yourselves") for the rest. Don't split earlier than this — Day 1 and Module 6 benefit from the whole room staying together.

---

## Pre-workshop checklist (do this now, not day-of)

Everything below is already documented for attendees on the [prerequisites page](docs/index.md) — this is the facilitator's version: what *you* need to verify before Day 1 starts, since installation problems eat hands-on time fast.

- [ ] Confirm every attendee has Node.js 18+, Git, and an editor installed (send the [quick verification commands](docs/index.md#בדיקת-סביבה-מהירה) a few days ahead, not the morning of)
- [ ] Confirm every attendee has Kiro CLI (or Claude Code / Cursor) installed and authenticated *before* arriving — this is the single most common time-sink if left for Day 1 morning
- [ ] Confirm every attendee has an active Anthropic API key with balance — required starting Module 2, hard-required from Module 6 onward
- [ ] For Module 13 (or the sprint version): confirm Python 3.10+ is installed if anyone's on macOS/Linux without it by default
- [ ] Pre-create a shared GitHub PAT or walk through PAT creation as pre-work if you're keeping the optional GitHub MCP pieces — don't burn group time on token scopes
- [ ] Have a fallback plan for API outages or a maxed-out shared budget: know who's paying, roughly what $/attendee to expect (~$5–15/attendee per the prerequisites page), and have a backup key ready
- [ ] Do a full dry run of Module 6 and Module 8 yourself in the week before — they're the most likely to have an environment surprise (SDK version drift, npm registry issues) since they pin specific package versions in the walkthrough
- [ ] Verify the site builds and renders correctly one more time close to the date (`pip install mkdocs-material && mkdocs serve`) in case content changes land late

---

## If you're running behind

In priority order, these are the safe things to cut without breaking the next module's prerequisites:

1. Module 10's parallelized-implementation portion (demo instead of build) — saves ~30 min, no downstream dependency
2. Module 9's debugging scenarios — saves ~15 min, self-contained
3. Module 2's MCP portion entirely (mention it, don't hands-on it) — saves ~20 min, Module 8 re-teaches MCP from scratch anyway
4. Shorten Module 5 to a single mini-project instead of two — saves ~20 min

Do **not** cut time from Module 6 (everything from Module 7 onward assumes the agent-loop mental model it builds) or from breaks (a tired room makes worse decisions in Module 10's async/parallel material than a well-rested one does).
