import React, { useEffect, useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Google from '../../../assets/google-icon.svg';
import Vedive from '../../../assets/Vedive.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display error messages
  const navigate = useNavigate(); // For redirection after login

  useEffect(() => {
    document.querySelectorAll('.input-login-field').forEach(input => {
      if (input.value) {
        input.nextElementSibling.classList.add('active');
      }
      input.addEventListener('focus', () => {
        input.nextElementSibling.classList.add('active');
      });
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.nextElementSibling.classList.remove('active');
        }
      });
    });

    // Cleanup event listeners when the component is unmounted
    return () => {
      document.querySelectorAll('.input-login-field').forEach(input => {
        input.removeEventListener('focus', () => {});
        input.removeEventListener('blur', () => {});
      });
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle login errors
        setError(data.error || 'An error occurred during login.');
        return;
      }

      // Save the token in localStorage or sessionStorage
      localStorage.setItem('token', data.token);

      // Redirect based on user role
      if (data.role === 'admin') {
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      } else {
        navigate('/user-dashboard'); // Redirect to user dashboard
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <header className='login-header'>
        <img src={Vedive} alt='logo' />
      </header>
      <div className="login-container">
        <h2>Sign in to Vedive</h2>
        <hr className='login-hr' />
        <button className="google-btn">
          <img src={Google} alt="Google Icon" /> Continue with Google
        </button>
        <form onSubmit={handleLogin}>
          <div className="input-login-group">
            <input
              type="email"
              className="input-login-field"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="input-login-label" htmlFor="email">
              Email
            </label>
          </div>
          <div className="input-login-group">
            <input
              type="password"
              className="input-login-field"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="input-login-label" htmlFor="password">
              Password
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        {/* <div className="links">
          <Link
            to="/reset"
            style={{ borderBottom: 'solid 1px #0059FF' }}
          >
            Reset Password
          </Link>
          <p>
            No Account? <Link to="/create-account">Create One</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;