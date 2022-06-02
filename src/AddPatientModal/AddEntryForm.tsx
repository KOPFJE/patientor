import React from "react";
import { Formik, Form, Field } from "formik";
import { useStateValue } from "../state";
import { DiagnosisSelection, SelectField, TextField, TypeOption } from "./FormField";
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

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
    const [{ diagnosies }] = useStateValue();
    return (
      <Formik
        initialValues={{
            type: "Hospital",
            description: "",
            date: "",
            specialist: ""
        }}
      onSubmit={onSubmit}
      validate={values => {
        console.log(values);
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        console.log(isValid, dirty);
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