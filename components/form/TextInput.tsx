import { FC } from 'react';
import { ErrorMessage, useField } from 'formik';
import { TextField } from '@mui/material';

interface Props {
    label: string;
    field_name: string;
    required?: boolean;
    formProps: any;
    type?: string;
    value?: string;
    onChange?: (e: any) => void;
    helperText?: string;
    fullWidth?: boolean;
    margin?: 'normal' | 'dense' | 'none';
    autoFocus?: boolean;
    disabled?: boolean;
}

const TextInput: FC<Props> = (props) => {
    const {
        label,
        field_name,
        required,
        formProps,
        type,
        value,
        helperText,
        fullWidth,
        margin,
        autoFocus,
        disabled,
        onChange,
    } = props;
    const [field, meta] = useField(field_name);

    const helper_text = helperText ? helperText : typeof meta.error !== 'undefined' && meta.error;

    return (
        <TextField
            margin={margin}
            error={typeof meta.error !== 'undefined'}
            label={label}
            id={field_name}
            name={field.name}
            required={required ? true : false}
            onChange={onChange ? onChange : (event: any) => formProps.setFieldValue(field.name, event.target.value)}
            type={type ? type : 'text'}
            value={value}
            helperText={helper_text}
            fullWidth={fullWidth ? true : false}
            autoFocus={autoFocus}
            disabled={disabled ? true : false}
        />
    );
};

export default TextInput;
