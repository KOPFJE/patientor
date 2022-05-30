import {useState} from 'react';
import { Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import {useParams} from 'react-router-dom';
import { useStateValue } from "../state";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import axios from "axios";

const PatientInfo = () => {
    const [{patient}] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [rPatient, setRpatient] = useState(patient);
    if(!id) {
        return(
            <div></div>
        );
    }
  
    const fetchPatient = async (id: string) => {
        try {
            const patient : Patient = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`).then(res => res.data);
            setRpatient(patient);
        } catch(error: unknown) {
            let errorMsg = 'Something went wrong. ';
            if(error instanceof Error) {
                errorMsg += 'Error ' + error.message;
            }
            console.log(errorMsg);
            throw error;
        }
    };
    void fetchPatient(id);

    if(!rPatient) {
        return(
            <div></div>
        );
    }
    
    let genderIcon;
    if( rPatient.gender === Gender.Male) {
        genderIcon = <MaleIcon color="disabled" />;
    } else if(rPatient.gender === Gender.Female) {
        genderIcon = <FemaleIcon color="disabled" />;
    } else {
        genderIcon = <TransgenderIcon color="disabled" />;
    }

    return(
        <div>
            <h2>{rPatient.name} {genderIcon}</h2>
            <ul>
                <li>SSN: {rPatient.ssn}</li>
                <li>Occupation: {rPatient.occupation}</li>
            </ul>
        </div>
    );
};
export default PatientInfo;