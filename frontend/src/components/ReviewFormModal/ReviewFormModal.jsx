import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createNewReview } from "../../store/spots";

import { useModal } from "../context/Modal";
import Stars from "../Stars/Stars";

import '../Stars/Stars.css';



const ReviewFormModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const closeModal = useModal();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    spotId = +spotId;

    const HandleStarClick = (newRating) => {
        setRating(newRating);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        return dispatch(createNewReview({ review, stars: rating }, spotId)) 
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label><h4>How was your stay?</h4></label>
                {errors.review && <p>{errors.review}</p>}
                {errors.stars && <p>{errors.stars}</p>}
                <textarea
                    value={review}
                    onChange={e => setReview(e.target.value)}
                >
                </textarea>
                <div className="ratings">
                    {
                        [...Array(5)].map((star, i) => (
                            <Stars
                                key={i}
                                selected={i < rating}
                                onClick={() => { HandleStarClick(i + 1) }}
                            />
                        ))
                    }
                </div>
                <button type="submit">Submit your review</button>
            </form>
        </>
    )


}

export default ReviewFormModal;
