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
    const [alert, setAlert] = useState('');
    const [signAlert, setSignAlert] = useState('');

    const toggleForm = () => {
        setSignupFormVisibility(!isSignupFormVisible);
    };

    const signup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/registrations?name=${name}`, {
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
            if (data.message !== "") {
                setSignAlert(data.message)
                setTimeout(() => {
                    setSignAlert('')
                }, 3000);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions?email=${emailLogin}&password=${passwordLogin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setAlert('Login failed')
                setTimeout(() => {
                    setAlert('')
                }, 3000);
                throw new Error('Login failed');
            }

            const data = await response.json();
            setToken(data.authentication_token)

        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    const forgotPassword = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player: {
                        email: emailLogin,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send reset password email');
            }

            setAlert('An email has been sent with password reset instructions.');
        } catch (error) {
            console.error('Error sending reset password email:', error.message);
            setAlert('Failed to send reset password email.');
        }
    };

    return (
        <>
            <div style={bannerStyle}>
                <img src="https://res.cloudinary.com/dsiamykrd/image/upload/v1728201874/LogoCOL_cxdbws.webp" alt="Banner" style={imageStyle} />
            </div>
            <div>
                {isSignupFormVisible &&
                    <button style={buttonStyle} onClick={toggleForm}>
                        Create account
                    </button>
                }

                {isSignupFormVisible ? (
                    <></>
                ) : (
                    <div>
                        <form onSubmit={signup} style={formStyle}>
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" style={inputStyle} />

                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" style={inputStyle} />

                            <label>Password Confirmation:</label>
                            <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={inputStyle} />

                            <label>Name:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength="20" style={inputStyle} />

                            <button type="submit" style={buttonStyle}>Sign Up</button>
                        </form>
                        <p>{signAlert}</p>
                    </div>
                )}
            </div>
            <form onSubmit={login} style={formStyle}>
                <label>Email:</label>
                <input type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required style={inputStyle} />

                <label>Password:</label>
                <input type="password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required style={inputStyle} />

                <button type="submit" style={buttonStyle}>Login</button>
            </form>

            <button onClick={forgotPassword} style={buttonStyle}>
                Forgot Password
            </button>
            <p>{alert}</p>
        </>
    );
};

const inputStyle = {
    margin: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: 'black',
};

const buttonStyle = {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
};

const bannerStyle = {
    display: 'flex',          
    justifyContent: 'center', 
    marginBottom: '10px',   
};

const imageStyle = {
    margin: '20px',
    maxWidth: '40%', 
    height: 'auto',
    borderRadius: '5px',
};

const formStyle = {
    textAlign: 'center',
    margin: '10px 0',
};

export default Auth;
