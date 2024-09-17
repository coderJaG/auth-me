


import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { spotDetails } from '../../store/spots';
import Reviews from "../Reviews";
import './SpotDetails.css'




const SpotDetails = () => {
  const dispatch = useDispatch();

  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.spot);
  const reviews = useSelector(state => state.spots.reviews)

  useEffect(() => {
    dispatch(spotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spot-details-container">
      <div className="top">
        <div className="spot-details-div ">
          <h2 className="spot-name">{spot.name}</h2>
          <div className="spot"><p>{spot.city}, {spot.state}, {spot.country}</p></div>
        </div>
        <div id='spot-images-div'>
          <div id="main-image">
            <img src={spot?.SpotImages[0].url} />
          </div>
          <div id='spot-images'>
            {spot?.SpotImages.slice(1).map(image => {
             return (
                <div key={image.id} >

                  <img className="image" src={image.url} />

                </div>)
            })}
          </div>
        </div>
      </div>
      <div className="middle">
        <div className="description">
        {spot.Owner && <h1>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>}
      <p>{spot.description}</p>
      </div>
      </div>
      <div className="spot-tags middle">
        <div className="tags price">
          <span>${spot.price} night</span>
        </div>
        <div className="tags rating">
          {(spot.avgStarRating > 0) && <span ><i className="fas fa-star"></i> {spot.avgStarRating}<span className="dot-divider"></span></span>}
          {/* {(spot.numReviews === 0) && <h4>New</h4>} */}
          {(spot.numReviews > 0) && <span>{spot.numReviews} reviews</span>}
          {(spot.numReviews === 0) && <h3>New</h3>}
        </div>
        <div className="tags reserve-btn"> <button>Reserve</button></div>
      </div>
      <Reviews />
    </div>


  );
}






export default SpotDetails