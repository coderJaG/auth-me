import { csrfFetch } from "./csrf";


const ADD_USER_SESSION = 'session/addUserSession';
const REMOVE_USER_SESSION = 'session/removeUserSession';




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

export const signup = (user)=> async (dispatch)=> {
    const {firstName, lastName, email, password, username } = user;
    const res = await csrfFetch('/api/users', {
        method: 'POSt',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            username
        })
    });
    const data = await res.json()
    dispatch(addUserSession(data.user));
    return res
}

export const logOutCurrUser = ()=> async (dispatch) => {
    const res = await csrfFetch('/api/session', {
        method: 'DELETE'
    })

    dispatch(removeUserSession());
    return res
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