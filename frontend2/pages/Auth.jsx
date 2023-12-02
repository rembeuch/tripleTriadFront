// App.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';

const Auth = () => {
    const { authToken, setToken, clearToken } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [name, setName] = useState('');
    const [isSignupFormVisible, setSignupFormVisibility] = useState(true);
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const toggleForm = () => {
        setSignupFormVisibility(!isSignupFormVisible);
    };

    const signup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/v1/registrations?name=${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player: {
                        email,
                        password,
                        password_confirmation: passwordConfirmation,
                        name,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            setToken(data.token)
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/v1/sessions?email=${emailLogin}&password=${passwordLogin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            setToken(data.authentication_token)

        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    return (
        <>
            <div>
                <button onClick={toggleForm}>
                    {isSignupFormVisible ? 'Create account' : ''}
                </button>
                {isSignupFormVisible ? (
                    <></>
                ) : (
                    <div>
                        <form onSubmit={signup} style={{ textAlign: 'center', margin: '20px' }}>
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

                            <label>Password Confirmation:</label>
                            <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={inputStyle} />

                            <label>Name:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />

                            <button type="submit" style={buttonStyle}>Sign Up</button>
                        </form>
                    </div>
                )}
            </div>
            <form onSubmit={login} style={{ textAlign: 'center', margin: '20px' }}>
                <label>Email:</label>
                <input type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required style={inputStyle} />

                <label>Password:</label>
                <input type="password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required style={inputStyle} />

                <button type="submit" style={buttonStyle}>Login</button>
            </form>
        </>
    );
};

const inputStyle = {
    margin: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
};

export default Auth;
