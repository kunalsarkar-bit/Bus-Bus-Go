import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Clock, CreditCard, MapPin, Calendar, Wifi } from 'lucide-react';

export default function Busses() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Simplified filters
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [acFilter, setAcFilter] = useState('all'); // 'all', 'ac', 'non-ac'
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    // Get search params from URL
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    const to = params.get('to');
    const date = params.get('date');
    
    if (from && to) {
      setSearchParams({ from, to, date: date || new Date().toISOString().split('T')[0] });
    }
    
    fetchBuses();
  }, [location]);

  // Fetch buses from API
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/buses');
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match frontend expectations
        const formattedBuses = data.map(bus => ({
          id: bus.id,
          busNumber: bus.busNumber,
          operator: bus.operator,
          from: bus.from,
          to: bus.to,
          departureTime: formatTime(bus.departureTime),
          arrivalTime: formatTime(bus.arrivalTime),
          duration: calculateDuration(bus.departureTime, bus.arrivalTime),
          isAC: bus.isAC,
          image: bus.image,
          price: bus.price,
          date: searchParams.date
        }));
        
        setBuses(formattedBuses);
        setFilteredBuses(formattedBuses);
      } else {
        console.error('Failed to fetch buses');
        // Fallback to dummy data for demo
        const dummyBuses = generateDummyBuses();
        setBuses(dummyBuses);
        setFilteredBuses(dummyBuses);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      // Fallback to dummy data for demo
      const dummyBuses = generateDummyBuses();
      setBuses(dummyBuses);
      setFilteredBuses(dummyBuses);
    }
    setLoading(false);
  };

  // Generate dummy data for demo purposes
  const generateDummyBuses = () => {
    const operators = ['GreyDog Express', 'National Travels', 'City Connect', 'Highway Express', 'Metro Bus'];
    const routes = [
      { from: 'New York', to: 'Boston' },
      { from: 'Chicago', to: 'Detroit' },
      { from: 'Los Angeles', to: 'San Francisco' },
      { from: 'Miami', to: 'Orlando' },
      { from: 'Seattle', to: 'Portland' }
    ];
    
    return Array.from({ length: 15 }, (_, i) => {
      const route = routes[Math.floor(Math.random() * routes.length)];
      const depHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
      const depMinute = Math.floor(Math.random() * 60);
      const duration = 180 + Math.floor(Math.random() * 300); // 3-8 hours
      const arrHour = (depHour + Math.floor(duration / 60)) % 24;
      const arrMinute = (depMinute + duration % 60) % 60;
      
      const departureTime = `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`;
      const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMinute.toString().padStart(2, '0')}`;
      
      return {
        id: `bus-${i + 1}`,
        busNumber: `BUS${(1000 + i).toString()}`,
        operator: operators[Math.floor(Math.random() * operators.length)],
        from: searchParams.from || route.from,
        to: searchParams.to || route.to,
        departureTime,
        arrivalTime,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        isAC: Math.random() > 0.3,
        image: '/api/placeholder/100/60',
        price: 50 + Math.floor(Math.random() * 150),
        date: searchParams.date
      };
    });
  };

  // Utility functions
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDisplayTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...buses];
    
    // Price filter
    filtered = filtered.filter(bus => 
      bus.price >= priceRange[0] && bus.price <= priceRange[1]
    );
    
    // AC filter
    if (acFilter === 'ac') {
      filtered = filtered.filter(bus => bus.isAC);
    } else if (acFilter === 'non-ac') {
      filtered = filtered.filter(bus => !bus.isAC);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price':
          return a.price - b.price;
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'duration':
          const durationA = parseInt(a.duration) * 60 + parseInt(a.duration.split('h')[1]);
          const durationB = parseInt(b.duration) * 60 + parseInt(b.duration.split('h')[1]);
          return durationA - durationB;
        default:
          return 0;
      }
    });
    
    setFilteredBuses(filtered);
  }, [buses, priceRange, acFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('from', searchParams.from);
    params.set('to', searchParams.to);
    params.set('date', searchParams.date);
    navigate(`/busses?${params.toString()}`);
    fetchBuses();
  };

  const resetFilters = () => {
    setPriceRange([0, 500]);
    setAcFilter('all');
    setSortBy('price');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-blue-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 focus:outline-none"
                  placeholder="From"
                  required
                />
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 focus:outline-none"
                  placeholder="To"
                  required
                />
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 focus:outline-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Simplified Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-4 space-y-6">
              <h2 className="text-lg font-bold">Filters</h2>
              
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Price Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* AC Filter */}
              <div>
                <h3 className="font-medium mb-2">Bus Type</h3>
                <select
                  value={acFilter}
                  onChange={(e) => setAcFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="all">All Buses</option>
                  <option value="ac">AC Only</option>
                  <option value="non-ac">Non-AC Only</option>
                </select>
              </div>
              
              <button
                onClick={resetFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {searchParams.from && searchParams.to 
                  ? `${searchParams.from} to ${searchParams.to}` 
                  : 'Available Buses'
                }
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredBuses.length} found)
                </span>
              </h2>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded p-2"
              >
                <option value="price">Sort by Price</option>
                <option value="departure">Sort by Departure</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>

            {/* Bus List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredBuses.length > 0 ? (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <div key={bus.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      {/* Bus Info */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{bus.operator}</h3>
                          <div className="flex items-center space-x-2">
                            {bus.isAC && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                AC
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          Bus #{bus.busNumber}
                        </div>
                        
                        {/* Journey Timeline */}
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-xl font-bold">{formatDisplayTime(bus.departureTime)}</div>
                            <div className="text-sm text-gray-600">{bus.from}</div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500">{bus.duration}</div>
                            <div className="w-16 h-px bg-gray-300 my-1"></div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-xl font-bold">{formatDisplayTime(bus.arrivalTime)}</div>
                            <div className="text-sm text-gray-600">{bus.to}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price and Book */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          ${bus.price}
                        </div>
                        <button 
                          onClick={() => navigate(`/booking/${bus.id}`, { state: { bus } })}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No buses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button 
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}