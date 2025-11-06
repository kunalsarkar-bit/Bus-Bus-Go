import React, { useState, useEffect } from 'react';
import { Plus, Bus, Users, TrendingUp, Calendar, Clock, MapPin, Settings, Bell, User, BarChart3 } from 'lucide-react';

const BusDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [buses, setBuses] = useState([
    {
      id: 1,
      busNumber: "MH01-AB-1234",
      operator: "RedBus Travels",
      from: "Mumbai",
      to: "Pune",
      departureTime: "08:30",
      arrivalTime: "12:30",
      price: 450,
      isAC: true
    },
    {
      id: 2,
      busNumber: "KA02-CD-5678",
      operator: "BlueLine Express",
      from: "Bangalore",
      to: "Chennai",
      departureTime: "10:00",
      arrivalTime: "17:30",
      price: 380,
      isAC: false
    }
  ]);
  
  const [stats, setStats] = useState({
    totalBuses: 12,
    todayBookings: 48,
    revenue: 24500,
    occupancy: 78
  });
  
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [formData, setFormData] = useState({
    busNumber: '',
    operator: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    isAC: '',
    image: null
  });

  // Add user profile state
  const [userProfile, setUserProfile] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBus = {
      id: buses.length + 1,
      ...formData,
      price: parseInt(formData.price),
      isAC: formData.isAC === 'true'
    };
    
    setBuses(prev => [...prev, newBus]);
    setStats(prev => ({ ...prev, totalBuses: prev.totalBuses + 1 }));
    setFormData({
      busNumber: '',
      operator: '',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      isAC: '',
      image: null
    });
    showNotification('Bus added successfully!');
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Add the fetchUserProfile function
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
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to load user profile');
      showNotification(error.message || 'Failed to load user profile');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          todayBookings: prev.todayBookings + 1,
          revenue: prev.revenue + Math.floor(Math.random() * 500) + 200
        }));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, number, label, color = "from-blue-500 to-purple-600" }) => (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-8 h-8 text-white/80" />
          <div className="text-3xl font-bold">{number}</div>
        </div>
        <p className="text-white/90 text-sm font-medium">{label}</p>
      </div>
    </div>
  );

  const BusCard = ({ bus }) => (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-blue-600 group-hover:text-blue-700 transition-colors">
            {bus.busNumber}
          </h3>
          <p className="text-gray-600 text-sm">{bus.operator}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold">
          ₹{bus.price}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2 text-gray-700">
        <MapPin className="w-4 h-4" />
        <span>{bus.from} → {bus.to}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Dep: {formatTime(bus.departureTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Arr: {formatTime(bus.arrivalTime)}</span>
        </div>
      </div>
      {bus.isAC && (
        <div className="mt-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            AC
          </span>
        </div>
      )}
    </div>
  );

  const FormInput = ({ label, name, type = "text", required = true, options = null, accept = null }) => (
    <div className="relative">
      <label className="absolute -top-2 left-3 bg-white px-2 text-sm font-medium text-blue-600 z-10">
        {label}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          required={required}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white hover:border-blue-300"
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === 'file' ? (
        <div className="relative">
          <input
            type="file"
            name={name}
            onChange={handleInputChange}
            required={required}
            accept={accept}
            className="hidden"
            id={name}
          />
          <label
            htmlFor={name}
            className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-all duration-300 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center justify-center gap-2 text-blue-600 font-medium"
          >
            <Plus className="w-5 h-5" />
            {formData[name] ? formData[name].name : `Upload ${label}`}
          </label>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          required={required}
          placeholder={type === 'number' ? '450' : `Enter ${label.toLowerCase()}`}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-blue-300"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Notification */}
      <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${
        notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg">
          {notification.message}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BusGo
              </h1>
            </div>
            
            <nav className="flex gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'buses', label: 'Manage Buses', icon: Bus },
                { id: 'bookings', label: 'Bookings', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeSection === id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20">
              {/* Dashboard Section */}
              {activeSection === 'dashboard' && (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      Dashboard Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                      <StatCard icon={Bus} number={stats.totalBuses} label="Total Buses" />
                      <StatCard icon={Users} number={stats.todayBookings} label="Today's Bookings" color="from-emerald-500 to-teal-600" />
                      <StatCard icon={TrendingUp} number={`₹${stats.revenue.toLocaleString()}`} label="Today's Revenue" color="from-orange-500 to-red-600" />
                      <StatCard icon={BarChart3} number={`${stats.occupancy}%`} label="Avg Occupancy" color="from-purple-500 to-pink-600" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Buses</h3>
                    <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                      {buses.slice(-3).map(bus => (
                        <BusCard key={bus.id} bus={bus} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Buses Section */}
              {activeSection === 'buses' && (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <Plus className="w-6 h-6 text-blue-600" />
                      Add New Bus
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <FormInput label="Bus Number" name="busNumber" />
                      <FormInput label="Operator" name="operator" />
                      <FormInput label="From" name="from" />
                      <FormInput label="To" name="to" />
                      <FormInput label="Departure Time" name="departureTime" type="time" />
                      <FormInput label="Arrival Time" name="arrivalTime" type="time" />
                      <FormInput label="Price (₹)" name="price" type="number" />
                      <FormInput 
                        label="Bus Type" 
                        name="isAC" 
                        type="select"
                        options={[
                          { value: 'true', label: 'AC' },
                          { value: 'false', label: 'Non-AC' }
                        ]}
                      />
                      <div className="md:col-span-2">
                        <FormInput label="Bus Image" name="image" type="file" accept="image/*" />
                      </div>
                      
                      <button
                        type="submit"
                        className="md:col-span-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Bus
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">All Buses ({buses.length})</h3>
                    <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                      {buses.map(bus => (
                        <BusCard key={bus.id} bus={bus} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Section */}
              {activeSection === 'bookings' && (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Recent Bookings
                  </h2>
                  
                  <div className="grid gap-4">
                    {[
                      { id: 'BK001', passenger: 'John Doe', seat: '12A', route: 'Mumbai → Pune', price: 450, time: 'Today 08:30 AM' },
                      { id: 'BK002', passenger: 'Jane Smith', seat: '15B', route: 'Bangalore → Chennai', price: 380, time: 'Today 10:00 AM' },
                      { id: 'BK003', passenger: 'Mike Johnson', seat: '8C', route: 'Delhi → Jaipur', price: 320, time: 'Today 02:15 PM' }
                    ].map(booking => (
                      <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-green-600">Booking #{booking.id}</h3>
                            <p className="text-gray-600">{booking.passenger} - Seat {booking.seat}</p>
                          </div>
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold">
                            ₹{booking.price}
                          </div>
                        </div>
                        <div className="text-gray-700 mb-1">{booking.route}</div>
                        <div className="text-sm text-gray-600">{booking.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Profile Sidebar */}
          <aside className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 sticky top-6">
              {/* Profile Avatar */}
             <div className="text-center mb-6">
  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 relative overflow-hidden">
    {userProfile?.profileImage?.secure_url ? (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div>
        <img 
          src={userProfile.profileImage.secure_url} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full relative z-10"
        />
      </>
    ) : (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div>
        <span className="relative z-10">
          {userProfile ? userProfile.name.charAt(0).toUpperCase() : 'A'}
        </span>
      </>
    )}
  </div>
  <h3 className="text-xl font-bold text-gray-800">
    {userProfile ? userProfile.name : fetchLoading ? 'Loading...' : 'User'}
  </h3>
  <p className="text-gray-600 text-sm">
    {userProfile ? userProfile.role : fetchLoading ? 'Loading...' : 'User'}
  </p>
  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
</div>
              {/* Profile Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{buses.length}</div>
                  <div className="text-xs text-gray-600">Total Buses</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">2.4k</div>
                  <div className="text-xs text-gray-600">Bookings</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
                {[
                  { icon: Plus, label: 'Quick Add Bus', primary: true },
                  { icon: BarChart3, label: 'View Reports' },
                  { icon: Settings, label: 'Settings' },
                  { icon: Bell, label: 'Notifications' },
                  { icon: User, label: 'Edit Profile' }
                ].map(({ icon: Icon, label, primary }, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                      primary
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BusDashboard;