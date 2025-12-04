import React, { useState, useEffect } from 'react';
import type { MultiInputField } from '../engine/types';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import { ContinueButton } from './ContinueButton';

interface MultiInputFormProps {
    inputs: MultiInputField[];
    onSubmit: (values: Record<string, any>) => void;
}

export const MultiInputForm: React.FC<MultiInputFormProps> = ({
    inputs,
    onSubmit
}) => {
    const [values, setValues] = useState<Record<string, any>>({});
    const [isValid, setIsValid] = useState(false);

    // Initialize values
    useEffect(() => {
        const initialValues: Record<string, any> = {};
        inputs.forEach(input => {
            initialValues[input.setsVariable] = '';
        });
        setValues(initialValues);
    }, [inputs]);

    // Validate
    useEffect(() => {
        const valid = inputs.every(input => {
            if (!input.required) return true;
            const val = values[input.setsVariable];
            return val !== '' && val !== null && val !== undefined;
        });
        setIsValid(valid);
    }, [values, inputs]);

    const handleChange = (variable: string, value: any) => {
        setValues(prev => ({
            ...prev,
            [variable]: value
        }));
    };

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(values);
        }
    };

    return (
        <div className="w-full space-y-4">
            {inputs.map((input) => (
                <div key={input.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {input.label} {input.required && <span className="text-red-500">*</span>}
                    </label>

                    {input.inputType === 'text' && (
                        <TextInput
                            value={values[input.setsVariable] || ''}
                            onChange={(val) => handleChange(input.setsVariable, val)}
                            placeholder={input.placeholder}
                            autoFocus={false} // Only autofocus first? Maybe handled by parent or browser
                        />
                    )}

                    {input.inputType === 'number' && (
                        <NumberInput
                            value={values[input.setsVariable] || ''}
                            onChange={(val) => handleChange(input.setsVariable, val)}
                            placeholder={input.placeholder}
                            autoFocus={false}
                        />
                    )}

                    {input.inputType === 'select' && input.options && (
                        <SelectInput
                            value={values[input.setsVariable] || ''}
                            onChange={(val) => handleChange(input.setsVariable, val)}
                            options={input.options}
                            placeholder={input.placeholder}
                        />
                    )}
                </div>
            ))}

            <div className="pt-2">
                <ContinueButton
                    onClick={handleSubmit}
                    disabled={!isValid}
                />
            </div>
        </div>
    );
};
