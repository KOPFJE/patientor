import { Gender, PatientInfoProps } from "../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

const PatientInfo = (props : PatientInfoProps) => {
    if(!props.patient) {
        return(
            <div>
            </div>
        );
    }
    
    let genderIcon;
    if(props.patient.gender === Gender.Male) {
        genderIcon = <MaleIcon color="disabled" />;
    } if(props.patient.gender === Gender.Female) {
        genderIcon = <FemaleIcon color="disabled" />;
    } else {
        genderIcon = <TransgenderIcon color="disabled" />;
    }

    return(
        <div>
            <h2>{props.patient.name} {genderIcon}</h2>
            <ul>
                <li>SSN: {props.patient.ssn}</li>
                <li>Occupation: {props.patient.occupation}</li>
            </ul>
        </div>
    );
};
export default PatientInfo;