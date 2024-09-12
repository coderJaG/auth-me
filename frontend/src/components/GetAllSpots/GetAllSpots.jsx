import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GetAllSpots.css';




import { spots } from "../../store/spots";

const GetAllSpots = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector(state => state.spots.spots);

  useEffect(() => {
    dispatch(spots());
  }, [dispatch]);

  if (!allSpots) {
    return <div>Loading...</div>;
  }


  return (
    <>

      <h1>All Spots</h1>
      <div className='spots-container'>
        {allSpots.map(spot => (
          <div key={spot.id} className='spot'>
            {spot.previewImage ? (
              <span><Link to={`/spots/${spot.id}`}><img src={spot.previewImage}/></Link></span>
            ) : (
              <div className="loading-indicator">Loading...</div> 
            )}
            <h3>{spot.name}</h3>
            <p>{spot.city}, {spot.state} {spot.avgRating}</p>
            <p>${spot.price} night</p>
          </div>
        ))}
      </div>
    </>
  );
}



export default GetAllSpots;