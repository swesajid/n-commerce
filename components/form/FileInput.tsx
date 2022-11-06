import { Button } from '@mui/material';
import { ErrorMessage, useField } from 'formik';
import { FC, Fragment, useRef } from 'react';
// import TextInputError from './TextInput.Error';

interface iProps {
    label: string;
    field_name: string;
    required?: boolean;
    formProps: any;
    multiple?: boolean;
    fillParent?: boolean;
    disabled?: boolean;
    width?: string | number;
    onChange?: (e: any) => void;
}

interface iError {
    text: string;
}

const TextInputError: FC<iError> = ({ text }) => (
    <div>
        <small style={{ color: 'red' }}>{text}</small>
    </div>
);

const FileInput: FC<iProps> = (props) => {
    const { label, field_name, required, formProps, multiple, fillParent, disabled, width, onChange } = props;
    const [field, meta] = useField(field_name);
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Fragment>
            {/* <label htmlFor={field_name}>{label}</label> */}
            <input
                id={field_name}
                name={field.name}
                required={required ? true : false}
                onChange={
                    onChange ? onChange : (event: any) => formProps.setFieldValue(field.name, event.target.files[0])
                }
                type="file"
                multiple={multiple ? true : false}
                ref={inputRef}
                hidden
                disabled={disabled ? true : false}
            />
            {fillParent ? (
                <Button
                    variant="outlined"
                    onClick={() => inputRef.current?.click()}
                    sx={{ width: '100%', height: '100%' }}
                    disabled={disabled}
                >
                    {label}
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    sx={{ width: width ? width : 'auto' }}
                    onClick={() => inputRef.current?.click()}
                >
                    {label}
                </Button>
            )}
            {formProps.values.image && <small>{formProps.values?.image.name}</small>}
            <ErrorMessage name={field.name} render={(errorMessage) => <TextInputError text={errorMessage} />} />
        </Fragment>
    );
};

export default FileInput;
