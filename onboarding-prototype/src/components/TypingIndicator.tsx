import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex w-full justify-start mb-4">
            <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs font-bold">AI</span>
                </div>

                <div className="px-4 py-4 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};
