import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import './Navigation.css';


const Navigation = () => {

    const currUser = useSelector(state => state.session.user)

    const userHomeClass = currUser ? 'user-home' : 'home'

    return (
        <div className="nav-bar">
            <ul className="nav-ul">
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
    )
}




export default Navigation;