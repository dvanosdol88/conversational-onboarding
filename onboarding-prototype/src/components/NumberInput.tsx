import React from 'react';

interface NumberInputProps {
    placeholder?: string;
    value: string | number;
    onChange: (value: string) => void;
    helperText?: string;
    required?: boolean;
    min?: number;
    max?: number;
    autoFocus?: boolean;
    onEnter?: () => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    placeholder,
    value,
    onChange,
    helperText,
    min,
    max,
    autoFocus = true,
    onEnter
}) => {
    return (
        <div className="w-full">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                autoFocus={autoFocus}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && onEnter) {
                        onEnter();
                    }
                }}
            />
            {helperText && (
                <p className="mt-2 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};
