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

    const TypeFields: React.FC<{ type: string }> = ({ type }) => {
        switch(type) {
            case "Hospital":
                return (
                    <div>
                        <Field
                            label="Criteria for Discharge"
                            placeholder="Criteria"
                            name="discharge.criteria"
                            component={TextField}
                        />
                        <Field
                            label="Discharge Date"
                            placeholder="YYYY-MM-DD"
                            name="discharge.date"
                            component={TextField}
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
                        />
                        <Field
                            label="Sick Leave Start Date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.startDate"
                            component={TextField}
                        />
                        <Field
                            label="Sick Leave End Date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.endDate"
                            component={TextField}
                        />
                    </div>
                );
            case "HealthCheck":
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
            type: "HealthCheck",
            description: "",
            date: "",
            specialist: "",
            diagnosisCodes: [],
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

            <TypeFields type={values.type} />

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