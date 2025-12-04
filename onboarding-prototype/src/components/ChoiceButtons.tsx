import React from 'react';
import type { ChoiceOption } from '../engine/types';

interface ChoiceButtonsProps {
    options: ChoiceOption[];
    selectedId: string | null;
    onSelect: (id: string, value: string, nextNode: string) => void;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
    options,
    selectedId,
    onSelect
}) => {
    return (
        <div className="flex flex-col gap-3 w-full">
            {options.map((option) => {
                const isSelected = selectedId === option.id;

                return (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id, option.value, option.nextNode)}
                        className={`
              w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
              ${isSelected
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-200 hover:bg-gray-50'
                            }
            `}
                    >
                        <span className="font-medium text-base">{option.label}</span>

                        {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        {!isSelected && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-emerald-300" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
