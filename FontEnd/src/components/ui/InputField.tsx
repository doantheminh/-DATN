import {  Input, InputProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ChangeEventHandler, FunctionComponent } from 'react';

interface InputFieldProps extends InputProps {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    checkboxEvent?: (e: CheckboxChangeEvent) => void;
    typeInput?: 'text' | 'password' | 'checkbox' | 'number';
}

const InputField: FunctionComponent<InputFieldProps> = ({
    onChange,
    checkboxEvent,
    typeInput,
    ...props
}) => {
    return (
        <>
            {typeInput === 'password' ? (
                <Input.Password onChange={onChange} {...props} />
            ) : (
                <Input {...props} onChange={onChange} />
            )}
        </>
    );
};

export default InputField;
