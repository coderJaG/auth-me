import { useState} from "react";
import { useDispatch} from "react-redux";
import * as sessionActions from '../../store/session';
import './LoginFormModal.css';

function LoginFormModal () {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});


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
            <label>Username or Email *</label>
            <input type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            />
            {errors.credential && <p>{errors.credential}</p>}
            <label>Password *</label>
            <input type="password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}  
            />
            {errors.password && <p>{errors.password}</p>}
            <button type="submit">Login</button>

        </form>
        </>
    )
}

export default LoginFormModal;