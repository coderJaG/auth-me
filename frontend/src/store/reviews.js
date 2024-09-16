import { csrfFetch } from "./csrf";


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
// const DELETE_REVIEW = 'reviews/deleteReview'


// const deleteReview = (reviewId) => ({
    
//     type: DELETE_REVIEW,
//     payload: reviewId
// })

// export const deleteAReview = (reviewId) => async (dispatch) => {
//     console.log('thisis review id', reviewId)
//     const res = await csrfFetch(`/api/reviews/${reviewId}`, {
//         method: 'DELETE'   
//     });
//     dispatch(deleteAReview(reviewId))

//     return res;
// }

// const initialState = {}
// const reviewsReducer = (state = initialState, action)=>{
//     switch(action.type) {
//         case DELETE_REVIEW: {
//             const newState = {...state}
//             newState.spots.reviews = newState.spots.reviews.filter(review=> review.id !== action.payload)
//             return newState
//         }
//         default:
//            return state
//     }

// }


// export default reviewsReducer;