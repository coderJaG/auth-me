import { csrfFetch } from "./csrf";


const ADD_USER_SESSION = 'session/addUserSession';
const REMOVE_USER_SESSION = 'session/removeUserSession';
const RESTORE_USER = 'session/restoreUser';


const addUserSession = (user) => ({
    type: ADD_USER_SESSION,
    payload: user
});

export const removeUserSession = () => ({
    type: REMOVE_USER_SESSION
});

export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    let res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await res.json();
    dispatch(addUserSession(data.user));
    return res;
};

export const restoreUser = ()=> async (dispatch) =>{
    let res = await csrfFetch('/api/session')
    const data = await res.json();
    dispatch(addUserSession(data.user));
    return res;
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_SESSION: {
            return { ...state, user: action.payload }
        }
        case REMOVE_USER_SESSION: {
            return { ...state, user: null }
        }
        default:
            return state;
    }
};

export default sessionReducer;