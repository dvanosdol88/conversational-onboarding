// Dialogue Node Types

export type NodeType = 'ai_message' | 'input' | 'choice' | 'multi_input';
export type InputType = 'text' | 'number' | 'textarea' | 'select';
export type Speaker = 'ai' | 'user' | 'system';

// Base node interface - all nodes have these properties
export interface BaseNode {
  id: string;
  type: NodeType;
  speaker: Speaker;
  content: string;
}

// AI Message Node - displays a message and auto-advances
export interface AIMessageNode extends BaseNode {
  type: 'ai_message';
  nextNode: string | null;
  delay: number; // milliseconds to show typing indicator
  isChapterEnd?: boolean;
  nextChapter?: string;
}

// Input Node - requests a single text/number/textarea input
export interface InputNode extends BaseNode {
  type: 'input';
  inputType: InputType;
  placeholder?: string;
  helperText?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  setsVariable: string;
  nextNode?: string;
  conditionalNext?: ConditionalNext[];
  computeVariable?: {
    name: string;
    logic: string; // JavaScript expression as string
  };
}

// Choice Node - presents multiple choice options
export interface ChoiceNode extends BaseNode {
  type: 'choice';
  setsVariable?: string;
  helperText?: string;
  options: ChoiceOption[];
}

export interface ChoiceOption {
  id: string;
  label: string;
  value: string;
  nextNode: string;
}

// Multi-Input Node - form with multiple fields
export interface MultiInputNode extends BaseNode {
  type: 'multi_input';
  inputs: MultiInputField[];
  nextNode: string;
}

export interface MultiInputField {
  id: string;
  label: string;
  inputType: InputType;
  placeholder?: string;
  setsVariable: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // for select type
}

// Conditional navigation
export interface ConditionalNext {
  condition: string; // JavaScript expression as string
  nextNode: string;
}

// Union type for all node types
export type DialogueNode = AIMessageNode | InputNode | ChoiceNode | MultiInputNode;

// Chapter metadata
export interface ChapterMetadata {
  id: string;
  title: string;
  subtitle?: string;
  estimatedMinutes: number;
  description?: string;
}

// Variable definitions
export interface VariableDefinition {
  type: 'string' | 'number' | 'boolean';
  default: string | number | boolean | null;
  description?: string;
  enum?: string[];
}

// Complete chapter data structure
export interface ChapterData {
  chapter: ChapterMetadata;
  variables: Record<string, VariableDefinition>;
  nodes: DialogueNode[];
  metadata?: {
    version: string;
    created: string;
    author: string;
    totalNodes: number;
    estimatedBranches: number;
    requiredVariables: string[];
  };
}

// Runtime state types

export interface Message {
  id: string;
  speaker: Speaker;
  content: string;
  timestamp: Date;
  nodeId?: string; // Reference to the dialogue node that generated this
}

export interface DialogueState {
  currentNodeId: string | null;
  variables: Record<string, string | number | boolean>;
  messageHistory: Message[];
  isTyping: boolean;
  isWaitingForInput: boolean;
  isComplete: boolean;
  currentInputValue: string | number | Record<string, string | number>;
}

// Engine actions
export type DialogueAction =
  | { type: 'START' }
  | { type: 'SET_TYPING'; isTyping: boolean }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_VARIABLE'; name: string; value: string | number | boolean }
  | { type: 'SET_CURRENT_NODE'; nodeId: string | null }
  | { type: 'SET_WAITING_FOR_INPUT'; isWaiting: boolean }
  | { type: 'SET_INPUT_VALUE'; value: string | number | Record<string, string | number> }
  | { type: 'SUBMIT_INPUT' }
  | { type: 'SELECT_CHOICE'; optionId: string; value: string; nextNode: string }
  | { type: 'COMPLETE' };

// Helper type for node lookup
export type NodeMap = Map<string, DialogueNode>;
