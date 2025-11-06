import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from location state (passed from login page)
  const userFromLogin = JSON.parse(localStorage.getItem('user')) || {};
  
  // Calculate max date (18 years ago from today)
  const calculateMaxDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const [form, setForm] = useState({
    fullName: userFromLogin.name || '',
    email: userFromLogin.email || '',
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
    validID: {
      type: 'Aadhar Card',
      number: '',
      documentImage: null
    },
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for auth token - redirect to login if not available
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: 'Please login to verify your account' } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (files[0].size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [name]: `File size must be less than 5MB`
        }));
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(files[0].type)) {
        setErrors(prev => ({
          ...prev,
          [name]: `Only JPEG, JPG and PNG files are allowed`
        }));
        return;
      }

      if (name === 'profileImage') {
        setForm(prev => ({
          ...prev,
          profileImage: files[0]
        }));
        // Clear error if exists
        if (errors.profileImage) {
          setErrors(prev => ({ ...prev, profileImage: undefined }));
        }
      } else if (name === 'documentImage') {
        setForm(prev => ({
          ...prev,
          validID: {
            ...prev.validID,
            documentImage: files[0]
          }
        }));
        // Clear error if exists
        if (errors.documentImage) {
          setErrors(prev => ({ ...prev, documentImage: undefined }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Phone validation
    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Date of Birth validation
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(form.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0) || 
          (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to register';
      }
    }
    
    // Address validation
    if (!form.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!form.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!form.address.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!form.address.zip.trim()) {
      newErrors.zip = 'ZIP/Postal code is required';
    } else if (!/^\d{6}$/.test(form.address.zip)) {
      newErrors.zip = 'ZIP code must be 6 digits';
    }
    
    // Valid ID validation
    if (!form.validID.number) {
      newErrors.validIDNumber = 'ID number is required';
    } else {
      // ID number format validation based on type
      switch(form.validID.type) {
        case 'Aadhar Card':
          if (!/^\d{12}$/.test(form.validID.number)) {
            newErrors.validIDNumber = 'Aadhar number must be 12 digits';
          }
          break;
        case 'PAN Card':
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.validID.number)) {
            newErrors.validIDNumber = 'PAN number format is invalid (e.g., ABCDE1234F)';
          }
          break;
        case 'Passport':
          if (!/^[A-Z]{1}[0-9]{7}$/.test(form.validID.number)) {
            newErrors.validIDNumber = 'Passport number format is invalid';
          }
          break;
        case 'Driving License':
          if (!/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/.test(form.validID.number)) {
            newErrors.validIDNumber = 'Driving License number format is invalid';
          }
          break;
        case 'Voter ID':
          if (!/^[A-Z]{3}[0-9]{7}$/.test(form.validID.number)) {
            newErrors.validIDNumber = 'Voter ID format is invalid';
          }
          break;
        default:
          break;
      }
    }
    
    if (!form.validID.documentImage) {
      newErrors.documentImage = 'ID document image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add personal information
      formData.append('fullName', form.fullName);
      formData.append('phone', form.phone);
      formData.append('gender', form.gender);
      formData.append('dateOfBirth', form.dateOfBirth);
      
      // Add address information
      formData.append('street', form.address.street);
      formData.append('city', form.address.city);
      formData.append('state', form.address.state);
      formData.append('zip', form.address.zip);
      formData.append('country', form.address.country);
      
      // Add ID information - Note the key name changes to match backend expectations
      formData.append('idType', form.validID.type);
      formData.append('idNumber', form.validID.number);
      
      // Add files
      if (form.profileImage) {
        formData.append('profilePicture', form.profileImage);
      }
      
      if (form.validID.documentImage) {
        formData.append('idDocument', form.validID.documentImage);
      }
      
      // Get auth token
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/users/verify-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message || 'Verification information submitted successfully! We will review your details soon.');
        // Update user in local storage if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        throw new Error(data.message || 'Failed to verify profile');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'There was a problem submitting your verification. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Account Verification</h1>
          <p className="mt-2 text-lg text-gray-600">Please complete your profile to verify your account</p>
        </div>
        
        {successMessage ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-3 bg-green-100 px-2 py-1 rounded text-green-800 text-sm hover:bg-green-200"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Name from your account details</p>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email from your account details</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number*</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10-digit number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  <p className="mt-1 text-xs text-gray-500">Enter a valid 10-digit phone number</p>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender*</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth* (18+ only)</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    max={calculateMaxDate()}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                  <p className="mt-1 text-xs text-gray-500">You must be at least 18 years old</p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image (Optional)</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors.profileImage ? 'border-red-500' : ''}`}
                  />
                  {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
                  <p className="mt-1 text-xs text-gray-500">Max file size: 5MB. Allowed formats: JPG, JPEG, PNG</p>
                </div>
              </div>
            </div>
            
            {/* Address Section */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address*</label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={form.address.street}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City*</label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    value={form.address.city}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State*</label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    value={form.address.state}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP/Postal Code*</label>
                  <input
                    type="text"
                    id="zip"
                    name="address.zip"
                    value={form.address.zip}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.zip ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="6-digit code"
                  />
                  {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
                  <p className="mt-1 text-xs text-gray-500">Enter a valid 6-digit postal code</p>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="address.country"
                    value={form.address.country}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            {/* ID Verification Section */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">ID Verification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idType" className="block text-sm font-medium text-gray-700">ID Type*</label>
                  <select
                    id="idType"
                    name="validID.type"
                    value={form.validID.type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {form.validID.type === 'Aadhar Card' && 'Format: 12 digits (e.g., 123456789012)'}
                    {form.validID.type === 'PAN Card' && 'Format: ABCDE1234F'}
                    {form.validID.type === 'Passport' && 'Format: A1234567'}
                    {form.validID.type === 'Driving License' && 'Format: XX-XX-YYYYNNNNNNN'}
                    {form.validID.type === 'Voter ID' && 'Format: ABC1234567'}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number*</label>
                  <input
                    type="text"
                    id="idNumber"
                    name="validID.number"
                    value={form.validID.number}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${errors.validIDNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={
                      form.validID.type === 'Aadhar Card' ? '123456789012' :
                      form.validID.type === 'PAN Card' ? 'ABCDE1234F' :
                      form.validID.type === 'Passport' ? 'A1234567' :
                      form.validID.type === 'Driving License' ? 'DL-01-20200123456' :
                      'ABC1234567'
                    }
                  />
                  {errors.validIDNumber && <p className="mt-1 text-sm text-red-600">{errors.validIDNumber}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="documentImage" className="block text-sm font-medium text-gray-700">ID Document Image*</label>
                  <input
                    type="file"
                    id="documentImage"
                    name="documentImage"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors.documentImage ? 'border-red-500' : ''}`}
                  />
                  {errors.documentImage && <p className="mt-1 text-sm text-red-600">{errors.documentImage}</p>}
                  <p className="mt-1 text-xs text-gray-500">Upload a clear image of your ID document. Max file size: 5MB. Allowed formats: JPG, JPEG, PNG</p>
                </div>
              </div>
            </div>
            
            {/* Disclaimer Section */}
            <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-700">
              <p className="flex items-start">
                <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <span>
                  By submitting this form, you confirm that all information provided is accurate and complete. Fields marked with an asterisk (*) are required. Your ID document will be used for verification purposes only and handled according to our privacy policy.
                </span>
              </p>
            </div>
            
            {/* Submit Button */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Submit Verification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}