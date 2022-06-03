import React from "react";
import { Formik, Form, Field } from "formik";
import { useStateValue } from "../state";
import { DiagnosisSelection, SelectField, TextField, TypeOption, HealthCheckRatingOption } from "./FormField";
import { Entry} from "../types";
import { Button, Grid } from "@material-ui/core";

export type EntryFormValues = Omit<Entry, "id">;

interface HCEntry extends EntryFormValues {
  healthCheckRating: number;
}

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: "Hospital", label: "Hospital Visit" },
  { value: "HealthCheck", label: "Health Check-up" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: 0, label: "Healthy Condition" },
  { value: 1, label: "In Low Risk" },
  { value: 2, label: "In High Risk" },
  { value: 3, label: "In Critical Risk" },
];

const validateField = (value: string) => {
  let error = null;
  const requiredError = "Field is required";
  if(!value) error =  requiredError;
  return error;
};

const validateDateRequired = (date: string) => {
  let error = null;
  error = validateField(date);
  error = validateDate(date);
  return error;
};

const validateDate = (date: string) => {
  let error = null;
  const formatError = "Not a right format for date.";
  if(date) {
    if(!date.match(/(\d{4})-(\d{2})-(\d{2})/)) error = formatError; 
  }
  return error;
};

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
    const [{ diagnosies }] = useStateValue();

    const TypeFields: React.FC<{ values:EntryFormValues, type: string }> = ({ type, values }) => {
      switch(type) {
        case "Hospital":
          return (
            <div> 
              <Field
                  label="Criteria for Discharge"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                  validate={validateField}
              />
              <Field
                label="Discharge Date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
                validate={validateDateRequired}
              />
            </div>
          );
        case "OccupationalHealthcare":
          return (
            <div>
              <Field
                  label="Employer Name"
                  placeholder="Employer"
                  name="employerName"
                  component={TextField}
                  validate={validateField}
              />
              <Field
                  label="Sick Leave Start Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                  validate={validateDate}
              />
              <Field
                  label="Sick Leave End Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                  validate={validateDate}
              />
            </div>
          );
        case "HealthCheck":
            const hcvalues = values as HCEntry;
            if(!hcvalues.healthCheckRating) hcvalues.healthCheckRating = 0;
            values = hcvalues;
            return (
              <SelectField label="Health Check Rating" name="healthCheckRating" options={healthCheckRatingOptions} />
          );
        default:
          return null;
      }
    };

    return (
      <Formik
        initialValues={{
            type: "Hospital",
            description: "",
            date: "",
            specialist: "",
            diagnosisCodes: undefined,
        }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        console.log(errors);
        if(!values.date) {
          errors.date = requiredError;
        }
        const formatError = validateDate(values.date);
        if(formatError) errors.date = formatError;
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        return errors;
      }}

      
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <SelectField label="Type" name="type" options={typeOptions} />
            
            <Field
              label="Date of Entry"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Diagnosed by"
              placeholder="Doctor"
              name="specialist"
              component={TextField}
            />

            <DiagnosisSelection            
                setFieldValue={setFieldValue}            
                setFieldTouched={setFieldTouched}            
                diagnoses={Object.values(diagnosies)}          
            />    

            <TypeFields values={values} type={values.type} />

            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
    );
};
export default AddEntryForm;