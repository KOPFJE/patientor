import React from "react";
import { Formik, Form, Field } from "formik";
import { useStateValue } from "../state";
import { DiagnosisSelection, SelectField, TextField, TypeOption, HealthCheckRatingOption } from "./FormField";
import { Entry } from "../types";
import { Button, Grid } from "@material-ui/core";

export type EntryFormValues = Omit<Entry, "id">;

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
    { value: "Healthy", label: "Healthy Condition" },
    { value: "LowRisk", label: "In Low Risk" },
    { value: "HighRisk", label: "In High Risk" },
    { value: "CriticalRisk", label: "In Critical Risk" },
  ];

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
    const [{ diagnosies }] = useStateValue();
    return (
      <Formik
        initialValues={{
            type: "Hospital",
            description: "",
            date: "",
            specialist: "",
        }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
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

            <SelectField label="Health Check Rating" name="healthCheckRating" options={healthCheckRatingOptions} />

            <DiagnosisSelection            
                setFieldValue={setFieldValue}            
                setFieldTouched={setFieldTouched}            
                diagnoses={Object.values(diagnosies)}          
            />    

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