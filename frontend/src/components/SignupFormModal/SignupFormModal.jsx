import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../context/Modal';
import * as sessionActions from '../../store/session'
import './SignupFormModal.css'

const SignupFormModal = () => {
    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // Password matching control
    // useEffect(() => {
    //     const passwordMatchErr = { ...errors };
    //     if (confirmPassword !== password) {
    //         passwordMatchErr.confirmPassword = 'Passwords do not match';
    //     } else {
    //         delete passwordMatchErr.confirmPassword;
    //     }
    //     setErrors(passwordMatchErr);
    // }, [password, confirmPassword]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (confirmPassword === password) {
            setErrors({});
            return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
                .then(closeModal)
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data?.errors) setErrors(data.errors);
                    }
                );
        }
        return setErrors({
            confirmPassword: "Passwords do not match"
        });
    };
    console.log(errors)
    let disableButton = false
    const fieldNames = [firstName, lastName, email, username, password, confirmPassword]
    fieldNames.forEach(name => {
        if (name.length === 0) {
            disableButton = true
        }
    })

    disableButton = disableButton || !(username.length >= 4 && password.length >= 6)

    return (

        <>
            <h1 className='signup-form-heading'>Sign Up</h1>
            <form className='signup-form' onSubmit={handleSubmit}>
                {/* <label>First Name <span>*</span></label> */}
                <input
                    type='text'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder='First Name'
                />
                {errors.firstName && <p>{errors.firstName}</p>}
                {/* <label>Last Name <span>*</span></label> */}
                <input
                    type='text'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder='Last Name'
                />
                {errors.lastName && <p>{errors.lastName}</p>}
                {/* <label>Email <span>*</span></label> */}
                <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email'
                />
                {errors.email && <p>{errors.email}</p>}
                {/* <label>Username <span>*</span></label> */}
                <input
                    type='text'
                    value={username.toLowerCase()}
                    onChange={e => setUserName(e.target.value)}
                    placeholder='Username'
                />
                {errors.username && <p>{errors.username}</p>}
                {/* <label>Password <span>*</span></label> */}
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password'
                />
                {errors.password && <p>{errors.password}</p>}
                {/* <label>Confirm Password *</label> */}
                <input
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder='Confirm Password'
                />
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button className='signup-button' type='submit' disabled={disableButton}>Sign Up</button>
            </form>
        </>
    );
}



export default SignupFormModal;