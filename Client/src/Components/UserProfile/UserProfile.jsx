import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Save, X, Shield, FileText } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Other',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    profileImage: {
      secure_url: ''
    },
    validID: {
      type: '',
      number: '',
      documentImage: {
        secure_url: ''
      }
    },
    isVerified: false,
    role: 'user',
    createdAt: ''
  });

  const [formData, setFormData] = useState({ ...user });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [documentImageFile, setDocumentImageFile] = useState(null);

  // Fetch user data from backend
  // Fetch user data from backend
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setFetchLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setFetchLoading(false);
        return;
      }

      // Call backend API
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Check response status
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch user profile');
      }

      // Verify response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      setUser(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to load user profile');
    } finally {
      setFetchLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.includes('validID.')) {
      const idField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        validID: {
          ...prev.validID,
          [idField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            profileImage: {
              ...prev.profileImage,
              secure_url: e.target.result
            }
          }));
        };
        reader.readAsDataURL(file);
      } else if (type === 'document') {
        setDocumentImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            validID: {
              ...prev.validID,
              documentImage: {
                ...prev.validID.documentImage,
                secure_url: e.target.result
              }
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add basic user fields
      const fieldsToSend = ['name', 'phone', 'gender', 'dateOfBirth'];
      fieldsToSend.forEach(field => {
        if (formData[field]) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add address fields
      if (formData.address) {
        Object.keys(formData.address).forEach(addrKey => {
          if (formData.address[addrKey]) {
            formDataToSend.append(addrKey, formData.address[addrKey]);
          }
        });
      }

      // Add validID fields
      if (formData.validID?.type) formDataToSend.append('validID.type', formData.validID.type);
      if (formData.validID?.number) formDataToSend.append('validID.number', formData.validID.number);

      // Add profile image if selected
      if (profileImageFile) {
        formDataToSend.append('profilePicture', profileImageFile);
      }

      // Add document image if selected
      if (documentImageFile) {
        formDataToSend.append('documentImage', documentImageFile);
      }

      // Get auth token
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Call update API
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      setFormData(data.user);
      setIsEditing(false);
      setProfileImageFile(null);
      setDocumentImageFile(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setProfileImageFile(null);
    setDocumentImageFile(null);
    setIsEditing(false);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Show loading spinner while fetching data
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if failed to load
  if (error && !user.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {(isEditing ? formData : user).profileImage?.secure_url ? (
                    <img
                      src={(isEditing ? formData : user).profileImage.secure_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'profile')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {(isEditing ? formData : user).name || 'User Profile'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  {user.isVerified && <Shield className="w-4 h-4 text-green-600" />}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{user.email || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{user.gender || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(user.dateOfBirth) || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.address?.street || 'Not provided'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address?.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address?.city || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address?.state || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address?.state || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.zip"
                      value={formData.address?.zip || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address?.zip || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address?.country || 'India'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{user.address?.country || 'India'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ID Verification */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ID Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                  {isEditing ? (
                    <select
                      name="validID.type"
                      value={formData.validID?.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select ID Type</option>
                      <option value="Aadhar Card">Aadhar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Passport">Passport</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{user.validID?.type || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="validID.number"
                      value={formData.validID?.number || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.validID?.number || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {(isEditing ? formData : user).validID?.documentImage?.secure_url ? (
                    <div className="relative">
                      <img
                        src={(isEditing ? formData : user).validID.documentImage.secure_url}
                        alt="Document"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {isEditing && (
                        <label className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'document')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        {isEditing ? 'Upload document image' : 'No document uploaded'}
                      </p>
                      {isEditing && (
                        <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'document')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-gray-900 capitalize">{user.role || 'User'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">{formatDate(user.createdAt) || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;