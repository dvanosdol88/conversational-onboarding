import React from 'react';

interface TextInputProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    helperText?: string;
    required?: boolean;
    autoFocus?: boolean;
    onEnter?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
    placeholder,
    value,
    onChange,
    helperText,
    required,
    autoFocus = true,
    onEnter
}) => {
    return (
        <div className="w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
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
