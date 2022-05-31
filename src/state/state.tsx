import React, { createContext, useContext, useReducer } from "react";
import { Patient, Diagnosis } from "../types";

import { Action } from "./reducer";

export type State = {
  patients: { [id: string]: Patient };
  diagnosies: {[code: string]: Diagnosis};
  patient: Patient;
};

const initialState: State = {
  patients: {},
  diagnosies: {},
  patient: null as unknown as Patient
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const setPatientList = (content: Patient[]):Action => {
  return { type: "SET_PATIENT_LIST", payload: content};
};
export const setDiagnosisList = (content: Diagnosis[]):Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: content};
};
export const addPatient = (content: Patient):Action => {
  return { type: "ADD_PATIENT", payload: content };
};
export const useStateValue = () => useContext(StateContext);

