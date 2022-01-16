import { Formik, useField, useFormikContext, ErrorMessage, Field, Form } from 'formik';
import * as yup from "yup";
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';
import DatePicker, { registerLocale } from "react-datepicker";

import enGB from "date-fns/locale/en-GB";

import "react-datepicker/dist/react-datepicker.css";

const StyledErrorMessage = styled(ErrorMessage)`
        display: block;
`;

const StyledField = styled(Field)`
        margin-bottom: 1em;
`;

registerLocale('en-GB', enGB);

const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
        <DatePicker
        {...field}
        {...props}
        locale="en-GB"
        showTimeSelect
        timeFormat="p"
        timeIntervals={5}
        dateFormat="dd.MM.yyyy HH:mm"
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
            setFieldValue(field.name, val);
        }}
        />
    );
};

const StyledDatePickerField = styled(DatePickerField)`
        margin-bottom: 1em;
`;

const AddOvertimeForm = ({onAdd}) => {

    return(
        <Formik
            initialValues={{ number: '', start: '', end: '', }}
            validationSchema={yup.object({
                number: yup.number().required(),
                start: yup.string().required(),
                end: yup.string().required(),
            })}
            onSubmit={(values) => {
                onAdd({...values, id: uuid()});
            }}
        >
            <Form autoComplete="off">
                <label htmlFor="number" className="form-label">Number</label>
                <StyledField className="form-control" type="number" name="number" />
                <StyledErrorMessage className="invalid-feedback" name="number" component="div" />
                <label htmlFor="start" className="form-label">Start date and time</label>
                <StyledDatePickerField className="form-control" type="text" name="start" />
                <StyledErrorMessage className="invalid-feedback" name="start" component="div" />
                <label htmlFor="end" className="form-label">End date and time</label>
                <StyledDatePickerField className="form-control" type="text" name="end" />
                <StyledErrorMessage className="invalid-feedback" name="end" component="div" />
                <button type="submit" className="btn btn-primary">
                Submit
                </button>
            </Form>
        </Formik>
    )
}

export default AddOvertimeForm;