import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import { getReviewsForSpot } from "../../store/spots";
import './Reviews.css'



const Reviews = () => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.session.user);
    const owner = useSelector(state => state.spots.spot.ownerId);
    const reviews = useSelector(state => state.spots.reviews);
    const { spotId } = useParams();
    const [errors, setErrors] = useState({})


    useEffect(() => {
        dispatch(getReviewsForSpot(spotId));
    }, [dispatch, spotId]);

    let authorized;
    let showHideButton;
    let monthNames
    if (currUser) {
        authorized = currUser.id === owner
        let userDidReview;
        for (const rev in reviews) {
            reviews[rev].User.id === currUser.id ? userDidReview = true : userDidReview = false
        }
        showHideButton = authorized || userDidReview ? 'hidden' : '';
        monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    

    return (
        <>
            <h1>Reviews</h1>
            <span className={showHideButton}> <OpenModalButton
                buttonText='Post your review'
                modalComponent={<ReviewFormModal spotId={spotId} />} />
            </span>
            {
                reviews && reviews.map(review => (
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
};





export default Reviews