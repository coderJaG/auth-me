
import { csrfFetch } from "./csrf";


const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_BY_ID = 'spots/getSpotById'
const CREATE_NEW_SPOT = 'spots/createNewSpot'
const GET_ALL_SPOT_REVIEWS = 'spots/getAllSpotReviews';
const CREATE_REVIEW = 'spots/createReview'
const ADD_IMAGE = 'spots/addImage'
const DELETE_SPOT = 'spots/deleteSpot'
let state;

const getAllSpots = (spots) => {
    return ({
        type: GET_ALL_SPOTS,
        payload: spots
    })
}


const getSpotById = (spot) => {
    return ({
        type: GET_SPOT_BY_ID,
        payload: spot
    })
}

const createNewSpot = (spot) => ({
    type: CREATE_NEW_SPOT,
    payload: spot
})

const getSpotReviews = (reviews) => {
    return ({
        type: GET_ALL_SPOT_REVIEWS,
        payload: reviews
    })
};

const createReview = (review) => ({
    type: CREATE_REVIEW,
    payload: review
})

const addImage = (image) => ({
    type: ADD_IMAGE,
    payload: image
})

const deleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    payload: spotId
})

export const clearSpotDetails = () => {
    state.spots.spot = null
}

export const spots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    const data = await res.json();
    dispatch(getAllSpots(data.Spots));
    return res;
}

export const spotDetails = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpotById(data[0]));
    return res;
}

export const newSpot = (spotData) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price, images } = spotData

    let res = await csrfFetch('/api/spots', {
        method: 'POST',
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
    res = await res.json();
    dispatch(createNewSpot(res));
    const filteredImages = images.filter(image => image.trim() != '')

    
    for (let i = 0; i < filteredImages.length; i++) {
        let imageRes = await csrfFetch(`/api/spots/${res.id}/images`, {
            method: 'POST',
            body: JSON.stringify({ 
                url: filteredImages[i], 
                preview: i === 0 
            })
        })
        const imageData = await imageRes.json()
        dispatch(addImage(imageData))
    }
    return res
}



export const getReviewsForSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();

    dispatch(getSpotReviews(data));
    return res;
}


export const createNewReview = (reviewData, spotId) => async (dispatch) => {
    const { review, stars } = reviewData;
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            review,
            stars
        })
    });
    const data = await res.json()
    dispatch(createReview(data))
    return data;
}

export const editSpot = (spotData, spotId) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price, images, preview } = spotData
    let res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
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
    res = await res.json();
    dispatch(createNewSpot(res));

    const filteredImages = images.filter(image => image.trim() !== '');

    // Separate new and existing images based on their IDs
    const newImages = filteredImages.filter(image => !image.id); 
    const existingImages = filteredImages.filter(image => image.id);

 
    for await (let image of newImages) {
        let imageRes = await csrfFetch(`/api/spots/${res.id}/images`, {
            method: 'POST',
            body: JSON.stringify({ url: image, preview }) 
        });
        const imageData = await imageRes.json();
        dispatch(addImage(imageData));
    }

    
    for await (let image of existingImages) {
        let imageRes = await csrfFetch(`/api/spots/${res.id}/images/${image.id}`, {
            method: 'PUT',
            body: JSON.stringify({ url: image.url, preview: image.preview })
        });
        const imageData = await imageRes.json();
        dispatch(addImage(imageData)); 
    }

    return res;
}


export const deleteASpot = (spotId) => async (dispatch) => {
    console.log('spotid', spotId)
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    dispatch(deleteSpot(spotId))
    return res
}

const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            return { ...state, spots: action.payload }
        }
        case GET_SPOT_BY_ID: {
            const newState = { ...state }
            newState.spot = action.payload
            return newState
        }
        case CREATE_NEW_SPOT: {
            const newState = { ...state }
            newState.spot = action.payload
            return newState
        }
        case GET_ALL_SPOT_REVIEWS: {
            const newState = { ...state }
            newState.reviews = action.payload.Reviews
            return newState
        }
        case CREATE_REVIEW: {
          
            return {
                ...state,
                reviews: [...state.reviews, action.payload] 
            };
        }
        case ADD_IMAGE: {
         
            return {
                ...state,
                spot: { 
                    ...state.spot, 
                    SpotImages: [...(state.spot?.SpotImages || []), action.payload] 
                }
            };
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            newState.spots = newState.spots.filter(spot => spot.id !== action.payload);
            return newState;
        }
        default:
            return state
    }
};


export default spotsReducer;