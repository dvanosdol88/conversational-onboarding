import { useState, useEffect, useRef, useCallback } from 'react';
import { DialogueEngine } from '../engine/DialogueEngine';
import type { ChapterData, DialogueState, Message, DialogueNode } from '../engine/types';

export function useDialogue(chapterData: ChapterData) {
    const engineRef = useRef<DialogueEngine>(new DialogueEngine(chapterData));
    const [state, setState] = useState<DialogueState>(() => engineRef.current.getInitialState());

    // Helper to add message
    const addMessage = useCallback((speaker: 'ai' | 'user', content: string, nodeId?: string) => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random().toString().slice(2),
            speaker,
            content,
            timestamp: new Date(),
            nodeId
        };

        setState(prev => ({
            ...prev,
            messageHistory: [...prev.messageHistory, newMessage]
        }));
    }, []);

    // Process the current node
    const processCurrentNode = useCallback(async () => {
        const { currentNodeId, variables } = state;
        if (!currentNodeId) return;

        const node = engineRef.current.getNode(currentNodeId);
        if (!node) return;

        // If it's an AI message
        if (node.type === 'ai_message') {
            setState(prev => ({ ...prev, isTyping: true }));

            // Wait for delay
            await new Promise(resolve => setTimeout(resolve, node.delay));

            setState(prev => ({ ...prev, isTyping: false }));

            // Compute variable if needed
            let currentVariables = variables;
            if (node.computeVariable) {
                const computed = engineRef.current.computeVariable(node.computeVariable.logic, variables);
                currentVariables = { ...variables, [node.computeVariable.name]: computed };

                // Update state with new variable immediately so it persists
                setState(prev => ({
                    ...prev,
                    variables: currentVariables
                }));
            }

            const text = engineRef.current.processText(node.content, currentVariables);
            addMessage('ai', text, node.id);

            if (node.isChapterEnd) {
                setState(prev => ({ ...prev, isComplete: true, currentNodeId: null }));
            } else if (node.nextNode) {
                setState(prev => ({ ...prev, currentNodeId: node.nextNode }));
            }
        }
        // If it's an input or choice or multi_input
        else {
            // Show the question first
            setState(prev => ({ ...prev, isTyping: true }));

            // Small delay for natural feel even for questions
            await new Promise(resolve => setTimeout(resolve, 1000));

            setState(prev => ({ ...prev, isTyping: false }));

            const text = engineRef.current.processText(node.content, variables);
            addMessage('ai', text, node.id);

            setState(prev => ({ ...prev, isWaitingForInput: true }));
        }
    }, [state.currentNodeId, state.variables, addMessage]);

    // Effect to trigger processing when node changes
    // We need to be careful not to trigger this when we are waiting for input
    useEffect(() => {
        if (state.currentNodeId && !state.isWaitingForInput && !state.isTyping && !state.isComplete) {
            // Check if the last message was from this node to avoid re-processing?
            // Actually, the logic above handles advancing.
            // But we need to make sure we don't loop infinitely if we don't change state.
            // The processCurrentNode updates state (adds message, moves to next node OR sets waiting for input)

            // We need a way to detect if we just arrived at this node.
            // We can check if the last message's nodeId matches the current Node.
            // If it does, and we are NOT waiting for input, it means we might have processed it?
            // No, for AI message, we move to next node immediately.
            // For Input message, we set isWaitingForInput = true.

            // So if isWaitingForInput is false, we should process.
            processCurrentNode();
        }
    }, [state.currentNodeId, state.isWaitingForInput, state.isTyping, state.isComplete]); // Removed processCurrentNode from deps to avoid loop

    const submitInput = useCallback((value: any, variableName?: string) => {
        setState(prev => {
            const nextVars = { ...prev.variables };

            // Update variable if specified
            if (variableName) {
                nextVars[variableName] = value;
            }

            // Also handle node-specific logic like computeVariable
            const node = engineRef.current.getNode(prev.currentNodeId!);
            if (node && node.type === 'input' && node.computeVariable) {
                // Temporarily add the new value to vars to compute the derived one
                const tempVars = { ...nextVars };
                if (node.setsVariable) tempVars[node.setsVariable] = value;

                const computed = engineRef.current.computeVariable(node.computeVariable.logic, tempVars);
                nextVars[node.computeVariable.name] = computed;
            }

            // Determine next node
            let nextNodeId: string | null = null;
            if (node) {
                // For choice nodes, the value might determine the next node directly if passed in
                // But usually submitInput is for text/number. Choice uses selectOption.

                // Use engine to find next node based on conditions
                nextNodeId = engineRef.current.getNextNodeId(node, nextVars);

                // If engine didn't find a conditional next, use the default nextNode
                if (!nextNodeId && 'nextNode' in node) {
                    nextNodeId = (node as any).nextNode;
                }
            }

            return {
                ...prev,
                variables: nextVars,
                isWaitingForInput: false,
                currentNodeId: nextNodeId,
                currentInputValue: '' // reset input
            };
        });

        // Add user message
        // For simple values, display them. For complex objects (multi-input), maybe summarize?
        // The prompt says "User submits -> Add user's response as a message"
        let userDisplay = String(value);
        if (typeof value === 'object') {
            userDisplay = Object.values(value).join(', ');
        }
        addMessage('user', userDisplay);

    }, [addMessage]);

    const selectOption = useCallback((optionId: string, value: string, nextNodeId: string, variableName?: string) => {
        // Add user message with the label of the option? Or just the value?
        // Usually the label is what the user "said".
        // We might need to look up the label.
        const node = engineRef.current.getNode(state.currentNodeId!);
        let label = value;
        if (node && node.type === 'choice') {
            const opt = node.options.find(o => o.id === optionId);
            if (opt) label = opt.label;
        }

        addMessage('user', label);

        setState(prev => {
            const nextVars = { ...prev.variables };
            if (variableName) {
                nextVars[variableName] = value;
            }

            return {
                ...prev,
                variables: nextVars,
                isWaitingForInput: false,
                currentNodeId: nextNodeId
            };
        });
    }, [state.currentNodeId, addMessage]);

    const submitMultiInput = useCallback((values: Record<string, any>, nextNodeId: string) => {
        // Add user message - maybe "Submitted details" or join values
        const display = Object.values(values).join(', ');
        addMessage('user', display);

        setState(prev => {
            const nextVars = { ...prev.variables, ...values };

            // Multi-input nodes might also have compute logic? The spec doesn't explicitly say so for multi-input but good to be safe.
            // For now assume simple variable setting.

            return {
                ...prev,
                variables: nextVars,
                isWaitingForInput: false,
                currentNodeId: nextNodeId
            };
        });
    }, [addMessage]);

    const loadChapter = useCallback((newChapterData: ChapterData) => {
        const { startNodeId, newVariables } = engineRef.current.loadChapter(newChapterData);

        setState(prev => ({
            ...prev,
            currentNodeId: startNodeId,
            variables: { ...prev.variables, ...newVariables },
            isComplete: false,
        }));
    }, []);

    return {
        state,
        currentNode: state.currentNodeId ? engineRef.current.getNode(state.currentNodeId) : null,
        submitInput,
        selectOption,
        submitMultiInput,
        loadChapter
    };
}
