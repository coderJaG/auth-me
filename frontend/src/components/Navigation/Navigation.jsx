import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import * as sessionActions from '../../store/session'
import ProfileButton from "./ProfileButton";


const Navigation = () => {
    const dispatch = useDispatch()
    const currUser = useSelector(state => state.session.user)
    return (
        <ul>
            <li> <NavLink to='/'>Home</NavLink></li>
            {!currUser && <li><NavLink to='/login'>Login</NavLink></li>}
            {!currUser && <li><NavLink to='/users'>Sign Up</NavLink></li>}
            {currUser && <li><ProfileButton user={currUser} /></li>}
            {currUser && <li><button onClick={e => {
                e.preventDefault();
                dispatch(sessionActions.logOutCurrUser())
            }}>Log Out</button></li>}
        </ul>
    )
}




export default Navigation;