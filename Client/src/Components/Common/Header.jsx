import { useState, useEffect } from 'react';
import { Bus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (user?.email) {
      fetchProfileImage(user.email);
    }
  }, [user?.email]);

  const fetchProfileImage = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/users/profile-image/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile image');
      }
      const data = await response.json();
      setProfileImage(data.profileImage?.secure_url || null);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload(); // Refresh the page to update the UI
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BusGo</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/busses" className="text-gray-700 hover:text-blue-600 font-medium">Busses</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            
            {user ? (
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                  Sign In
                </button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/busses" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Busses
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            <>
              <div className="flex items-center px-3 py-2">
                {loading ? (
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-2"></div>
                ) : profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover mr-2"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <span className="text-sm text-gray-700 truncate">{user.email}</span>
              </div>
              <Link 
                to="/profile" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}