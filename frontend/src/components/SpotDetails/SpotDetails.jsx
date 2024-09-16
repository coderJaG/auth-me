import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect} from "react";

import { spotDetails } from '../../store/spots';
import Reviews from "../Reviews";
import './SpotDetails.css'




const SpotDetails = () => {
  const dispatch = useDispatch();
  
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.spot);

  useEffect(() => {
    dispatch(spotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="spot-details-div">
        <h2 className="spot-name">{spot.name}</h2>
        <div className="spot"><p>{spot.city}, {spot.state}, {spot.country}</p></div>
      </div>
      <div>Images Div</div>
      {spot.Owner && <h1>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>}
      <p>{spot.description}</p>
      <div><span>${spot.price} night</span> <br />
        {(spot.avgStarRating > 0) && <span>stars {spot.avgStarRating}</span>} <br />
        {(spot.numReviews === 0) && <h4>New</h4>}
        {(spot.numReviews > 0) && <span>{spot.numReviews} reviews</span>}
        {(spot.numReviews === 0) && <h3>New</h3>}
        <button>Reserve</button>
        <Reviews />
      </div>
    </>
  );
}






export default SpotDetails