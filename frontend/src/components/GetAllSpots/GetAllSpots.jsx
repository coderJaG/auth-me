import { useSelector, useDispatch } from 'react-redux';
import { useEffect , useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GetAllSpots.css';




import { spotDetails, spots } from "../../store/spots";
import UpdateSpot from '../UpdateSpot';




const GetAllSpots = ({ allSpots , currUserSpots }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUpdateSpot, setShowUpdateSpot] = useState(false);

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
    <>

      <h1>All Spots</h1>
   {/* currUserSpots props enables additional current user only spots functionality */}
      {currUserSpots && <h2 className={currUserClass}>Manage Your Spots</h2>}
      {currUserSpots && <button className={currUserClass} onClick={e => navigate('/spots')}>Create a new Spot</button>}
      <div className='spots-container'>
        {allSpots.map(spot => (
          <div key={spot.id} className='spot'>
            {spot.previewImage ? (
              <span><Link to={`/spots/${spot.id}`}><img src={spot.previewImage} /></Link></span>
            ) : (
              <div className="loading-indicator">Loading...</div>
            )}
            <h3>{spot.name}</h3>
            <p>{spot.city}, {spot.state} {spot.avgRating}</p>
            <p>${spot.price} night</p>
            {currUserSpots && <button className={currUserClass} onClick={e => {
              dispatch(spotDetails(spot.id));
              navigate(`/spots/${spot.id}/edit`)
          }}>Update</button> }
            {showUpdateSpot && <UpdateSpot />}
            {currUserSpots && <button className={currUserClass} onClick={e => navigate(`/spots/${spot.id}`)}>Delete</button>}
          </div>
        ))}
      </div>
    </>
  );
}



export default GetAllSpots;