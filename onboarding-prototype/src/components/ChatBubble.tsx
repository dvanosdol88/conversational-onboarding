import React from 'react';
import type { Message } from '../engine/types';

interface ChatBubbleProps {
    message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isAi = message.speaker === 'ai';

    return (
        <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] ${isAi ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
                {isAi && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 text-xs font-bold">AI</span>
                    </div>
                )}

                <div
                    className={`px-4 py-3 rounded-2xl text-base leading-relaxed shadow-sm
            ${isAi
                            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            : 'bg-blue-600 text-white rounded-br-none'
                        }`}
                >
                    {message.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};
