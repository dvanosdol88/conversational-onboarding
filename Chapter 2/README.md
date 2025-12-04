# Chapter 2 Package: "Where You Are"

Add this chapter to your existing onboarding prototype.

---

## What's Included

```
chapter2_package/
├── PROMPT_FOR_AI_CODER_CHAPTER2.md   ← Give this to Claude Code/Cursor
├── chapter2_dialogue_review.md        ← Human-readable version (for review)
├── README.md                          ← You're reading it
└── src/
    └── data/
        └── chapter2.json              ← The dialogue script (62 nodes)
```

---

## How to Use

### Step 1: Open your existing project in Claude Code

```bash
cd /path/to/onboarding-prototype
claude
```

### Step 2: Give it the prompt

Copy the entire contents of `PROMPT_FOR_AI_CODER_CHAPTER2.md` and paste it into Claude Code.

Then say:

> "Add Chapter 2 to the prototype. Here's the dialogue JSON:"

Then paste the contents of `src/data/chapter2.json`.

### Step 3: Test it

Run the app and complete Chapter 1. It should transition into Chapter 2 automatically.

---

## What Chapter 2 Covers

| Section | Nodes | What It Collects |
|---------|-------|------------------|
| Data Entry Method | 4 | Manual vs Upload vs Link (with "Coming Soon") |
| Income | 9 | Salary, bonuses, other income |
| Assets | 20 | Cash, 401k, IRAs, pension, brokerage, real estate, other |
| Debts | 15 | Mortgage, student loans, auto, credit cards, other |
| Net Worth | 4 | Calculates and reveals with reaction |
| Summary | 4 | Review, edit option, confirmation |

**Total: 62 nodes**

---

## New Features in Chapter 2

Your dialogue engine needs to handle these (the prompt explains how):

1. **Computed variables** — Calculate totals automatically
2. **Ternary expressions** — Dynamic responses based on values
3. **Currency formatting** — $150000 → $150,000
4. **Multi-line messages** — Some messages have line breaks

---

## Quick Test Scenarios

After building, test:

1. **Full path:** Income → Assets → Debts → Net worth reveal → Confirm
2. **Minimal path:** No bonus, no other income, renter, no debt
3. **Edit flow:** Change income after summary, verify recalculation
4. **Coming Soon:** Click "Upload statements" — should show message then continue

---

Good luck! 🚀
