import { APPLICATION_SUBMITTED_EVENT } from '../outputEvents';

export default {
    Init: () => ({}),
    [APPLICATION_SUBMITTED_EVENT]: (state, {timestamp}) => ({
        ...state,
        createdAt: timestamp
    })
};