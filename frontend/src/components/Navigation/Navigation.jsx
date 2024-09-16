import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import { clearSpotDetails } from "../../store/spots";


const Navigation = () => {

    const currUser = useSelector(state => state.session.user)

    const userHomeClass = currUser ? 'user-home' : 'home'

    return (
        <>
        <div className="nav-bar">
            {<NavLink to='/'> <img className='logo' src="/auth-me-logo" /> </NavLink>}
        <div className="nav-right">
         {currUser && <NavLink className="nav-create-spot-link nav-right" to='/spots' onClick={()=> dispatch(clearSpotDetails())}>Create a New Spot</NavLink>}
            <ul className="nav-ul ">
                <li className={userHomeClass}> <NavLink to='/'>Home</NavLink></li>
                {!currUser && <li className="login"><OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                </li>}
                {!currUser && <li className="signup"><OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
                </li>}
                {currUser && <li className="profile"><ProfileButton user={currUser} /></li>}
            </ul>
            </div>
        </div>
        <hr/>
        </>
    )
}




export default Navigation;