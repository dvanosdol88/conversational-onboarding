# Add Chapter 2: "Where You Are" to the Onboarding Prototype

## Context

You've already built Chapter 1 ("Where You've Been") of a conversational onboarding prototype for a financial advisory firm. Now we're adding Chapter 2.

**Chapter 2: "Where You Are"** collects the client's financial snapshot:
- Income (salary, bonuses, other sources)
- Assets (cash, retirement accounts by type, investments, real estate, other)
- Debts (mortgage, student loans, auto, credit cards, other)
- Calculates and reveals their net worth with a personalized reaction

---

## What to Build

### 1. Add the Chapter 2 dialogue data

Copy the provided `chapter2.json` into your `src/data/` folder alongside `chapter1.json`.

### 2. Update the app to handle chapter transitions

When Chapter 1 ends (node with `isChapterEnd: true`), the app should:
1. Show a brief transition (maybe a "Chapter Complete" animation)
2. Load Chapter 2's dialogue data
3. Continue the conversation seamlessly

The `nextChapter` property on the final node tells you which chapter comes next.

### 3. Handle new node features in Chapter 2

Chapter 2 introduces a few things that Chapter 1 didn't have:

#### Computed Variables
Some nodes have a `computeVariable` property:
```json
{
  "computeVariable": {
    "name": "totalIncome",
    "logic": "annualIncome + bonusAmount + otherIncomeAmount"
  }
}
```

When you reach these nodes, evaluate the `logic` expression using current variable values and store the result in the named variable. Use a safe evaluation method (not raw `eval`).

#### Dynamic Content with Conditionals
Some AI messages have inline conditionals in the content:
```
"{{checkingSavings > 50000 ? 'That\\'s a solid cushion.' : 'We might talk about building that up.'}}"
```

Your template engine needs to handle ternary expressions, not just simple variable substitution.

#### Currency Formatting
All dollar amounts should display with proper formatting:
- `$150000` → `$150,000`
- Use `toLocaleString()` or a formatting library

#### Multi-line Content
Some messages have `\n` for line breaks. Render these as actual line breaks in the chat bubbles.

#### Bold Text
Some messages use `**text**` for emphasis. Render this as bold (or just strip the markers if you want to keep it simple).

---

## New Variables in Chapter 2

Add these to your variable state (all start as `null`, `0`, `false`, or `""`):

### Income
| Variable | Type | Default |
|----------|------|---------|
| `annualIncome` | number | 0 |
| `hasBonus` | boolean | false |
| `bonusAmount` | number | 0 |
| `hasOtherIncome` | boolean | false |
| `otherIncomeAmount` | number | 0 |
| `otherIncomeSource` | string | "" |
| `totalIncome` | number | 0 |

### Assets
| Variable | Type | Default |
|----------|------|---------|
| `checkingSavings` | number | 0 |
| `has401k` | boolean | false |
| `balance401k` | number | 0 |
| `hasTraditionalIRA` | boolean | false |
| `balanceTraditionalIRA` | number | 0 |
| `hasRothIRA` | boolean | false |
| `balanceRothIRA` | number | 0 |
| `hasPension` | boolean | false |
| `pensionDetails` | string | "" |
| `hasTaxableBrokerage` | boolean | false |
| `balanceTaxableBrokerage` | number | 0 |
| `ownsRealEstate` | boolean | false |
| `primaryHomeValue` | number | 0 |
| `otherRealEstateValue` | number | 0 |
| `hasOtherAssets` | boolean | false |
| `otherAssetsValue` | number | 0 |
| `otherAssetsDescription` | string | "" |
| `totalAssets` | number | 0 |

### Debts
| Variable | Type | Default |
|----------|------|---------|
| `hasMortgage` | boolean | false |
| `mortgageBalance` | number | 0 |
| `mortgageRate` | number | 0 |
| `hasStudentLoans` | boolean | false |
| `studentLoanBalance` | number | 0 |
| `hasAutoLoan` | boolean | false |
| `autoLoanBalance` | number | 0 |
| `hasCreditCardDebt` | boolean | false |
| `creditCardBalance` | number | 0 |
| `hasOtherDebt` | boolean | false |
| `otherDebtBalance` | number | 0 |
| `otherDebtDescription` | string | "" |
| `totalDebt` | number | 0 |

### Summary
| Variable | Type | Default |
|----------|------|---------|
| `netWorth` | number | 0 |
| `liquidNetWorth` | number | 0 |

---

## Template Engine Upgrade

Your current template engine probably handles `{{variableName}}`. Upgrade it to handle:

### 1. Simple substitution (existing)
```
"Hello, {{userName}}!"
```

### 2. Arithmetic expressions
```
"Your total is ${{annualIncome + bonusAmount}}"
```

### 3. Ternary conditionals
```
"{{balance > 50000 ? 'Great job!' : 'Keep building.'}}"
```

### 4. Nested ternaries
```
"{{age < 35 ? 'Young' : age < 55 ? 'Mid-career' : 'Senior'}}"
```

### Implementation approach

Use a simple expression evaluator. Here's a safe approach:

```typescript
function evaluateExpression(expr: string, variables: Record<string, any>): any {
  // Create a function with variable names as parameters
  const varNames = Object.keys(variables);
  const varValues = Object.values(variables);
  
  try {
    // Use Function constructor (safer than eval, but still be careful)
    const fn = new Function(...varNames, `return ${expr}`);
    return fn(...varValues);
  } catch (e) {
    console.error('Expression evaluation failed:', expr, e);
    return expr; // Return original on failure
  }
}

function processTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{(.+?)\}\}/g, (match, expr) => {
    const result = evaluateExpression(expr.trim(), variables);
    
    // Format numbers as currency if they look like money
    if (typeof result === 'number' && expr.includes('$')) {
      return result.toLocaleString();
    }
    
    return String(result);
  });
}
```

---

## Chapter Flow Summary

```
Chapter 2 Start
    ↓
Data Entry Method (3 choices)
    ├── Manual → Continue
    ├── Upload → "Coming Soon" → Continue  
    └── Link → "Coming Soon" → Continue
    ↓
Income Section (5-9 nodes depending on bonuses/other income)
    ↓
Assets Section (15-20 nodes depending on what they have)
    ↓
Debts Section (10-15 nodes depending on debt types)
    ↓
Net Worth Calculation & Reveal (4 nodes)
    ↓
Summary & Confirmation
    ├── Correct → Chapter 2 Complete
    └── Edit → Loop back to Income/Assets/Debts
```

---

## UI Considerations

### Net Worth Reveal
This is a "big moment" — consider:
- Slightly longer delay before showing (build anticipation)
- Maybe a subtle animation or emphasis on the number
- The reaction message should feel personal, not robotic

### Progress Tracker
Update to show "Chapter 2 of 5" and reset progress percentage for this chapter.

### Number Inputs
For financial amounts, consider:
- Showing a `$` prefix in the input
- Allowing comma input but stripping for storage
- Formatting the display value as they type (optional, can be tricky)

### Summary Screen
The final summary has a lot of information. Consider:
- Using sections/cards to organize
- Highlighting the net worth prominently
- Making the breakdown scannable (not a wall of text)

---

## Testing Checklist

After implementing, test these scenarios:

### Happy Path
- [ ] Enter income with bonus and other income
- [ ] Add 401k, Roth IRA, and brokerage accounts
- [ ] Add mortgage and credit card debt
- [ ] See net worth calculated correctly
- [ ] Summary shows all entered values
- [ ] Confirm and complete chapter

### Edge Cases
- [ ] No bonus, no other income (skip those branches)
- [ ] No retirement accounts at all
- [ ] Renter (no real estate)
- [ ] No debt at all ("debt free" messaging)
- [ ] Negative net worth (debts > assets)
- [ ] Edit flow works (change income, recalculates totals)

### "Coming Soon" Paths
- [ ] Clicking "Upload statements" shows coming soon, then continues
- [ ] Clicking "Connect accounts" shows coming soon, then continues

---

## Files Provided

1. **chapter2.json** — The complete dialogue script (62 nodes)
2. **This prompt** — Implementation instructions

---

## Start Building

1. Add `chapter2.json` to `src/data/`
2. Upgrade your template engine to handle expressions
3. Add chapter transition logic
4. Add the computed variable feature
5. Test the full flow

Let me know if you hit any issues!
