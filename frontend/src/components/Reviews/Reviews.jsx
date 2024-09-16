import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import { getReviewsForSpot } from "../../store/spots";
import './Reviews.css';
import DeleteSpotModal from "../DeleteSpotModal";

const Reviews = () => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.spot);
    const reviews = useSelector(state => state.spots.reviews);
    const owner = spot?.ownerId; 
    const { spotId } = useParams();
    const [reload, setReload] = useState(false);

    const handleDelete = () => {
        setReload(!reload);
    };

    useEffect(() => {
        dispatch(getReviewsForSpot(spotId));
    }, [dispatch, spotId, reload]);

    let authorized;
    let showHideButton;
    let monthNames;

    if (currUser) {
        authorized = currUser.id === owner;
        let userDidReview = false;
        if (reviews) {
            for (const rev in reviews) {
                if (reviews[rev].User.id === currUser.id) {
                    userDidReview = true;
                    break; 
                }
            }
        }
        showHideButton = authorized || userDidReview ? 'hidden' : '';
        monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    }

   
    return (
        <div>
            <h1>Reviews</h1>

            {currUser && ( 
                <span className={showHideButton}>
                    <OpenModalButton
                        buttonText='Post your review'
                        modalComponent={<ReviewFormModal spotId={spotId} />}
                    />
                </span>
            )}

            {spot && (
                <div>
                    <span>
                        <i className="fas fa-star"></i> {spot.avgStarRating} | {spot.numReviews} reviews
                    </span>
                </div>
            )}
          
            {reviews && reviews.length < 3 && reviews.map(review => (
               
                <div key={review?.id}>
                    <p>{review.User?.firstName}</p>
                    <p>{monthNames[new Date(review.createdAt).getMonth()]} {new Date(review.createdAt).getFullYear()}</p>
                    <p>{review.review}</p>
                    {currUser && currUser.id === review.userId && (
                        <OpenModalButton
                            buttonText='Delete'
                            modalComponent={<DeleteSpotModal
                                reviewId={review.id}
                                onDelete={handleDelete}
                            />}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Reviews;


