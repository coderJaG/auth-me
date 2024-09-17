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
    let monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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

    }


    return (
        <div id="reviews-container">
            <div id="spacer"></div>
            {/* <div className="review-heading">  <h3>Reviews</h3></div> */}
            <div className="post-review-btn-div">
                {currUser && (
                    <span className={showHideButton} >
                        <OpenModalButton
                            buttonText='Post your review'
                            modalComponent={<ReviewFormModal spotId={spotId} />}
                            className="post-review-btn"
                        />
                    </span>
                )}
            </div>
            <div className="reviews-ratings">
                {spot && (
                    <div>
                        {spot.numReviews > 0 && <h3>
                            <i className="fas fa-star"></i> {spot.avgStarRating} <span className="dot-divider"></span> {spot.numReviews} reviews
                        </h3>}
                        {spot.numReviews <= 0 && <h3>New</h3>}
                    </div>
                )}
            </div>
            {reviews && reviews.map(review => (

                <div key={review?.id} className="review-details-div">
                    <p className="fname">{review.User?.firstName}</p>
                    <p className="date">{monthNames[new Date(review?.createdAt).getMonth() + 1]} {new Date(review.createdAt).getFullYear()}</p>
                    <p className="description">{review.review}</p>
                    {currUser && currUser?.id === review.userId && (
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


