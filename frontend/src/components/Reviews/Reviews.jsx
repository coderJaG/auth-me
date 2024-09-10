import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import { getReviewsForSpot } from "../../store/spots";
import  './Reviews.css'



const Reviews = () => {
    const dispatch = useDispatch();
    const currUser = useSelector(state=> state.session.user);
    const owner = useSelector(state => state.spots.spot.ownerId);
    const reviews = useSelector(state => state.spots.reviews);
    const {spotId} = useParams();
    const [errors, setErrors] = useState({})
    
    useEffect(()=>{
        dispatch(getReviewsForSpot(spotId));
    },[dispatch, spotId]);
    

    const authorized = currUser.id === owner
    let userDidReview;
    for (const rev in reviews) {
        
        reviews[rev].User.id === currUser.id ? userDidReview = true : userDidReview = false
    }

    const showHideButton= authorized || userDidReview ? 'hidden' : '';

    console.log(showHideButton, 'this is button')
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'  
      ];
console.log(userDidReview, authorized)
    return(
        <>
        <h1>Reviews</h1>
        <button className={showHideButton}>Post Your Review</button>
        {
            reviews && reviews.map(review=> (
               <div key={review.id}> 
               <p>{review.User.firstName}</p>
               <p>{monthNames[new Date(review.createdAt).getMonth()]} {new Date(review.createdAt).getFullYear()}</p>
                <p>{review.review}</p>
               </div>
            ))
        }
        </>
    )
}





export default Reviews