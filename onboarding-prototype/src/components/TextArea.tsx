import React from 'react';

interface TextAreaProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    helperText?: string;
    required?: boolean;
    autoFocus?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
    placeholder,
    value,
    onChange,
    helperText,
    autoFocus = true
}) => {
    return (
        <div className="w-full">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base resize-none"
                autoFocus={autoFocus}
            />
            {helperText && (
                <p className="mt-2 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};
