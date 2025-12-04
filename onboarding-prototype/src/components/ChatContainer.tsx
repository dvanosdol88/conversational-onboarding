import React, { useEffect, useRef } from 'react';
import type { Message } from '../engine/types';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatContainerProps {
    messages: Message[];
    isTyping: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isTyping }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-32">
            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
        </div>
    );
};
