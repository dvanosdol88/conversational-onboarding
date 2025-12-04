# Chapter 2: Where You Are
## Dialogue Script & Branching Logic

**Estimated Time:** 6 minutes  
**Total Nodes:** 62  
**Major Branch Points:** 15

---

## Variables Collected

### Income Variables
| Variable | Type | Description |
|----------|------|-------------|
| `annualIncome` | number | Base annual income before taxes |
| `hasBonus` | boolean | Whether they receive bonuses |
| `bonusAmount` | number | Typical annual bonus |
| `hasOtherIncome` | boolean | Whether they have other income |
| `otherIncomeAmount` | number | Other annual income |
| `otherIncomeSource` | string | Source of other income |
| `totalIncome` | number | **Calculated:** annualIncome + bonusAmount + otherIncomeAmount |

### Asset Variables
| Variable | Type | Description |
|----------|------|-------------|
| `checkingSavings` | number | Cash in checking/savings |
| `has401k` | boolean | Has employer retirement plan |
| `balance401k` | number | 401(k)/403(b) balance |
| `hasTraditionalIRA` | boolean | Has Traditional IRA |
| `balanceTraditionalIRA` | number | Traditional IRA balance |
| `hasRothIRA` | boolean | Has Roth IRA |
| `balanceRothIRA` | number | Roth IRA balance |
| `hasPension` | boolean | Has pension |
| `pensionDetails` | string | Pension description |
| `hasTaxableBrokerage` | boolean | Has taxable investments |
| `balanceTaxableBrokerage` | number | Brokerage account balance |
| `ownsRealEstate` | boolean | Owns property |
| `primaryHomeValue` | number | Primary home value |
| `otherRealEstateValue` | number | Other real estate value |
| `hasOtherAssets` | boolean | Has other significant assets |
| `otherAssetsValue` | number | Other assets value |
| `otherAssetsDescription` | string | Description of other assets |
| `totalAssets` | number | **Calculated:** Sum of all assets |

### Debt Variables
| Variable | Type | Description |
|----------|------|-------------|
| `hasMortgage` | boolean | Has mortgage |
| `mortgageBalance` | number | Remaining mortgage balance |
| `mortgageRate` | number | Mortgage interest rate |
| `hasStudentLoans` | boolean | Has student loans |
| `studentLoanBalance` | number | Total student loan balance |
| `hasAutoLoan` | boolean | Has auto loans |
| `autoLoanBalance` | number | Total auto loan balance |
| `hasCreditCardDebt` | boolean | Carries credit card balance |
| `creditCardBalance` | number | Total credit card balance |
| `hasOtherDebt` | boolean | Has other debts |
| `otherDebtBalance` | number | Other debt balance |
| `otherDebtDescription` | string | Description of other debt |
| `totalDebt` | number | **Calculated:** Sum of all debts |

### Summary Variables
| Variable | Type | Description |
|----------|------|-------------|
| `netWorth` | number | **Calculated:** totalAssets - totalDebt |
| `liquidNetWorth` | number | **Calculated:** Net worth minus home equity |

---

## Flow Overview

```
Chapter Intro → Data Entry Method → [Coming Soon if upload/link]
    ↓
INCOME SECTION
    Annual Income → Bonus? → [Bonus Amount] → Other Income? → [Other Income Details] → Income Summary
    ↓
ASSETS SECTION
    Cash → 401k? → [Balance] → Traditional IRA? → [Balance] → Roth IRA? → [Balance] 
    → Pension? → [Details] → Brokerage? → [Balance] → Real Estate? → [Home Value] 
    → [Other Properties] → Other Assets? → [Details] → Assets Complete
    ↓
DEBTS SECTION
    Mortgage? → [Details] → Student Loans? → [Balance] → Auto Loan? → [Balance]
    → Credit Cards? → [Balance] → Other Debt? → [Details] → Debts Complete
    ↓
NET WORTH REVEAL
    Calculate → Display → Reaction → Liquid Note → Summary → Confirm → Done
```

---

## Section 1: Introduction & Data Entry Method

| Node ID | Type | Content | Next |
|---------|------|---------|------|
| `chapter_2_intro` | ai_message | "Great progress, {{userName}}! Now let's look at where you stand today — your income, what you've saved, and what you owe.<br><br>This is like taking a financial snapshot. Don't worry about being exact — estimates are fine." | `data_entry_method` |
| `data_entry_method` | choice | "How would you like to share your financial information?" | **BRANCH** |

### Data Entry Options

| Option | Value | Next |
|--------|-------|------|
| I'll enter it manually | `manual` | `manual_entry_start` |
| Upload my statements | `upload` | `upload_coming_soon` |
| Connect my accounts (Plaid) | `link` | `link_coming_soon` |

| Node ID | Content | Next |
|---------|---------|------|
| `upload_coming_soon` | "Statement upload is coming soon! For now, let's enter the information manually. It only takes a few minutes, and estimates are totally fine." | `manual_entry_start` |
| `link_coming_soon` | "Account linking is coming soon! For now, let's enter the information manually. It only takes a few minutes, and estimates are totally fine." | `manual_entry_start` |
| `manual_entry_start` | "Let's start with your income." | `ask_annual_income` |

---

## Section 2: Income

| Node ID | Type | Content | Variable | Next |
|---------|------|---------|----------|------|
| `ask_annual_income` | input (number) | "What's your approximate annual income before taxes?"<br>*Helper: Your base salary or typical annual earnings. Don't include bonuses yet.* | `annualIncome` | `income_response` |
| `income_response` | ai_message | "Got it — ${{annualIncome}} annually." | — | `ask_has_bonus` |

### Bonus Branch

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_bonus` | choice | "Do you typically receive bonuses or commissions on top of that?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_bonus_amount` |
| No | `false` | `ask_has_other_income` |

| Node ID | Type | Content | Variable | Next |
|---------|------|---------|----------|------|
| `ask_bonus_amount` | input (number) | "In a typical year, how much do you receive in bonuses or commissions?" | `bonusAmount` | `bonus_response` |
| `bonus_response` | ai_message | "Nice — that's a meaningful addition to your income." | — | `ask_has_other_income` |

### Other Income Branch

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_other_income` | choice | "Any other income sources? (rental income, side business, investments, etc.)" |

| Option | Value | Next |
|--------|-------|------|
| Yes, I have other income | `true` | `ask_other_income_details` |
| No, that's it | `false` | `income_summary` |

| Node ID | Type | Content | Variables | Next |
|---------|------|---------|-----------|------|
| `ask_other_income_details` | multi_input | "Tell me about your other income:" | `otherIncomeSource`, `otherIncomeAmount` | `other_income_response` |
| `other_income_response` | ai_message | "{{otherIncomeSource}} bringing in about ${{otherIncomeAmount}} a year — good to know." | — | `income_summary` |

### Income Summary

| Node ID | Content | Computed Variable |
|---------|---------|-------------------|
| `income_summary` | "So your total annual income is roughly **${{totalIncome}}**. That's what we're working with.<br><br>Now let's look at what you've built up — your assets." | `totalIncome` = annualIncome + bonusAmount + otherIncomeAmount |

---

## Section 3: Assets

### Cash

| Node ID | Type | Content | Variable | Next |
|---------|------|---------|----------|------|
| `assets_intro` | ai_message | "We'll go through this in buckets: cash, retirement accounts, investments, real estate, and anything else significant." | — | `ask_checking_savings` |
| `ask_checking_savings` | input (number) | "How much do you have in checking and savings accounts combined?"<br>*Helper: Your liquid cash — emergency fund, everyday accounts, etc.* | `checkingSavings` | `cash_response` |
| `cash_response` | ai_message | Dynamic response based on amount | — | `retirement_intro` |

**Cash Response Logic:**
- Over $50K: "That's a solid cushion."
- $20K-$50K: "Good — you've got a buffer."
- $10K-$20K: "That's a start."
- Under $10K: "We might talk about building that up a bit."

### Retirement Accounts

| Node ID | Type | Content |
|---------|------|---------|
| `retirement_intro` | ai_message | "Now let's go through your retirement accounts. I'll ask about each type separately." |

#### 401(k)

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_401k` | choice | "Do you have a 401(k), 403(b), or similar employer retirement plan?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_401k_balance` |
| No | `false` | `ask_has_traditional_ira` |

| Node ID | Content | Variable |
|---------|---------|----------|
| `ask_401k_balance` | "What's your current 401(k) balance?"<br>*Helper: Include all employer plans — current and old 401(k)s.* | `balance401k` |

**401(k) Response Logic:**
- Over $500K: "Impressive — you've been diligent."
- $200K-$500K: "Solid progress."
- $50K-$200K: "You're building."
- Under $50K: "Every bit counts."

#### Traditional IRA

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_traditional_ira` | choice | "Do you have a Traditional IRA?"<br>*Helper: A tax-deferred retirement account you open yourself.* |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_traditional_ira_balance` → `ask_has_roth_ira` |
| No | `false` | `ask_has_roth_ira` |

#### Roth IRA

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_roth_ira` | choice | "Do you have a Roth IRA?"<br>*Helper: Withdrawals in retirement are tax-free.* |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_roth_ira_balance` → `ask_has_pension` |
| No | `false` | `ask_has_pension` |

#### Pension

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_pension` | choice | "Do you have a pension (defined benefit plan) from any employer?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_pension_details` → `pension_response` → `retirement_summary` |
| No | `false` | `retirement_summary` |

| Node ID | Content |
|---------|---------|
| `retirement_summary` | Dynamic: Shows total retirement savings or notes it's an area to focus on |

### Taxable Investments

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_taxable_brokerage` | choice | "Do you have any taxable investment accounts? (Brokerage accounts, stocks, ETFs, mutual funds outside retirement accounts)" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_brokerage_balance` → `brokerage_response` → `ask_owns_real_estate` |
| No | `false` | `ask_owns_real_estate` |

### Real Estate

| Node ID | Type | Content |
|---------|------|---------|
| `ask_owns_real_estate` | choice | "Do you own any real estate?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_primary_home_value` → `ask_other_real_estate` |
| No, I rent | `false` | `ask_has_other_assets` |

| Node ID | Type | Content |
|---------|------|---------|
| `ask_other_real_estate` | choice | "Do you own any other real estate? (rental properties, vacation home, land)" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_other_real_estate_value` → `ask_has_other_assets` |
| No, just my primary home | `false` | `ask_has_other_assets` |

### Other Assets

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_other_assets` | choice | "Any other significant assets we should know about? (business ownership, crypto, valuable collections, etc.)" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_other_assets_details` → `assets_complete` |
| No, that covers it | `false` | `assets_complete` |

| Node ID | Content | Computed Variable |
|---------|---------|-------------------|
| `assets_complete` | "Great — I've got the asset picture. Now let's look at the other side: what you owe." | `totalAssets` = sum of all assets |

---

## Section 4: Debts

| Node ID | Content |
|---------|---------|
| `debts_intro` | "Most people have some debt — mortgages, student loans, car payments. No judgment here. We just need to know what we're working with." |

### Mortgage

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_mortgage` | choice | "Do you have a mortgage?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_mortgage_details` (multi_input: balance + rate) → `mortgage_response` |
| No | `false` | `ask_has_student_loans` |

**Mortgage Response Logic (based on rate):**
- Under 4%: "that's a great rate. Probably worth keeping."
- 4-6%: "decent rate given the market."
- Over 6%: "rates have been wild. We can talk about whether refinancing makes sense."

### Student Loans

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_student_loans` | choice | "Do you have any student loans?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_student_loan_balance` → `student_loan_response` |
| No | `false` | `ask_has_auto_loan` |

**Student Loan Response Logic:**
- Over $100K: "That's significant — we'll definitely factor that into your plan."
- $50K-$100K: "Pretty common these days. We'll work on a payoff strategy."
- Under $50K: "Manageable. We'll get that taken care of."

### Auto Loans

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_auto_loan` | choice | "Any car loans?" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_auto_loan_balance` → `ask_has_credit_card_debt` |
| No | `false` | `ask_has_credit_card_debt` |

### Credit Cards

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_credit_card_debt` | choice | "Do you carry any credit card balances month to month?"<br>*Helper: Be honest — this is important for planning. No judgment.* |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_credit_card_balance` → `credit_card_response` |
| No, I pay in full each month | `false` | `ask_has_other_debt` |

**Credit Card Response Logic:**
- Over $20K: "That's eating into your progress with those interest rates. Priority one."
- $10K-$20K: "Credit card rates are brutal. We'll work on knocking that out."
- Under $10K: "Not too bad — let's get that cleared."

### Other Debt

| Node ID | Type | Content |
|---------|------|---------|
| `ask_has_other_debt` | choice | "Any other debts? (personal loans, medical debt, family loans, etc.)" |

| Option | Value | Next |
|--------|-------|------|
| Yes | `true` | `ask_other_debt_details` → `debts_complete` |
| No, that's everything | `false` | `debts_complete` |

| Node ID | Content | Computed Variable |
|---------|---------|-------------------|
| `debts_complete` | "Got it. Let me put this all together..." | `totalDebt` = sum of all debts |

---

## Section 5: Net Worth Reveal

| Node ID | Type | Content | Computed |
|---------|------|---------|----------|
| `calculate_net_worth` | ai_message | "Calculating your net worth..." | `netWorth` = totalAssets - totalDebt |
| `net_worth_reveal` | ai_message | "Here's your financial snapshot:<br><br>**Total Assets:** ${{totalAssets}}<br>**Total Debt:** ${{totalDebt}}<br><br>**Net Worth: ${{netWorth}}**" | — |
| `net_worth_reaction` | ai_message | Dynamic reaction based on net worth | — |
| `liquid_net_worth_note` | ai_message | Note about home equity vs. liquid assets | `liquidNetWorth` |

**Net Worth Reaction Logic:**
- Over $1M: "You've built over a million dollars in net worth. That's significant — you're in a strong position to pursue your goals."
- $500K-$1M: "Half a million in net worth — you've made real progress. Plenty to work with here."
- $250K-$500K: "A quarter million in net worth. You're building a solid foundation."
- $100K-$250K: "You've crossed the six-figure net worth mark. That's a meaningful milestone."
- $0-$100K: "You're in positive territory. Every dollar of net worth is a step forward."
- Negative: "Your debts currently outweigh your assets. That's okay — we'll build a plan to turn that around."

---

## Section 6: Summary & Confirmation

| Node ID | Type | Content |
|---------|------|---------|
| `chapter_2_summary` | ai_message | Full summary showing income, assets breakdown, debts breakdown, and net worth |
| `chapter_2_confirmation` | choice | "Does this look right?" |

### Confirmation Options

| Option | Value | Next |
|--------|-------|------|
| Yes, that's accurate | `correct` | `chapter_2_complete` |
| I need to change something | `edit` | `chapter_2_edit` |

### Edit Flow

| Node ID | Type | Content |
|---------|------|---------|
| `chapter_2_edit` | choice | "No problem — what would you like to update?" |

| Option | Value | Next (loops back) |
|--------|-------|-------------------|
| My income | `edit_income` | `ask_annual_income` |
| My assets | `edit_assets` | `ask_checking_savings` |
| My debts | `edit_debts` | `ask_has_mortgage` |

### Chapter Complete

| Node ID | Content |
|---------|---------|
| `chapter_2_complete` | "Perfect. You've completed Chapter 2 — we now know where you are financially.<br><br>Next up: let's talk about where you're going — your goals and dreams." |

---

## Appendix: AI Response Tone Guide

### For Positive Numbers
- Large amounts: Acknowledge without being over-the-top ("Impressive", "Solid progress")
- Medium amounts: Encouraging ("You're building", "Good start")
- Small amounts: Supportive, not judgmental ("Every bit counts", "We'll work on that")

### For Debt
- Always normalize first ("Most people have debt")
- Be practical, not shaming ("Let's get that cleared", "Priority one")
- Offer hope ("We'll build a plan")

### For Net Worth Reveal
- This is a significant moment — give it weight
- Celebrate positives without being excessive
- For negative net worth: Reassure, don't catastrophize

---

## Appendix: Timing Recommendations

| Node Type | Delay |
|-----------|-------|
| Short acknowledgment | 1200-1500ms |
| Standard response | 1800ms |
| Longer/emotional response | 2000-2500ms |
| Calculations/reveals | 2500-3000ms |
| Full summary | 4000ms |

---

## Appendix: Implementation Notes

1. **Currency formatting:** All dollar amounts should display with commas (e.g., $150,000 not $150000)

2. **Calculations should happen client-side** as variables are set, not just at display time

3. **The "Coming Soon" paths** should still set `dataEntryMethod` variable before falling through to manual entry

4. **Edit loops** may cause recalculation — ensure totals update correctly when individual values change

5. **Zero handling:** If someone has no assets or no debts, handle the summary display gracefully (don't show "$0" for every category, just skip or note "None")
