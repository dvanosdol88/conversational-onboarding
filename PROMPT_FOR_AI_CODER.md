# Build This: Conversational Onboarding Prototype

## What I Need You to Build

A React + Tailwind web app that simulates a conversational AI onboarding experience for a financial advisory firm. Users go through a chapter-based "interview" where an AI assistant asks questions, they respond, and the AI adapts based on their answers.

**This is Chapter 1: "Where You've Been"** — collecting background info (name, age, employment, financial upbringing, previous advisor experience).

---

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **No backend needed** — all state is local

---

## Project Structure

Create this folder structure:

```
onboarding-prototype/
├── src/
│   ├── components/
│   │   ├── ChatBubble.tsx        # AI and user message bubbles
│   │   ├── TypingIndicator.tsx   # Animated "..." typing dots
│   │   ├── TextInput.tsx         # Single-line text input
│   │   ├── NumberInput.tsx       # Number input (for age)
│   │   ├── TextArea.tsx          # Multi-line text input
│   │   ├── ChoiceButtons.tsx     # Multiple choice selection
│   │   ├── SelectInput.tsx       # Dropdown select
│   │   ├── MultiInputForm.tsx    # Form with multiple fields
│   │   ├── ContinueButton.tsx    # Primary action button
│   │   ├── ProgressTracker.tsx   # Chapter progress indicator
│   │   └── ChatContainer.tsx     # Scrollable message history
│   ├── engine/
│   │   ├── DialogueEngine.ts     # Core logic for navigating dialogue
│   │   └── types.ts              # TypeScript types for dialogue nodes
│   ├── data/
│   │   └── chapter1.json         # The dialogue script (provided below)
│   ├── hooks/
│   │   └── useDialogue.ts        # React hook for dialogue state
│   ├── App.tsx                   # Main app component
│   ├── index.css                 # Tailwind imports + custom styles
│   └── main.tsx                  # Entry point
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── index.html
```

---

## How the Dialogue Engine Should Work

### Core Concept

The dialogue is defined as a JSON file with "nodes". Each node is either:
- An **AI message** (the AI says something)
- An **input** request (text, number, textarea)
- A **choice** (multiple choice buttons)
- A **multi-input form** (several fields at once)

The engine:
1. Starts at the first node (`welcome`)
2. Displays the node content
3. Waits for user input (if required) or auto-advances after a delay
4. Determines the next node (which might depend on variable values)
5. Repeats until reaching a node with `nextNode: null`

### State to Track

```typescript
interface DialogueState {
  currentNodeId: string;
  variables: Record<string, string | number | boolean>;
  messageHistory: Message[];
  isTyping: boolean;
  isWaitingForInput: boolean;
  isComplete: boolean;
}

interface Message {
  id: string;
  speaker: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
}
```

### Variable Substitution

AI messages can contain `{{variableName}}` placeholders. Before displaying, replace these with actual values:

```typescript
// Example: "Nice to meet you, {{userName}}!" 
// If userName = "David", displays: "Nice to meet you, David!"
```

### Conditional Navigation

Some nodes have `conditionalNext` instead of `nextNode`:

```json
{
  "conditionalNext": [
    { "condition": "userAge < 35", "nextNode": "age_response_young" },
    { "condition": "userAge >= 35 && userAge <= 55", "nextNode": "age_response_mid" },
    { "condition": "userAge > 55", "nextNode": "age_response_senior" }
  ]
}
```

Evaluate conditions against the current variables and navigate to the matching node.

### Timing

Each AI message has a `delay` property (in milliseconds). Show a typing indicator for this duration before revealing the message. This simulates the AI "thinking."

---

## Component Specifications

### ChatBubble

```tsx
interface ChatBubbleProps {
  speaker: 'ai' | 'user';
  content: string;
  timestamp?: Date;
  showTimestamp?: boolean;
}
```

**Styling:**
- AI bubbles: Left-aligned, light gray background (`bg-gray-100`), dark text
- User bubbles: Right-aligned, blue background (`bg-blue-500`), white text
- Both: Rounded corners (`rounded-2xl`), padding (`px-4 py-3`), max-width 70%
- AI avatar: Simple circle with icon or initials on the left

### TypingIndicator

Three dots that animate in sequence. Display inside an AI-styled bubble while `isTyping` is true.

```css
/* Simple CSS animation for the dots */
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

### TextInput

```tsx
interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  required?: boolean;
}
```

**Styling:** Border, rounded, focus ring, full width

### ChoiceButtons

```tsx
interface ChoiceButtonsProps {
  options: { id: string; label: string; value: string }[];
  selectedId: string | null;
  onSelect: (id: string, value: string) => void;
}
```

**Styling:**
- Vertical stack of buttons
- Default: White background, gray border
- Hover: Light gray background
- Selected: Blue border, light blue background, checkmark icon

### ProgressTracker

```tsx
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  chapterTitle: string;
  estimatedMinutes?: number;
}
```

**Styling:** Horizontal bar at top, shows "Chapter 1 of 5" with progress bar and time estimate

### ContinueButton

```tsx
interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string; // Default: "Continue"
}
```

**Styling:** 
- Primary: Green background (`bg-emerald-600`), white text, full width on mobile
- Disabled: Gray background, not clickable

---

## App Layout

```
┌─────────────────────────────────────────────┐
│  ProgressTracker (sticky top)               │
├─────────────────────────────────────────────┤
│                                             │
│  ChatContainer (scrollable)                 │
│    ├── ChatBubble (AI)                      │
│    ├── ChatBubble (User)                    │
│    ├── ChatBubble (AI)                      │
│    ├── TypingIndicator (when typing)        │
│    └── ...                                  │
│                                             │
├─────────────────────────────────────────────┤
│  InputArea (sticky bottom)                  │
│    ├── [Current input component]            │
│    └── ContinueButton                       │
└─────────────────────────────────────────────┘
```

- Chat container should auto-scroll to bottom when new messages appear
- On mobile: Full screen, input area fixed at bottom
- On desktop: Centered container, max-width ~600px

---

## User Flow

1. **Page loads** → Engine starts at `welcome` node
2. **AI message appears** → Show typing indicator for `delay` ms, then show message
3. **If node requires input** → Show appropriate input component, wait for user
4. **User submits** → Add user's response as a message, save to variables
5. **Engine advances** → Evaluate `nextNode` or `conditionalNext`, go to next node
6. **Repeat** until `isChapterEnd: true`
7. **Chapter complete** → Show completion message, disable further input

---

## Important Behaviors

1. **Message history persists** — Users can scroll up to see previous messages
2. **Variables persist** — Once set, variables remain for the whole session
3. **Typing feels natural** — Use the delay values; don't make it instant
4. **Smooth scrolling** — When new messages appear, smoothly scroll to bottom
5. **Input validation** — Don't allow continuing with empty required fields
6. **Edit flow** — The summary screen has an "edit" option that loops back; handle this gracefully

---

## Sample Interaction Flow

```
1. [AI typing indicator - 2000ms]
2. [AI message appears]: "Hi! I'm here to help you prepare..."
3. [AI typing indicator - 1500ms]  
4. [AI message appears]: "What's your name, and what should I call you?"
5. [Text input appears]
6. [User types "David" and clicks Continue]
7. [User message appears]: "David"
8. [Variable set]: userName = "David"
9. [AI typing indicator - 1500ms]
10. [AI message appears]: "Nice to meet you, David! Let's learn a bit about you."
11. [AI typing indicator - 1500ms]
12. [AI message appears]: "How old are you?"
13. [Number input appears]
... and so on
```

---

## The Dialogue Data

The complete dialogue JSON is in `src/data/chapter1.json`. It contains 58 nodes with all the branching logic for Chapter 1.

Key node types you'll encounter:

```typescript
// AI Message - just displays text, then auto-advances
{
  "id": "welcome",
  "type": "ai_message",
  "speaker": "ai",
  "content": "Hi! I'm here to help...",
  "nextNode": "ask_name",
  "delay": 2000
}

// Text Input - waits for user text
{
  "id": "ask_name",
  "type": "input",
  "speaker": "ai",
  "content": "What's your name?",
  "inputType": "text",
  "placeholder": "Your preferred name",
  "setsVariable": "userName",
  "nextNode": "greet_by_name"
}

// Choice - waits for user to pick an option
{
  "id": "ask_occupation",
  "type": "choice",
  "speaker": "ai", 
  "content": "What best describes your work situation?",
  "setsVariable": "employmentType",
  "options": [
    { "id": "employed", "label": "I work for an employer", "value": "employed", "nextNode": "occupation_employed_details" },
    { "id": "self_employed", "label": "I run my own business", "value": "self_employed", "nextNode": "occupation_self_employed_details" }
  ]
}

// Conditional navigation based on variable values
{
  "id": "ask_age",
  "type": "input",
  "inputType": "number",
  "setsVariable": "userAge",
  "conditionalNext": [
    { "condition": "userAge < 35", "nextNode": "age_response_young" },
    { "condition": "userAge >= 35 && userAge <= 55", "nextNode": "age_response_mid" },
    { "condition": "userAge > 55", "nextNode": "age_response_senior" }
  ]
}

// Multi-input form - multiple fields at once
{
  "id": "occupation_employed_details",
  "type": "multi_input",
  "speaker": "ai",
  "content": "Tell me a bit more:",
  "inputs": [
    { "id": "job_title", "label": "Job title?", "inputType": "text", "setsVariable": "occupation", "required": true },
    { "id": "employer", "label": "Employer?", "inputType": "text", "setsVariable": "employer", "required": false }
  ],
  "nextNode": "occupation_employed_response"
}
```

---

## Styling Guidelines

Use Tailwind CSS throughout. Key design tokens:

```
Colors:
- Primary green: bg-emerald-600 (buttons, accents)
- AI bubble: bg-gray-100
- User bubble: bg-blue-500
- Text: text-gray-900 (primary), text-gray-500 (secondary)
- Background: bg-white or bg-gray-50

Typography:
- Font: Default Tailwind (Inter if available)
- AI messages: text-base (16px)
- Timestamps: text-xs text-gray-400
- Buttons: text-base font-medium

Spacing:
- Message gap: space-y-4
- Container padding: p-4 md:p-6
- Input padding: px-4 py-3

Borders:
- Bubbles: rounded-2xl
- Inputs: rounded-lg border border-gray-300
- Buttons: rounded-lg
```

---

## Done Criteria

The prototype is complete when:

1. ✅ I can enter my name and see it reflected in AI responses
2. ✅ I can enter my age and get an age-appropriate response
3. ✅ I can select my employment type and go through that branch
4. ✅ I can complete all 58 nodes without errors
5. ✅ The summary at the end shows my actual inputs
6. ✅ I can click "edit" and go back to change answers
7. ✅ The typing indicator appears before each AI message
8. ✅ Messages scroll smoothly as the conversation grows
9. ✅ It looks good on both desktop and mobile

---

## Start Building

1. First, set up the project with Vite + React + TypeScript + Tailwind
2. Create the TypeScript types in `engine/types.ts`
3. Build the DialogueEngine in `engine/DialogueEngine.ts`
4. Build each component
5. Wire it all together in App.tsx
6. Test with the provided chapter1.json

Good luck! Ask me if you get stuck on any part.
