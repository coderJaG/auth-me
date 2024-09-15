import { useLocation } from "react-router-dom"
import UpdateSpot from "../UpdateSpot";
import SpotDetails from "../SpotDetails";

const SpotLayout = () => {
    const location  = useLocation();
    const isUpdateRoute = location.pathname.endsWith('/edit');

    return(
        <>
        {isUpdateRoute ? <UpdateSpot /> : <SpotDetails />}
        </>
    )
}

export default SpotLayout;