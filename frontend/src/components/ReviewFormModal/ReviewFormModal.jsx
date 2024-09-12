// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { createNewReview } from "../../store/spots";

// import { useModal } from "../context/Modal";
// import Stars from "../Stars/Stars";

// import '../Stars/Stars.css';



// const ReviewFormModal = ({ spotId }) => {
//     const dispatch = useDispatch();
//     const closeModal = useModal();
//     const [review, setReview] = useState('');
//     //const [stars, setStars] = useState('');
//     const [rating, setRating] = useState(0);
//     const [errors, setErrors] = useState({});
//     spotId = +spotId;
//     let stars;

//     const HandleStarClick = (newRating) => {
//         setRating(newRating);

//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!review || !stars) {
//             setErrors({
//                 ...errors,
//                 review: review ? '' : 'Review is required',
//                 stars: rating === 0 ? 'Star rating is required' : ''
//             });
//             return;
//         }

//         try {
//             await dispatch(createNewReview({ review, stars: rating }, spotId));
//             closeModal();
//         } catch (res) {
//             const data = await res.json();
//             if (data?.errors) {
//                 setErrors(data.errors);
//             }
//         }
//     }

//     return (
//         <>
//             <form onSubmit={handleSubmit}>
//                 <label><h4>How was your stay?</h4></label>
//                 {errors && <p>{errors.review}</p>}
//                 {errors && <p>{errors.stars}</p>}
//                 <textarea
//                     value={review}
//                     onChange={e => setReview(e.target.value)}
//                 >
//                 </textarea>
//                 {/* <input
//                     type="number"
//                     value={stars}
//                     onChange={e => setStars(e.target.value)}
//                 /> */}
//                 <div className="ratings">
//                     {
//                         [...Array(5)].map((star, i) => (
//                             <Stars
//                                 key={i}
//                                 selected={i < rating}
//                                 onClick={() => { HandleStarClick(i + 1) }}
//                             />
//                         ))
//                     }
//                 </div>
//                 <button type="submit">Submit your review</button>
//             </form>
//         </>
//     )


// }

// export default ReviewFormModal;


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createNewReview } from "../../store/spots";
import { useModal } from "../context/Modal";

const ReviewFormModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const closeModal = useModal();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');
  const [errors, setErrors] = useState({});

  spotId = +spotId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!review || !stars) {
      setErrors({ 
        ...errors, 
        review: review ? '' : 'Review is required', 
        stars: stars ? '' : 'Stars are required'
      });
      return;
    }

    try {
      await dispatch(createNewReview({ review, stars }, spotId))
      .then(()=> closeModal());
    } catch (data) {
      if (data?.errors) {
        setErrors(data.errors);
      }
    }
  };

  console.log(", these are errors", errors);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="review"><h4>How was your stay?</h4></label>
        {errors.review && <p>{errors.review}</p>}
        <textarea
          id="review" 
          value={review}
          onChange={e => setReview(e.target.value)}
        >
        </textarea>

        <label htmlFor="stars">Stars</label> 
        {errors.stars && <p>{errors.stars}</p>}
        <input
          id="stars" 
          type="number"
          value={stars}
          onChange={e => setStars(e.target.value)}
        />

        <button type="submit">Submit your review</button>
      </form>
    </>
  );
}

export default ReviewFormModal;