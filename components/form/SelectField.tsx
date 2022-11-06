import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useField } from 'formik';
import { FC } from 'react';

interface iSelectItem {
    value: string | number;
    text: string;
}

interface iProps {
    formProps: any;
    label: string;
    field_name: string;
    value?: string;
    onChange?: (e: any) => void;
    items: iSelectItem[];
}

const SelectField: FC<iProps> = (props) => {
    const { formProps, label, field_name, value, onChange, items } = props;
    const [field, meta] = useField(field_name);
    return (
        <FormControl fullWidth error={typeof meta.error !== 'undefined' && meta.error ? true : false}>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value ? value : field.value}
                label={label}
                name={field.name}
                onChange={onchange ? onChange : (event: any) => formProps.setFieldValue(field.name, event.target.value)}
            >
                {items.map((info, index) => (
                    <MenuItem key={index} value={info.value}>
                        {info.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectField;
