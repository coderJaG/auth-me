import { useSelector} from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// import { newSpot } from "../../store/spots";
import CreateSpot from "../CreateSpot";

const UpdateSpot = () => {
    // const dispatch = useDispatch()
    const spotInfo = useSelector(state=> state.spots.spot)
    

    return (
        <>
        <CreateSpot spotInfo={spotInfo} />
        </>
    )

}


export default UpdateSpot;