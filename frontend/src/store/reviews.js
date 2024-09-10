// import { csrfFetch } from "./csrf";


// const GET_ALL_REVIEWS = 'reviews/getAllReviews';


// const getAllReviews = (reviews) => ({
//     type: GET_ALL_REVIEWS,
//     payload: reviews
// });


// export const getReviews = (spotId) => async (dispatch)=>{
//     console.log('yesss')
//     const res = await csrfFetch(`/spots/${spotId}/reviews`);
//     const data = await res
//     console.log('this is review', data)
//     dispatch(getAllReviews(data))
//     return res
// }

// const initialState = {}
// const reviewsReducer = (state = initialState, action)=>{
//     switch(action.type) {
//         case GET_ALL_REVIEWS: {
//             return {...state, reviews: action.payload}
//         }
//         default:
//            return state
//     }

// }


// export default reviewsReducer;