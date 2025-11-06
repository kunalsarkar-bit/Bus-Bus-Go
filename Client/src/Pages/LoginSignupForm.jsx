import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Assuming you're using axios for API calls

export default function LoginSignupForm() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
    setErrorMessage('');
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
  setErrorMessage("Password must be at least 6 characters long.");
  return;
}

    try {
      const response = await axios.post('/api/users/create-account', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to verification page since a new user is not verified by default
      navigate('/verify');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error creating account');
    }
  };
const handleSignIn = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('/api/users/login', {
      email: formData.email,
      password: formData.password
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if (!user.isVerified) {
      return navigate('/verify'); // ❌ Not verified
    }

    // ✅ Check user role
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/'); // regular user
    }

  } catch (error) {
    setErrorMessage(error.response?.data?.message || 'Invalid credentials');
  }
};


  return (
    <div className="font-['Montserrat'] bg-[#f6f5f7] flex flex-col justify-center items-center min-h-screen py-12">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <div 
        className={`bg-white rounded-lg shadow-2xl relative overflow-hidden w-full max-w-3xl min-h-[480px] ${
          isRightPanelActive ? 'right-panel-active' : ''
        }`}
      >
        {/* Sign Up Container */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out w-1/2 ${
          isRightPanelActive 
            ? 'translate-x-full opacity-100 z-5' 
            : 'opacity-0 z-1'
        }`}>
          <form 
            className="bg-white flex flex-col px-10 h-full justify-center items-center text-center"
            onSubmit={handleSignUp}
          >
            <h1 className="font-bold text-xl mb-3">Create Account</h1>
            <div className="flex my-5">
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-facebook-f text-blue-500"></i>
              </a>
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-google-plus-g text-blue-500"></i>
              </a>
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-linkedin-in text-blue-500"></i>
              </a>
            </div>
            <span className="text-xs">or use your email for registration</span>
            <input 
              type="text" 
              name="name"
              placeholder="Name" 
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="submit"
              className="rounded-full border border-blue-500 bg-blue-500 text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition duration-80 ease-in mt-4 hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-2 ${
          isRightPanelActive ? 'translate-y-full' : ''
        }`}>
          <form 
            className="bg-white flex flex-col px-10 h-full justify-center items-center text-center"
            onSubmit={handleSignIn}
          >
            <h1 className="font-bold text-xl mb-3">Sign in</h1>
            <div className="flex my-5">
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-facebook-f text-blue-500"></i>
              </a>
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-google-plus-g text-blue-500"></i>
              </a>
              <a href="#" className="border border-blue-500 rounded-full flex justify-center items-center mx-1 h-10 w-10">
                <i className="fab fa-linkedin-in text-blue-500"></i>
              </a>
            </div>
            <span className="text-xs">or use your account</span>
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
           <Link to="/forgot-password" className="text-blue-900 text-sm my-4">
              Forgot your password?
            </Link>
            <button 
              type="submit"
              className="rounded-full border border-blue-500 bg-blue-500 text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition duration-80 ease-in hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition transform duration-600 ease-in-out z-100 ${
          isRightPanelActive ? '-translate-x-full' : ''
        }`}>
          <div className={`bg-gradient-to-r from-blue-500 to-blue-500 text-white relative left-[-100%] h-full w-[200%] transition transform duration-600 ease-in-out ${
            isRightPanelActive ? 'translate-x-1/2' : ''
          }`}>
            {/* Overlay Left Panel */}
            <div className={`absolute top-0 flex flex-col justify-center items-center px-10 h-full w-1/2 text-center transition transform duration-600 ease-in-out ${
              isRightPanelActive ? 'translate-y-0' : '-translate-y-5'
            }`}>
              <h1 className="font-bold text-2xl mb-2">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide mb-6">
                To keep connected with us please login with your personal info
              </p>
              <button 
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition duration-80 ease-in hover:bg-blue-600"
                onClick={handleSignInClick}
                type="button"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right Panel */}
            <div className={`absolute top-0 right-0 flex flex-col justify-center items-center px-10 h-full w-1/2 text-center transition transform duration-600 ease-in-out ${
              isRightPanelActive ? 'translate-y-5' : ''
            }`}>
              <h1 className="font-bold text-2xl mb-2">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide mb-6">
                Enter your personal details and start journey with us
              </p>
              <button 
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition duration-80 ease-in hover:bg-blue-600"
                onClick={handleSignUpClick}
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}