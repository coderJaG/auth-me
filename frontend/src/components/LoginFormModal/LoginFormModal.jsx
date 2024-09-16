import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session';
import { useModal } from "../context/Modal";
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  //  const handleSubmit = async (e) => {
  //   e.preventDefault();
  //    setErrors({});
  //   return await dispatch(sessionActions.login({ credential, password }))
  //   .then(()=> closeModal())
  //   .catch(
  //     async (res) => {
  //       const data = await res.json();
  //       if (data?.errors) setErrors(data.errors);
  //     }
  //   );

  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await dispatch(sessionActions.login({ credential, password }));
      if (res.ok) {
        closeModal();
      } else {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else if (data && data.message) {
          setErrors({ credential: data.message });
        } else {
          setErrors({ credential: 'The provided credentials were invalid.' });
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({ credential: 'The provided credentials were invalid.' });
    }
  };

  const handleDemoLogin = async () => {
    setCredential('Demo-lition')
    setPassword('password')
    const fakeEvent = { preventDefault: () => {} }; 
    await handleSubmit(fakeEvent);
  }

  const disableButton = (credential.length >= 4 && password.length >= 6) ? false : true
  return (
    <>
      <h2 className="login-form-heading">Log In</h2>

      <form className='login-form' onSubmit={handleSubmit}>
        {errors.credential && <p>{errors.credential}</p>}
        {/* <label>Username or Email *</label> */}
        <input type="text"
          value={credential}
          onChange={e => setCredential(e.target.value)}
          placeholder="Username or Email"
        />

        {/* <label>Password *</label> */}
        <input type="password"
          value={password}
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button className='login-button' type="submit" disabled={disableButton}>Login</button>
        <button className="demo-button" onClick={handleDemoLogin}>Demo User</button>

      </form>
    </>
  )
}

export default LoginFormModal;