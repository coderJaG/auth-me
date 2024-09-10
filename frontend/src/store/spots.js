
import { csrfFetch } from "./csrf";


const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_BY_ID = 'spots/getSpotById'
const CREATE_NEW_SPOT = 'spots/createNewSpot'


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
        payload: spot
    })
}

const createNewSpot = (spot)=> ({
    type: CREATE_NEW_SPOT,
    payload: spot
})

export const spots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    const data = await res.json();
    console.log(data)
    dispatch(getAllSpots(data.Spots));
    return res;
}

export const spotDetails = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpotById(data[0]))
    return res;
}

export const newSpot = (spotData) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = spotData
    let res = await csrfFetch('/api/spots', {
        method: 'POST',
        header: 'application/json',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        })
    })
    const data = await res.json();
    console.log('creatingggg', data)
    dispatch(createNewSpot(data))
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
        case CREATE_NEW_SPOT: {
            console.log('testing' ,action.payload)
            const newState = { ...state }
            newState.spot = action.payload
            return newState
        }
        default:
            return state
    }
};


export default spotsReducer;