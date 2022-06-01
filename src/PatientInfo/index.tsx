import {useState, useEffect} from 'react';
import { Gender, Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import {useParams} from 'react-router-dom';
import { useStateValue } from "../state";
import { Box, Typography } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import './style.css';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NextWeekIcon from '@mui/icons-material/NextWeek';
import axios from "axios";

const PatientInfo = () => {
    const [{patient, diagnosies}] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [rPatient, setRpatient] = useState(patient);

    if(!id) {
        return(
            <div></div>
        );
    }
    useEffect(() => {
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
    },[diagnosies]);

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
    
    const findDiagnosis = (code: string):string => {
        const diag = Object.values(diagnosies).find((diag : Diagnosis) => diag.code === code);
        if(!diag) return ""; 
        return diag.name;
    };

    const renderCodes = (entry: Entry):JSX.Element => {
        if(!entry.diagnosisCodes) return <span></span>;
        const codes = entry.diagnosisCodes.map(diagnosis => <li key={diagnosis}><strong>{diagnosis}</strong> {findDiagnosis(diagnosis)}</li>);
        return <ul>{codes}</ul>;
    };

    const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
        const assertNever = (value: never): never => {
            throw new Error(
              `Unhandled discriminated union member: ${JSON.stringify(value)}`
            );
        };
        const codes = renderCodes(entry);
        switch(entry.type) {
            case "Hospital":
                return (
                    <Box key={entry.id} className="entrybox">
                        <p>{entry.date} <MedicalServicesIcon color="disabled" /></p> 
                        <p><em>{entry.description}</em></p> 
                        {codes}
                        <p>Diagnose by {entry.specialist}</p>
                    </Box>
                );
            case "OccupationalHealthcare":
                return (
                    <Box key={entry.id} className="entrybox">
                        <p>{entry.date} <WorkIcon color="disabled" /> {entry.employerName}</p> 
                        <p><em>{entry.description}</em></p> 
                        {codes}
                        <p>Diagnose by {entry.specialist}</p>
                    </Box>
                );
            case "HealthCheck":
                let healthIcon = null;
                if(entry.healthCheckRating < 1) {
                    healthIcon = <FavoriteIcon className="healthy" />;
                } else if(entry.healthCheckRating < 2) {
                    healthIcon = <FavoriteIcon className="warning" />;
                } else {
                    healthIcon = <p><FavoriteIcon color="error" /></p>;
                }
                return (
                    <Box key={entry.id} className="entrybox">
                        <p>{entry.date} <NextWeekIcon color="disabled" />;</p> 
                        <p><em>{entry.description}</em></p>
                        {healthIcon}
                        {codes}
                        <p>Diagnose by {entry.specialist}</p>
                    </Box>
                );
            default:
                return assertNever(entry);
        }
    };

    return(
        <div>
            <Box>
            <Typography variant="h5">{rPatient.name} {genderIcon}</Typography>
            </Box>
            <Box>
                <ul>
                    <li>SSN: {rPatient.ssn}</li>
                    <li>Occupation: {rPatient.occupation}</li>
                </ul>
            </Box>
            <Box>
                <Typography variant="h6">Entries</Typography>
                {
                    rPatient.entries.map(entry => {
                        return <EntryDetails key={entry.id} entry={entry} />;
                    })
                }
            </Box>
        </div>
    );
};
export default PatientInfo;