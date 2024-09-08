import { useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { ImCool2 } from "react-icons/im";
import * as sessionActions from '../../store/session';


const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        return (
            dispatch(sessionActions.logOutCurrUser())
        );
    };

    const menuClassName = "profile-dropdown" + (showMenu ? '' : ' hidden')




    return (
        <>
            <button className='profile-btn' onClick={toggleMenu}>
                <div className="profile-icon">
                    <ImCool2 />
                </div>
            </button>
            <ul className={menuClassName} ref={ulRef} >
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName} </li>
                <li>{user.email}</li>
                {user && <li><button className='logout-btn' onClick={logout}>Log Out</button></li>}
            </ul>
        </>
    )

}


export default ProfileButton;