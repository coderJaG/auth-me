import { useState, useEffect } from 'react';
import {useDispatch } from 'react-redux';
import { useModal } from '../context/Modal';
import * as sessionActions from '../../store/session'

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
    useEffect(() => {
        const passwordMatchErr = { ...errors };
        if (confirmPassword !== password) {
            passwordMatchErr.confirmPassword = 'Passwords do not match';
        } else {
            delete passwordMatchErr.confirmPassword;
        }
        setErrors(passwordMatchErr);
    }, [password, confirmPassword]);


    const handleSubmit = async (e) => {
        e.preventDefault();

       
        if (confirmPassword !== password) {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
            return;
        }

        try {
            await dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
            .then(closeModal);
            setErrors({});
        } catch (res) {
            const data = await res.json();
            if (data?.errors) {
                setErrors({ ...errors, ...data.errors });
            }
        }
    };

    //const ifErrors = Object.values(errors).length > 0

    return (

        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>First Name <span>*</span></label>
                <input
                    type='text'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}

                />
                {errors.firstName && <p>{errors.firstName}</p>}
                <label>Last Name <span>*</span></label>
                <input
                    type='text'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}

                />
                {errors.lastName && <p>{errors.lastName}</p>}
                <label>Email <span>*</span></label>
                <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}

                />
                {errors.email && <p>{errors.email}</p>}
                <label>Username <span>*</span></label>
                <input
                    type='text'
                    value={username.toLowerCase()}
                    onChange={e => setUserName(e.target.value)}

                />
                {errors.username && <p>{errors.username}</p>}
                <label>Password <span>*</span></label>
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}

                />
                {errors.password && <p>{errors.password}</p>}
                <label>Confirm Password *</label>
                <input
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type='submit' >Sign Up</button>
            </form>
        </>
    );
}



export default SignupFormModal;