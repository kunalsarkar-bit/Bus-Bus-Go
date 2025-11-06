import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Navigation, Luggage } from 'lucide-react';

const MyBusBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  // Demo bus booking data
  const demoBusBookings = [
    {
      id: 'BUS001',
      busOperator: 'RedBus Express',
      busNumber: 'RB-1205',
      busType: 'AC Sleeper',
      route: 'Delhi → Mumbai',
      departure: '2025-06-20',
      departureTime: '22:30',
      arrival: '2025-06-21',
      arrivalTime: '14:45',
      duration: '16h 15m',
      seatNumbers: ['S1', 'S2'],
      passengers: 2,
      status: 'confirmed',
      amount: 2400,
      boardingPoint: 'ISBT Kashmiri Gate',
      droppingPoint: 'Borivali Bus Station',
      contact: '+91 98765 43210'
    },
    {
      id: 'BUS002',
      busOperator: 'Volvo Travels',
      busNumber: 'VT-3401',
      busType: 'Multi-Axle AC',
      route: 'Bangalore → Chennai',
      departure: '2025-06-25',
      departureTime: '23:00',
      arrival: '2025-06-26',
      arrivalTime: '06:30',
      duration: '7h 30m',
      seatNumbers: ['12A'],
      passengers: 1,
      status: 'pending',
      amount: 800,
      boardingPoint: 'Majestic Bus Stand',
      droppingPoint: 'CMBT Chennai',
      contact: '+91 80123 45678'
    },
    {
      id: 'BUS003',
      busOperator: 'Orange Travels',
      busNumber: 'OT-2108',
      busType: 'AC Seater',
      route: 'Pune → Goa',
      departure: '2025-06-28',
      departureTime: '08:00',
      arrival: '2025-06-28',
      arrivalTime: '18:30',
      duration: '10h 30m',
      seatNumbers: ['15B', '15C'],
      passengers: 2,
      status: 'confirmed',
      amount: 1600,
      boardingPoint: 'Swargate Bus Station',
      droppingPoint: 'Panaji Bus Stand',
      contact: '+91 98234 56789'
    },
    {
      id: 'BUS004',
      busOperator: 'SRS Travels',
      busNumber: 'SRS-5612',
      busType: 'Non-AC Sleeper',
      route: 'Hyderabad → Tirupati',
      departure: '2025-07-02',
      departureTime: '21:00',
      arrival: '2025-07-03',
      arrivalTime: '06:00',
      duration: '9h 00m',
      seatNumbers: ['L4'],
      passengers: 1,
      status: 'confirmed',
      amount: 650,
      boardingPoint: 'Jubilee Bus Station',
      droppingPoint: 'Tirupati Bus Stand',
      contact: '+91 97123 45678'
    },
    {
      id: 'BUS005',
      busOperator: 'Parveen Travels',
      busNumber: 'PT-8901',
      busType: 'AC Sleeper',
      route: 'Kolkata → Bhubaneswar',
      departure: '2025-07-10',
      departureTime: '20:30',
      arrival: '2025-07-11',
      arrivalTime: '06:45',
      duration: '10h 15m',
      seatNumbers: ['U8', 'U9'],
      passengers: 2,
      status: 'cancelled',
      amount: 1800,
      boardingPoint: 'Esplanade Bus Terminal',
      droppingPoint: 'Master Canteen Square',
      contact: '+91 98345 67890'
    },
    {
      id: 'BUS006',
      busOperator: 'KPN Travels',
      busNumber: 'KPN-4523',
      busType: 'Luxury AC',
      route: 'Chennai → Coimbatore',
      departure: '2025-07-15',
      departureTime: '22:15',
      arrival: '2025-07-16',
      arrivalTime: '06:00',
      duration: '7h 45m',
      seatNumbers: ['9A'],
      passengers: 1,
      status: 'pending',
      amount: 950,
      boardingPoint: 'CMBT Chennai',
      droppingPoint: 'Gandhipuram Bus Stand',
      contact: '+91 94567 89012'
    },
    {
      id: 'BUS007',
      busOperator: 'Raj Express',
      busNumber: 'RX-7834',
      busType: 'AC Seater',
      route: 'Jaipur → Udaipur',
      departure: '2025-07-20',
      departureTime: '07:00',
      arrival: '2025-07-20',
      arrivalTime: '15:30',
      duration: '8h 30m',
      seatNumbers: ['22A', '22B', '23A'],
      passengers: 3,
      status: 'confirmed',
      amount: 2250,
      boardingPoint: 'Sindhi Camp Bus Stand',
      droppingPoint: 'Udaipur City Bus Stand',
      contact: '+91 99876 54321'
    },
    {
      id: 'BUS008',
      busOperator: 'Shatabdi Travels',
      busNumber: 'ST-9102',
      busType: 'Multi-Axle AC',
      route: 'Ahmedabad → Surat',
      departure: '2025-08-05',
      departureTime: '16:30',
      arrival: '2025-08-05',
      arrivalTime: '21:15',
      duration: '4h 45m',
      seatNumbers: ['18C'],
      passengers: 1,
      status: 'confirmed',
      amount: 450,
      boardingPoint: 'Geeta Mandir Bus Stand',
      droppingPoint: 'Surat Central Bus Station',
      contact: '+91 98123 45670'
    }
  ];

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize bookings only when component mounts (page load)
  useEffect(() => {
    setBookings(shuffleArray(demoBusBookings));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBusTypeColor = (busType) => {
    if (busType.includes('AC')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                My Bus Bookings
              </h1>
              <p className="text-gray-600 mt-2">Track and manage all your bus ticket reservations</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">📋 {bookings.length} bookings found</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <User className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Luggage className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{booking.busOperator}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBusTypeColor(booking.busType)}`}>
                        {booking.busType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Bus: {booking.busNumber}</span>
                      <span>•</span>
                      <span>Booking ID: {booking.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{booking.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Route Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Departure */}
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="font-semibold text-gray-900">{booking.route.split(' → ')[0]}</p>
                      <p className="text-sm text-gray-600">{formatDate(booking.departure)} • {formatTime(booking.departureTime)}</p>
                      <p className="text-xs text-gray-500">{booking.boardingPoint}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{booking.duration}</p>
                      <div className="w-24 h-px bg-gray-300 mx-auto mt-1"></div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-600">Arrival</p>
                      <p className="font-semibold text-gray-900">{booking.route.split(' → ')[1]}</p>
                      <p className="text-sm text-gray-600">{formatDate(booking.arrival)} • {formatTime(booking.arrivalTime)}</p>
                      <p className="text-xs text-gray-500">{booking.droppingPoint}</p>
                    </div>
                  </div>
                </div>

                {/* Seat Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Seat Numbers</p>
                      <p className="font-semibold text-gray-900">
                        {booking.seatNumbers.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {booking.contact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Booked on {formatDate(booking.departure)}
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200">
                      View E-Ticket
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                        Download Ticket
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button className="px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200">
                        Check Status
                      </button>
                    )}
                    {booking.status === 'cancelled' && (
                      <button className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200">
                        Refund Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bus bookings found</h3>
            <p className="text-gray-600">Your bus tickets will appear here once you make a booking.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusBookingsPage;