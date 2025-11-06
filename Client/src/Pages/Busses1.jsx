import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Clock, CreditCard, Coffee, Wifi, ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';

export default function Busses() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [busRoutes, setBusRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState({
    morning: true,
    afternoon: true,
    evening: true,
    night: true
  });
  const [amenitiesFilter, setAmenitiesFilter] = useState({
    wifi: false,
    power: false,
    food: false,
    extraLegroom: false
  });
  const [busTypeFilter, setBusTypeFilter] = useState({
    express: true,
    luxury: true,
    standard: true
  });
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [sortOption, setSortOption] = useState('price');

  useEffect(() => {
    // Get search params from URL or state
    const params = new URLSearchParams(location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    const dateParam = params.get('date');
    
    if (fromParam && toParam) {
      setSearchParams({
        from: fromParam,
        to: toParam,
        date: dateParam || new Date().toISOString().split('T')[0]
      });
    } else if (location.state?.searchData) {
      setSearchParams(location.state.searchData);
    }

    // Fetch bus routes
    fetchBusRoutes();
  }, [location]);

  const fetchBusRoutes = async () => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const dummyRoutes = generateDummyRoutes();
      setBusRoutes(dummyRoutes);
      setFilteredRoutes(dummyRoutes);
      setLoading(false);
    }, 1200);
  };

  // Generate dummy routes for demo purposes
  const generateDummyRoutes = () => {
    const routes = [];
    const cities = ['New York', 'Boston', 'Chicago', 'Detroit', 'Los Angeles', 'San Francisco', 'Miami', 'Orlando', 'Seattle', 'Portland', 'Denver', 'Salt Lake City', 'Washington DC', 'Philadelphia'];
    const busCompanies = ['GreyDog', 'AmeriExpress', 'CoastLiner', 'MountainView', 'SkyBus', 'RapidTransit'];
    const busTypes = ['express', 'luxury', 'standard'];
    
    const { from, to } = searchParams;
    const fromCity = from || cities[Math.floor(Math.random() * cities.length)];
    const toCity = to || cities[Math.floor(Math.random() * cities.length)];
    
    for (let i = 1; i <= 20; i++) {
      // Generate random amenities
      const amenities = {
        wifi: Math.random() > 0.3,
        power: Math.random() > 0.4,
        food: Math.random() > 0.7,
        extraLegroom: Math.random() > 0.6
      };
      
      // Generate random departure time
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Calculate arrival time (departure + duration)
      const durationMinutes = 180 + Math.floor(Math.random() * 300); // 3-8 hours
      const arrivalHour = (hour + Math.floor(durationMinutes / 60)) % 24;
      const arrivalMinute = (minute + durationMinutes % 60) % 60;
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
      
      // Choose a bus company
      const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
      
      // Determine bus type
      const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      
      // Calculate price based on bus type
      let basePrice = 30 + Math.floor(Math.random() * 50);
      if (busType === 'luxury') basePrice += 20;
      if (busType === 'express') basePrice += 10;
      
      routes.push({
        id: i,
        from: fromCity,
        to: toCity,
        date: searchParams.date || new Date().toISOString().split('T')[0],
        departureTime,
        arrivalTime,
        duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
        price: basePrice,
        company,
        busType,
        amenities,
        seats: 10 + Math.floor(Math.random() * 30),
        image: `/api/placeholder/100/60`
      });
    }
    
    return routes;
  };

  // Update search parameters
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply search
  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    params.set('from', searchParams.from);
    params.set('to', searchParams.to);
    params.set('date', searchParams.date);
    navigate(`/busses?${params.toString()}`);
    
    // Refetch bus routes
    fetchBusRoutes();
  };

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...busRoutes];
    
    // Price filter
    filtered = filtered.filter(route => 
      route.price >= priceRange[0] && route.price <= priceRange[1]
    );
    
    // Departure time filter
    filtered = filtered.filter(route => {
      const hour = parseInt(route.departureTime.split(':')[0]);
      if (hour >= 5 && hour < 12 && !departureTimeFilter.morning) return false;
      if (hour >= 12 && hour < 17 && !departureTimeFilter.afternoon) return false;
      if (hour >= 17 && hour < 21 && !departureTimeFilter.evening) return false;
      if ((hour >= 21 || hour < 5) && !departureTimeFilter.night) return false;
      return true;
    });
    
    // Bus type filter
    filtered = filtered.filter(route => 
      (route.busType === 'express' && busTypeFilter.express) ||
      (route.busType === 'luxury' && busTypeFilter.luxury) ||
      (route.busType === 'standard' && busTypeFilter.standard)
    );
    
    // Amenities filter
    if (amenitiesFilter.wifi) {
      filtered = filtered.filter(route => route.amenities.wifi);
    }
    if (amenitiesFilter.power) {
      filtered = filtered.filter(route => route.amenities.power);
    }
    if (amenitiesFilter.food) {
      filtered = filtered.filter(route => route.amenities.food);
    }
    if (amenitiesFilter.extraLegroom) {
      filtered = filtered.filter(route => route.amenities.extraLegroom);
    }
    
    // Sort results
    sortRoutes(filtered);
  };
  
  // Sort routes based on selected option
  const sortRoutes = (routes = filteredRoutes) => {
    let sorted = [...routes];
    
    switch(sortOption) {
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', '').trim());
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', '').trim());
          return durationA - durationB;
        });
        break;
      case 'departure':
        sorted.sort((a, b) => {
          const timeA = a.departureTime.split(':').map(Number);
          const timeB = b.departureTime.split(':').map(Number);
          return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        });
        break;
      case 'arrival':
        sorted.sort((a, b) => {
          const timeA = a.arrivalTime.split(':').map(Number);
          const timeB = b.arrivalTime.split(':').map(Number);
          return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        });
        break;
      default:
        break;
    }
    
    setFilteredRoutes(sorted);
  };
  
  // Update filters and apply them
  useEffect(() => {
    if (!loading && busRoutes.length > 0) {
      applyFilters();
    }
  }, [priceRange, departureTimeFilter, busTypeFilter, amenitiesFilter, sortOption]);

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };
  
  // Toggle departure time filter
  const toggleDepartureTime = (timeOfDay) => {
    setDepartureTimeFilter(prev => ({
      ...prev,
      [timeOfDay]: !prev[timeOfDay]
    }));
  };
  
  // Toggle amenities filter
  const toggleAmenity = (amenity) => {
    setAmenitiesFilter(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };
  
  // Toggle bus type filter
  const toggleBusType = (type) => {
    setBusTypeFilter(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Time period classification helper
  const getTimePeriod = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };
  
  // Format time to 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 200]);
    setDepartureTimeFilter({
      morning: true,
      afternoon: true,
      evening: true,
      night: true
    });
    setAmenitiesFilter({
      wifi: false,
      power: false,
      food: false,
      extraLegroom: false
    });
    setBusTypeFilter({
      express: true,
      luxury: true,
      standard: true
    });
    setSortOption('price');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-blue-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600">
                  <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    name="from"
                    value={searchParams.from}
                    onChange={handleSearchChange}
                    className="block w-full px-3 py-2 focus:outline-none"
                    placeholder="From"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600">
                  <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    name="to"
                    value={searchParams.to}
                    onChange={handleSearchChange}
                    className="block w-full px-3 py-2 focus:outline-none"
                    placeholder="To"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600">
                  <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleSearchChange}
                    className="block w-full px-3 py-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition shadow"
                >
                  Search Buses
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              
              <div className={`${isFilterOpen ? 'block' : 'hidden lg:block'} space-y-8`}>
                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">${priceRange[0]}</span>
                      <span className="text-sm text-gray-600">${priceRange[1]}</span>
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Departure Time Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Departure Time
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={departureTimeFilter.morning}
                        onChange={() => toggleDepartureTime('morning')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Morning (5:00 AM - 11:59 AM)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={departureTimeFilter.afternoon}
                        onChange={() => toggleDepartureTime('afternoon')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Afternoon (12:00 PM - 4:59 PM)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={departureTimeFilter.evening}
                        onChange={() => toggleDepartureTime('evening')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Evening (5:00 PM - 8:59 PM)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={departureTimeFilter.night}
                        onChange={() => toggleDepartureTime('night')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Night (9:00 PM - 4:59 AM)</span>
                    </label>
                  </div>
                </div>
                
                {/* Bus Type Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Bus Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={busTypeFilter.express}
                        onChange={() => toggleBusType('express')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Express</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={busTypeFilter.luxury}
                        onChange={() => toggleBusType('luxury')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Luxury</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={busTypeFilter.standard}
                        onChange={() => toggleBusType('standard')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Standard</span>
                    </label>
                  </div>
                </div>
                
                {/* Amenities Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-blue-600" />
                    Amenities
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={amenitiesFilter.wifi}
                        onChange={() => toggleAmenity('wifi')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">WiFi</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={amenitiesFilter.power}
                        onChange={() => toggleAmenity('power')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Power Outlets</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={amenitiesFilter.food}
                        onChange={() => toggleAmenity('food')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Food Service</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={amenitiesFilter.extraLegroom}
                        onChange={() => toggleAmenity('extraLegroom')}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Extra Legroom</span>
                    </label>
                  </div>
                </div>
                
                {/* Reset Filters button */}
                <div className="pt-4">
                  <button
                    onClick={resetFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {searchParams.from && searchParams.to ? `${searchParams.from} to ${searchParams.to}` : 'Available Routes'}
                  <span className="text-sm font-medium text-gray-500 ml-2">
                    ({filteredRoutes.length} {filteredRoutes.length === 1 ? 'bus' : 'buses'} found)
                  </span>
                </h2>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="price">Price</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                    <option value="arrival">Arrival Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bus Routes List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredRoutes.length > 0 ? (
              <div className="space-y-4">
                {filteredRoutes.map((route) => (
                  <div key={route.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Bus Company and Image */}
                        <div className="sm:w-1/4 mb-4 sm:mb-0 sm:pr-4">
                          <div className="mb-2 text-lg font-bold text-gray-900">{route.company}</div>
                          <div className="text-sm text-blue-600 font-medium capitalize mb-2">{route.busType} Bus</div>
                          <div className="bg-gray-100 rounded-md p-1 w-fit mb-2">
                            <span className="text-xs text-gray-600">
                              {route.seats} seats left
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {route.amenities.wifi && (
                              <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                                <Wifi className="h-3 w-3 mr-1" />
                                WiFi
                              </div>
                            )}
                            {route.amenities.power && (
                              <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center">
                                Power
                              </div>
                            )}
                            {route.amenities.food && (
                              <div className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded flex items-center">
                                Food
                              </div>
                            )}
                            {route.amenities.extraLegroom && (
                              <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded flex items-center">
                                Extra Space
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Journey Details */}
                        <div className="sm:w-2/4 mb-4 sm:mb-0">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{formatTime(route.departureTime)}</div>
                              <div className="text-sm text-gray-500">{route.from}</div>
                              <div className="text-xs text-blue-600">{getTimePeriod(route.departureTime)}</div>
                            </div>
                            
                            <div className="flex flex-col items-center px-4">
                              <div className="text-sm text-gray-500 whitespace-nowrap mb-1">{route.duration}</div>
                              <div className="w-20 sm:w-32 h-px bg-gray-300 relative">
                                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">{route.date}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{formatTime(route.arrivalTime)}</div>
                              <div className="text-sm text-gray-500">{route.to}</div>
                              <div className="text-xs text-blue-600">{getTimePeriod(route.arrivalTime)}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price and Book Button */}
                        <div className="sm:w-1/4 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-4">
                          <div className="text-3xl font-bold text-green-600 mb-2">${route.price}</div>
                          <button 
                            onClick={() => navigate(`/busbooking?routeId=${route.id}`, { state: { route } })}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition text-sm sm:text-base"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No buses found</h3>
                <p className="text-gray-600 mb-6">No buses match your current filters. Try adjusting your search criteria or filters.</p>
                <button 
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
            
            {/* Pagination - Optional */}
            {filteredRoutes.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-md bg-blue-600 text-white font-medium">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    10
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}