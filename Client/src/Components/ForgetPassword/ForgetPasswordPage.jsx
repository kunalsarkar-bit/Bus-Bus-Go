import React, { useState } from 'react';
import axios from 'axios';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Get API URL from environment variable or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setMessage('');
    setIsSuccess(false);
    
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/users/forgot-password`,
        { email: email.trim().toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      setMessage(response.data.message);
      setIsSuccess(true);
      setEmail(''); // Clear email field on success
    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait before trying again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setMessage('');
                  setIsSuccess(false);
                }}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-150 ${
                  error 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading || !email.trim()}
              className={`w-full py-2 px-4 rounded-md font-medium transition duration-150 ${
                isLoading || !email.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : 'Send Reset Link'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              isSuccess 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <div className="flex">
                <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              <div className="flex">
                <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-150"
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}