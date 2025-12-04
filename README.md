# Onboarding Prototype Package

Everything you need to build the conversational onboarding prototype using AI coding tools.

---

## What's In This Package

```
onboarding-prototype/
├── PROMPT_FOR_AI_CODER.md    ← The main prompt (give this to Claude Code/Cursor)
├── README.md                  ← You're reading it
└── src/
    ├── data/
    │   └── chapter1.json      ← The complete dialogue script (58 nodes)
    └── engine/
        └── types.ts           ← TypeScript types (foundational)
```

---

## How to Use This (3 Steps)

### Step 1: Open Claude Code or Cursor

**If using Claude Code:**
```bash
cd /path/to/where/you/want/the/project
claude
```

**If using Cursor:**
- Open Cursor
- Create a new folder for the project
- Open the AI chat panel

---

### Step 2: Give It the Prompt

Copy the **entire contents** of `PROMPT_FOR_AI_CODER.md` and paste it into the AI chat.

Then say:

> "Build this project. Start by setting up Vite + React + TypeScript + Tailwind, then implement each component and the dialogue engine. Here's the dialogue JSON and types to use:"

Then paste the contents of:
1. `src/data/chapter1.json`
2. `src/engine/types.ts`

---

### Step 3: Let It Build

The AI will:
1. Create the project structure
2. Install dependencies
3. Build each component
4. Wire everything together

**If it gets stuck or makes errors**, just tell it what went wrong and it will fix it.

---

## Testing the Prototype

Once built, run:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

Walk through the conversation:
1. Enter your name
2. Enter your age (try different values: 28, 45, 62)
3. Pick an employment type
4. Continue through upbringing and advisor experience
5. Check that the summary reflects your actual inputs

---

## If Something Breaks

Common issues and fixes:

| Problem | Fix |
|---------|-----|
| "Module not found" | Ask AI to check imports |
| Styling looks wrong | Ask AI to review Tailwind classes |
| Branching doesn't work | Ask AI to check conditional evaluation |
| Typing indicator doesn't show | Ask AI to check the delay/timing logic |

---

## Next Steps After It Works

1. **Test all paths** — Go through as different personas (young/old, employed/retired, etc.)
2. **Tweak the copy** — Edit `chapter1.json` to refine AI responses
3. **Add Chapter 2** — Use the same structure to build the next chapter
4. **Make it pretty** — Refine colors, add your logo, etc.

---

## Files Reference

### PROMPT_FOR_AI_CODER.md
The complete specification: project structure, component specs, how the engine works, styling guidelines, and done criteria. This is the main document to give to AI.

### src/data/chapter1.json
The dialogue script with 58 nodes covering:
- Welcome & name (3 nodes)
- Age with branching (4 nodes)
- Employment with 5 branches (~20 nodes)
- Financial upbringing with 4 branches (~12 nodes)
- Advisor experience with 3 branches (~15 nodes)
- Summary & confirmation (4 nodes)

### src/engine/types.ts
TypeScript interfaces for:
- All node types (ai_message, input, choice, multi_input)
- Runtime state (variables, message history, etc.)
- Actions for state management

---

Good luck! 🚀
