import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, ArrowRight, CreditCard, User, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Hero section carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  
  // Hero slide data with different locations and buses
  const heroSlides = [
    {
      id: 1,
      image: "https://wallpapercave.com/wp/wp2120656.jpg",
      location: "New York City",
      description: "Experience the iconic skyline while traveling in comfort",
    },
    {
      id: 2,
      image: "https://th.bing.com/th/id/OIP.LMaBBDBbDT4TuilfWl_1ZwHaEK?pid=ImgDet&w=474&h=266&rs=1",
      location: "Grand Canyon",
      description: "Journey through America's natural wonder on premium coaches",
    },
    {
      id: 3,
      image: "https://th.bing.com/th/id/OIP.Noj6vYBfw4X1pBQT-lSW7gHaE8?w=4096&h=2731&rs=1&pid=ImgDetMain",
      location: "Miami Beach",
      description: "Coastal routes with panoramic ocean views",
    },
    {
      id: 4,
      image: "https://th.bing.com/th/id/OIP.xp_HBZRmiICT_tGTD8aQ9AHaE7?w=740&h=493&rs=1&pid=ImgDetMain",
      location: "Rocky Mountains",
      description: "Scenic mountain passes with luxury travel experience",
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1, 
      name: "Sarah Johnson",
      comment: "BusGo made my cross-country trip so much easier. The booking process was seamless!",
      rating: 5
    },
    {
      id: 2, 
      name: "Michael Chen",
      comment: "Great prices and excellent service. Will definitely use again for my next journey.",
      rating: 4
    },
    {
      id: 3, 
      name: "Emma Rodriguez",
      comment: "The app is intuitive and customer support helped me when I needed to reschedule.",
      rating: 5
    }
  ];

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await fetch('/api/buses');
        if (!response.ok) {
          throw new Error('Failed to fetch buses');
        }
        const data = await response.json();
        
        // Process the data to create popular routes
        const processedRoutes = data.map(bus => ({
          id: bus._id || bus.id,
          from: bus.route?.from || bus.from,
          to: bus.route?.to || bus.to,
          price: bus.price,
          duration: calculateDuration(bus.departureTime, bus.arrivalTime),
          image: bus.image,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime
        }));
        
        setPopularRoutes(processedRoutes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching popular routes:", error);
        setLoading(false);
      }
    };

    fetchPopularRoutes();
    
    // Set up automatic slider for hero section
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Helper function to calculate duration between two times
  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);
    const diff = arrTime - depTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create URL parameters
    const params = new URLSearchParams();
    params.set('from', searchData.from);
    params.set('to', searchData.to);
    params.set('date', searchData.date);
    
    // Navigate to routes page with search parameters
    navigate(`/busses?${params.toString()}`, { 
      state: { searchData } 
    });
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };
  
  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section with Dynamic Background Images */}
      <div className="relative h-screen max-h-screen-lg overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={slide.image} 
                alt={`Bus journey to ${slide.location}`} 
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <div className="absolute inset-x-0 bottom-10 flex justify-center space-x-4">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Prev/Next Buttons */}
          <button 
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl leading-tight">
              {heroSlides[currentSlide].location}
            </h1>
            <p className="mt-4 text-xl text-white/90">
              {heroSlides[currentSlide].description}
            </p>
            <p className="mt-6 text-2xl font-semibold text-white">
              Travel Made Easy with BusGo
            </p>
          </div>
          
          {/* Search Box */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow-2xl max-w-4xl backdrop-blur-md">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition">
                    <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      name="from"
                      value={searchData.from}
                      onChange={handleSearchChange}
                      className="block w-full px-3 py-3 focus:outline-none"
                      placeholder="Departure city"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition">
                    <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      name="to"
                      value={searchData.to}
                      onChange={handleSearchChange}
                      className="block w-full px-3 py-3 focus:outline-none"
                      placeholder="Arrival city"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition">
                    <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                    <input
                      type="date"
                      name="date"
                      value={searchData.date}
                      onChange={handleSearchChange}
                      className="block w-full px-3 py-3 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition shadow-lg hover:shadow-xl"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Popular Routes</h2>
            <div className="mt-3 max-w-2xl mx-auto">
              <p className="text-xl text-gray-500">
                Book tickets for these popular destinations at the best prices
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {popularRoutes.map((route) => (
                <div key={route.id} className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={route.image} 
                      alt={`${route.from} to ${route.to} route`}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{route.from}</div>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <div className="w-16 h-px bg-gray-300 mx-2"></div>
                        <ArrowRight className="h-5 w-5" />
                        <div className="w-16 h-px bg-gray-300 mx-2"></div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{route.to}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {route.duration}
                      </div>
                      <div className="text-2xl font-bold text-green-600">${route.price}</div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('from', route.from);
                        params.set('to', route.to);
                        params.set('date', searchData.date);
                        navigate(`/busses?${params.toString()}`);
                      }}
                      className="mt-6 w-full bg-blue-600 text-white rounded-lg py-3 px-4 text-sm font-medium hover:bg-blue-700 transition shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/busses')}
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              View All Busses
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              Trusted by thousands of travelers across the country
            </p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose BusGo</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              The most trusted bus ticket booking platform
            </p>
          </div>
          
          <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="flex justify-center">
                <div className="bg-blue-100 rounded-full p-4">
                  <CreditCard className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">Secure Payments</h3>
              <p className="mt-4 text-gray-600 text-center">
                Multiple secure payment options for hassle-free transactions. We support credit cards, PayPal, and mobile wallets.
              </p>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="flex justify-center">
                <div className="bg-blue-100 rounded-full p-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">Customer Support</h3>
              <p className="mt-4 text-gray-600 text-center">
                24/7 dedicated customer support for all your queries. Our team is always ready to assist you.
              </p>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="flex justify-center">
                <div className="bg-blue-100 rounded-full p-4">
                  <Check className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">Easy Cancellation</h3>
              <p className="mt-4 text-gray-600 text-center">
                Simple and transparent cancellation and refund policies. Change plans with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>

    
      
      {/* Call to Action */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your journey?</span>
            <span className="block text-blue-200">Download our app today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                App Store
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900">
                Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}