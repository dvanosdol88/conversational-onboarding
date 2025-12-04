import React from 'react';

interface ContinueButtonProps {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
    onClick,
    disabled = false,
    label = "Continue"
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3 px-6 rounded-lg text-base font-medium transition-all duration-200
        ${disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                }`}
        >
            {label}
        </button>
    );
};
