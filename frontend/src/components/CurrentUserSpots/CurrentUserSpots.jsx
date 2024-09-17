import { useSelector , useDispatch} from "react-redux";
import GetAllSpots from "../GetAllSpots";
import { useEffect } from "react";

import { spots } from "../../store/spots";
import './CurrentUserSpots.css'

const CurrentUserSpots = () => {
const dispatch = useDispatch()
const getAllSpots = useSelector(state=> state.spots.spots)
const currUser = useSelector(state=> state.session.user)
const currUserSpots = true;

useEffect(() => {
    if(!getAllSpots){
      dispatch(spots());
    }
  }, [dispatch]);

    return (
        <>
        {/* <h1>User Spots</h1> */}
       
       
       {getAllSpots && <GetAllSpots allSpots={getAllSpots.filter(spot=> spot.ownerId === currUser.id)} currUserSpots={currUserSpots}/>}

        </>
    )

}


export default CurrentUserSpots;