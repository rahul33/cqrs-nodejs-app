import { APPLICATION_SUBMITTED_EVENT } from '../outputEvents';
import uuid from 'uuid';

export default {

    submitApplication: (state, {payload: {name, dob, ssn}}) => {
        if(state.createdAt) throw new Error("The application already exists");
        if(!name || !dob || !ssn) throw new Error("all fields are required");
        const aggId = uuid.v4();
        return {
            type: APPLICATION_SUBMITTED_EVENT,
            payload: {
                id: aggId,
                applicationStatus: "APPLICATION_SUBMITTED",
                applicationAttributes: {
                    name: name, 
                    dob: dob, 
                    ssn: ssn
                }
            }
        };
    }

};