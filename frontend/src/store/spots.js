
import { csrfFetch } from "./csrf";


const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_BY_ID = 'spots/getSpotById'


const getAllSpots = (spots) => {
    

    return ({
        type: GET_ALL_SPOTS,
        payload: spots
    })
}
const getSpotById = (spot) => {
    console.log('twotesters', spot);
    return ({
    type: GET_SPOT_BY_ID,
    spot
})
}
export const spots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    const data = await res.json();
    dispatch(getAllSpots(data.Spots));
    return res;
}

export const spotDetails = (spotId) => async (req, dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpotById(data[0]))
    return res;
}


const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            return { ...state, spots: action.payload }
        }
        case GET_SPOT_BY_ID: {
            console.log('testing')
            const newState = { ...state }
            newState.spot = action.payload
            return newState
        }
        default:
            return state
    }
};


export default spotsReducer;