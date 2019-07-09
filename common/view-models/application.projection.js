import {APPLICATION_SUBMITTED_EVENT} from '../outputEvents';

export default {
  Init: () => null,
  [APPLICATION_SUBMITTED_EVENT]: (state, 
                                    {aggregateId, 
                                        payload: {
                                            id,
                                            applicationStatus,
                                            applicationAttributes: {
                                                name, 
                                                dob, 
                                                ssn
                                            }}}) => 
  ({
    aggregateId: aggregateId,
    id,
    applicationStatus,
    name,
    dob,
    ssn
  })
};