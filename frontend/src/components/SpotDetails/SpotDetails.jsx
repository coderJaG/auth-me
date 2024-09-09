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
      <div>
        <h2>{spot.name}</h2>
        {/* ... display other spot details */}
      </div>
    );
  }
  





export default SpotDetails