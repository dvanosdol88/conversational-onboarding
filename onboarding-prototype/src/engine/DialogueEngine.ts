import type {
    ChapterData,
    DialogueNode,
    DialogueState,
    Message,
    ConditionalNext,
    InputNode
} from './types';

export class DialogueEngine {
    private data: ChapterData;
    private nodeMap: Map<string, DialogueNode>;

    constructor(data: ChapterData) {
        this.data = data;
        this.nodeMap = new Map(data.nodes.map(node => [node.id, node]));
    }

    public getInitialState(): DialogueState {
        const startNode = this.data.nodes[0];
        return {
            currentNodeId: startNode ? startNode.id : null,
            variables: this.initializeVariables(),
            messageHistory: [],
            isTyping: false,
            isWaitingForInput: false,
            isComplete: false,
            currentInputValue: ''
        };
    }

    private initializeVariables(): Record<string, string | number | boolean> {
        const vars: Record<string, string | number | boolean> = {};
        Object.entries(this.data.variables).forEach(([key, def]) => {
            if (def.default !== null) {
                vars[key] = def.default;
            }
        });
        return vars;
    }

    public getNode(nodeId: string): DialogueNode | undefined {
        return this.nodeMap.get(nodeId);
    }

    public processVariableSubstitution(text: string, variables: Record<string, any>): string {
        return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            if (key.includes('?') || key.includes('>') || key.includes('<') || key.includes('==')) {
                try {
                    const keys = Object.keys(variables);
                    const values = Object.values(variables);
                    const func = new Function(...keys, `return ${key};`);
                    return String(func(...values));
                } catch (e) {
                    console.warn(`Failed to evaluate expression: ${key}`, e);
                    return '';
                }
            }

            return variables[key] !== undefined ? String(variables[key]) : '';
        });
    }

    public processText(text: string, variables: Record<string, any>): string {
        return text.replace(/\{\{(.*?)\}\}/g, (_, expression) => {
            try {
                const keys = Object.keys(variables);
                const values = Object.values(variables);
                // Use Function constructor for safe-ish evaluation
                const func = new Function(...keys, `return ${expression};`);
                const result = func(...values);

                if (result === undefined || result === null) return '';

                // Format numbers as currency if they look like money or just generally
                // The prompt requested formatting. We'll format all numbers to be safe/nice.
                if (typeof result === 'number') {
                    return result.toLocaleString();
                }

                return String(result);
            } catch (e) {
                console.warn(`Failed to evaluate expression: ${expression}`, e);
                return '';
            }
        });
    }

    public evaluateCondition(condition: string, variables: Record<string, any>): boolean {
        try {
            const keys = Object.keys(variables);
            const values = Object.values(variables);
            const func = new Function(...keys, `return ${condition};`);
            return !!func(...values);
        } catch (e) {
            console.warn(`Failed to evaluate condition: ${condition}`, e);
            return false;
        }
    }

    public getNextNodeId(node: DialogueNode, variables: Record<string, any>): string | null {
        if (node.type === 'input' && (node as InputNode).conditionalNext) {
            const inputNode = node as InputNode;
            if (inputNode.conditionalNext) {
                for (const cond of inputNode.conditionalNext) {
                    if (this.evaluateCondition(cond.condition, variables)) {
                        return cond.nextNode;
                    }
                }
            }
        }

        if ('nextNode' in node) {
            return (node as any).nextNode || null;
        }

        return null;
    }

    public computeVariable(logic: string, variables: Record<string, any>): any {
        try {
            const keys = Object.keys(variables);
            const values = Object.values(variables);
            const func = new Function(...keys, `return ${logic};`);
            return func(...values);
        } catch (e) {
            console.warn(`Failed to compute variable logic: ${logic}`, e);
            return null;
        }
    }

    public loadChapter(newChapter: ChapterData) {
        // Update data reference (or merge)
        this.data = {
            ...newChapter,
            variables: { ...this.data.variables, ...newChapter.variables },
            nodes: [...this.data.nodes, ...newChapter.nodes] // Keep old nodes just in case? Or replace?
            // If we replace, we can't go back. But usually we just move forward.
            // However, keeping them allows for a full history if needed.
            // But for now, let's just add them to the map.
        };

        // Update node map
        newChapter.nodes.forEach(node => {
            this.nodeMap.set(node.id, node);
        });

        // Return new default variables to be merged into state
        const newVars: Record<string, any> = {};
        Object.entries(newChapter.variables).forEach(([key, def]) => {
            if (def.default !== null) {
                newVars[key] = def.default;
            }
        });
        return {
            startNodeId: newChapter.nodes[0]?.id,
            newVariables: newVars
        };
    }
}
