import { FormControlLabel, FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';

interface iProps {
    label: string;
    field_name: string;
    formProps: any;
    checked?: boolean;
}

const CheckBox: FC<iProps> = (props) => {
    const { label, field_name, formProps, checked } = props;
    return (
        <FormGroup>
            <FormControlLabel
                name={field_name}
                control={<Checkbox />}
                label={label}
                value={checked ? true : false}
                onChange={() => formProps.setFieldValue(field_name, !formProps.values[field_name])}
                checked={checked ? true : false}
            />
        </FormGroup>
    );
};

export default CheckBox;
