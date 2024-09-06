import { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {Navigate} from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './LoginFormPage.css';

function LoginFormPage () {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state =>  state.session.user)
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to="/" replace={true} />;

   const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      }
    );
  };

    return (
        <>
        <h1 className="login-form-heading">Log In</h1>

        <form className='login-form' onSubmit={handleSubmit}>
            <label>Username or Email</label>
            <input type="text"
            value={credential}
            placeholder="Enter your Username or Email"
            onChange={e => setCredential(e.target.value)}
            required
            />
            
            <label>Password</label>
            <input type="password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            />
            {errors.credential && <p>{errors.credential}</p>}
            {errors.password && <p>{errors.password}</p>}
            <button type="submit">Login</button>

        </form>
        </>
    )
}

export default LoginFormPage;