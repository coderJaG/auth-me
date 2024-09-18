import { useSelector, useDispatch } from 'react-redux';
import { useEffect} from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import { spotDetails, spots } from "../../store/spots";
import UpdateSpot from '../UpdateSpot';
import DeleteSpotModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton';
import './GetAllSpots.css';





const GetAllSpots = ({ allSpots, currUserSpots }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showUpdateSpot = false;

  const allSPotsFromStore = useSelector(state => state.spots.spots)
  allSpots = allSpots || allSPotsFromStore;

  useEffect(() => {
    if (!allSpots) {
      dispatch(spots());
    }
  }, [dispatch]);

  if (!allSpots) {
    return <div>Loading...</div>;
  }

  const currUserClass = !currUserSpots ? 'hidden' : ''

  return (

      <div className='main-spot-container'>
        {/* <h1 className='spots-header'>All Spots</h1> */}
        {/* currUserSpots props enables additional current user only spots functionality */}
        <div className='manage-spot-header'>
          {currUserSpots && <h2 className={currUserClass}>Manage Your Spots</h2>}
          {currUserSpots && <button className={currUserClass} onClick={() => navigate('/spots')}>Create a new Spot</button>}
        </div>
        <div className='spots-container'>

          {allSpots.map(spot => (
            <div key={spot.id} className='spot' title={spot.name}>
                <NavLink  className='spot-details-link' to={`/spots/${spot.id}`}>
                {/* <h3 className='spots-name'>{spot.name}</h3> */}
                {spot.previewImage ? (
                  <img className='spots-image' src={spot.previewImage} />
                ) : (
                  <div className="loading-indicator">Loading...</div>
                )}

                <div id='spots-tags'>
                  <p id='spots-city-state'>{spot.city}, {spot.state}</p>
                  {spot.avgRating > 0 && <p id='spots-star-rating'>{<i className="fas fa-star"></i>} {spot.avgRating}</p>}
                  {spot.avgRating === "Not yet rated" && <p id='spots-star-rating'> New </p>}
                  <p id='spots-price'>${spot.price} night</p>
                </div>
                </NavLink>
                {currUserSpots && <button className={currUserClass} onClick={() => {
                  dispatch(spotDetails(spot.id));
                  navigate(`/spots/${spot.id}/edit`)
                }}>Update</button>}
                {showUpdateSpot && <UpdateSpot />}
                {currUserSpots && <span className={currUserClass} >
                  <OpenModalButton
                    buttonText='Delete'
                    modalComponent={<DeleteSpotModal spotId={spot.id} />} />
                </span>}
              </div>
          ))}
        </div>
      </div>
   
  );
}



export default GetAllSpots;