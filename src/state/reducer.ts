import { State } from "./state";
import { Patient, Diagnosis} from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      patient: Patient;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSIS_LIST":
        return {
          ...state,
          diagnosies: {
            ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnosies
        }
      };
    case "ADD_PATIENT":
      const newState = state;
      newState.patients[action.payload.id] = action.payload;
      return newState;
    case "ADD_ENTRY":
      const entryState = state;
      entryState.patients[action.patient.id] = action.patient;
      return entryState;
    default:
      return state;
  }
};
