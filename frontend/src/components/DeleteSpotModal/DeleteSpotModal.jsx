import { useDispatch } from "react-redux";
import { deleteASpot } from "../../store/spots";
import { useModal } from "../context/Modal";
import { useState } from "react";
// import { deleteAReview } from "../../store/reviews";



const DeleteSpotModal = ({ spotId, reviewId, onDelete }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [errors, setErrors] = useState({})

    const handleYesClick = async (e) => {
        e.preventDefault()
        if (spotId) {
            return dispatch(deleteASpot(spotId))
                .then(() => {
                    closeModal();
                    onDelete();
                })
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data?.errors) setErrors(data.errors);
                    }
                );
        } else {
            return dispatch(deleteAReview(reviewId))
                .then(() => closeModal())
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data?.errors) setErrors(data.errors);
                    }
                );
        }
    }

    const handleNoClick = (e) => {
        e.preventDefault();
        closeModal();
    };


    return (
        <div>
            <h3> Confirm Delete</h3>
            <p>{spotId ? 'Are you sure you want to remove this spot from the listings' : 'Are you sure you want to delete this review'}</p>
            <button onClick={handleYesClick}>Yes</button>
            <button onClick={handleNoClick}>No</button>
        </div>
    )

}


export default DeleteSpotModal;