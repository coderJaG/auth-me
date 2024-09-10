import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {spotDetails} from '../../store/spots';




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
      <div>
        <h2>{spot.name}</h2>
        <p>{spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div>Images Div</div>
      <h1>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>
      <p>{spot.description}</p>
      <div><span>${spot.price} night</span> <br />
      <span>stars {spot.avgStarRating}</span> <br />
      <span>{spot.numReviews} reviews</span>
      <button>Reserve</button>
      </div>
      </>
    );
  }
  





export default SpotDetails