import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  User,
  Users,
  CalendarCheck,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Bus,
} from "lucide-react";

export default function Busbooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [busRoute, setBusRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");

  // Form states
  const [passengerInfo, setPassengerInfo] = useState({
    name: "",
    dateofbirth: "", // must match the input name and used for binding
    email: "",
    phone: "",
    passengers: 1,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // Price calculation states
  const [subtotal, setSubtotal] = useState(0);
  const [fees, setFees] = useState(0);
  const [total, setTotal] = useState(0);

  // Booking summary
  const [bookingNumber, setBookingNumber] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);

        // Pre-fill passenger info with user data
        setPassengerInfo((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dateofbirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please refresh the page.");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    // Use route from location state if available, else fetch by routeId
    const routeFromState = location.state?.route;
    if (routeFromState) {
      setBusRoute(routeFromState);

      // Initialize price calculation
      const initialSubtotal = routeFromState.price;
      const serviceFee = Math.round(routeFromState.price * 0.1); // 10% service fee

      setSubtotal(initialSubtotal);
      setFees(serviceFee);
      setTotal(initialSubtotal + serviceFee);

      setLoading(false);
    } else {
      const routeId =
        new URLSearchParams(location.search).get("routeId") || "5";

      // Simulate API fetch
      setTimeout(() => {
        const dummyRoute = generateDummyRoute(parseInt(routeId));
        setBusRoute(dummyRoute);

        // Initialize price calculation
        const initialSubtotal = dummyRoute.price;
        const serviceFee = Math.round(dummyRoute.price * 0.1); // 10% service fee

        setSubtotal(initialSubtotal);
        setFees(serviceFee);
        setTotal(initialSubtotal + serviceFee);

        setLoading(false);
      }, 800);
    }
  }, [location]);

  // Update pricing when passenger count changes
  useEffect(() => {
    if (busRoute) {
      const newSubtotal = busRoute.price * passengerInfo.passengers;
      const newFees = Math.round(newSubtotal * 0.1); // 10% service fee

      setSubtotal(newSubtotal);
      setFees(newFees);
      setTotal(newSubtotal + newFees);
    }
  }, [passengerInfo.passengers, busRoute]);

  // Generate seats based on bus layout
  const generateSeats = () => {
    const totalSeats = 40; // Common bus configuration
    const seatsPerRow = 4;
    const aisleAfter = 2; // Aisle after seat 2 in each row

    const seatRows = [];
    const unavailableSeats = [3, 7, 12, 15, 22, 25, 28, 33]; // Example of reserved seats

    for (let i = 0; i < totalSeats; i += seatsPerRow) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        const seatNumber = i + j + 1;
        const isAvailable = !unavailableSeats.includes(seatNumber);

        // Add aisle gap after specified seat
        if (j === aisleAfter) {
          row.push("aisle");
        }

        row.push({
          number: seatNumber,
          available: isAvailable,
          selected: selectedSeats.includes(seatNumber),
        });
      }
      seatRows.push(row);
    }

    return seatRows;
  };

  // Generate a dummy route for demo purposes
  const generateDummyRoute = (id) => {
    const cities = [
      "New York",
      "Boston",
      "Chicago",
      "Detroit",
      "Los Angeles",
      "San Francisco",
      "Washington DC",
    ];

    // To ensure we're showing consistent data with the search page
    const route = {
      id: id,
      from: "Boston",
      to: "New York",
      date: "2025-05-01",
      departureTime: "09:30",
      arrivalTime: "13:45",
      duration: "4h 15m",
      price: 45,
      company: "GreyDog",
      busType: "express",
      amenities: {
        wifi: true,
        power: true,
        food: false,
        extraLegroom: true,
      },
      seats: 23,
    };

    return route;
  };

  // Format time to 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle form input changes
  const handlePassengerInfoChange = (e) => {
    const { name, value } = e.target;
    setPassengerInfo((prev) => ({
      ...prev,
      [name]: name === "passengers" ? parseInt(value) : value,
    }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle seat selection
  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      // Only allow selecting as many seats as there are passengers
      if (selectedSeats.length < passengerInfo.passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  // Navigate between steps
  const goToNextStep = () => {
    // Validation for each step
    if (step === 1) {
      // Validate passenger info
      if (
        !passengerInfo.name ||
        !passengerInfo.dateofbirth ||
        !passengerInfo.email ||
        !passengerInfo.phone
      ) {
        alert("Please fill in all required fields.");
        return;
      }
    } else if (step === 2) {
      // Validate seat selection
      if (selectedSeats.length !== passengerInfo.passengers) {
        alert(`Please select ${passengerInfo.passengers} seat(s).`);
        return;
      }
    } else if (step === 3) {
      // Validate payment info
      if (
        !paymentInfo.cardNumber ||
        !paymentInfo.cardName ||
        !paymentInfo.expiry ||
        !paymentInfo.cvv
      ) {
        alert("Please fill in all payment details.");
        return;
      }

      // Generate booking number
      const randomBookingNumber =
        "BK" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingNumber(randomBookingNumber);
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const returnToSearch = () => {
    navigate("/busses");
  };

  // Final booking completion
  //  const completeBooking = async () => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     const bookingData = {
  //       routeId: busRoute.id,
  //       passengerInfo,
  //       selectedSeats,
  //       paymentInfo,
  //       totalPrice: total,
  //       bookingNumber
  //     };

  //     const response = await fetch('http://localhost:5000/api/bookings', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(bookingData)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Booking failed');
  //     }

  //     const data = await response.json();
  //     navigate('/dashboard');
  //   } catch (error) {
  //     console.error('Booking error:', error);

  //   }
  // };
const completeBooking = () => {
  // Perform any logic if needed
  navigate("/mybookings"); // ✅ Uses the navigate from the top of the component
};

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={step === 1 ? returnToSearch : goToPreviousStep}
              className="flex items-center text-white hover:text-blue-100 transition"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              {step === 1 ? "Back to search results" : "Previous step"}
            </button>
            <h1 className="text-xl font-bold text-white ml-4">
              {step === 4 ? "Booking Confirmed" : "Complete Your Booking"}
            </h1>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      {step < 4 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between">
              <div
                className={`flex flex-col items-center w-full ${
                  step >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step >= 1
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  } mb-1`}
                >
                  <User className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Passenger Info</span>
              </div>
              <div className="w-full mx-2 flex items-center">
                <div
                  className={`h-1 w-full ${
                    step >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div
                className={`flex flex-col items-center w-full ${
                  step >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step >= 2
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  } mb-1`}
                >
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Seat Selection</span>
              </div>
              <div className="w-full mx-2 flex items-center">
                <div
                  className={`h-1 w-full ${
                    step >= 3 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div
                className={`flex flex-col items-center w-full ${
                  step >= 3 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step >= 3
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  } mb-1`}
                >
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="lg:w-2/3">
            {/* Booking Forms */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Passenger Information
                </h2>

                {userLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={passengerInfo.name}
                          onChange={handlePassengerInfoChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth*
                        </label>
                        <input
                          type="date"
                          name="dateofbirth"
                          value={passengerInfo.dateofbirth}
                          onChange={handlePassengerInfoChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={passengerInfo.email}
                          onChange={handlePassengerInfoChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={passengerInfo.phone}
                          onChange={handlePassengerInfoChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Passengers*
                        </label>
                        <select
                          name="passengers"
                          value={passengerInfo.passengers}
                          onChange={handlePassengerInfoChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "passenger" : "passengers"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-800 font-medium">
                            Important Information
                          </p>
                          <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                            <li>
                              Please bring a valid ID that matches the name on
                              this booking.
                            </li>
                            <li>
                              Arrive at least 15 minutes before departure.
                            </li>
                            <li>
                              The maximum luggage allowance is 2 bags per
                              passenger.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={goToNextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition w-full md:w-auto"
                      >
                        Continue to Seat Selection
                      </button>
                    </div>
                    {/* ... rest of your form ... */}
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Select Your Seats
                </h2>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Please select {passengerInfo.passengers} seat
                    {passengerInfo.passengers > 1 ? "s" : ""}. Currently
                    selected: {selectedSeats.length} of{" "}
                    {passengerInfo.passengers}
                  </p>

                  <div className="flex justify-between mb-4 text-sm">
                    <div className="flex items-center">
                      <div className="bg-gray-100 w-6 h-6 rounded mr-2"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-500 w-6 h-6 rounded mr-2"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-400 w-6 h-6 rounded mr-2"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>

                {/* Bus diagram */}
                <div className="mb-8">
                  <div className="relative bg-gray-100 p-4 rounded-lg">
                    {/* Driver area */}
                    <div className="bg-gray-300 w-20 h-16 rounded-t-xl mx-auto mb-8 flex items-center justify-center">
                      <Bus className="h-8 w-8 text-gray-600" />
                    </div>

                    {/* Seats */}
                    <div className="max-w-md mx-auto">
                      {generateSeats().map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex justify-center mb-3"
                        >
                          {row.map((seat, seatIndex) =>
                            seat === "aisle" ? (
                              <div
                                key={`aisle-${rowIndex}-${seatIndex}`}
                                className="w-6"
                              ></div>
                            ) : (
                              <button
                                key={`seat-${seat.number}`}
                                disabled={!seat.available}
                                onClick={() =>
                                  seat.available &&
                                  toggleSeatSelection(seat.number)
                                }
                                className={`w-10 h-10 m-1 rounded-md flex items-center justify-center text-sm font-medium
                                  ${
                                    !seat.available
                                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                      : seat.selected
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                              >
                                {seat.number}
                              </button>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={goToPreviousStep}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={goToNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
                    disabled={selectedSeats.length !== passengerInfo.passengers}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card*
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number*
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date*
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={paymentInfo.expiry}
                        onChange={handlePaymentInfoChange}
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV*
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInfoChange}
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Bus Tickets ({passengerInfo.passengers})
                      </span>
                      <span className="font-medium">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">${fees}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Payment Security
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment information is encrypted and secure. We
                        never store your full card details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={goToPreviousStep}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={goToNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
                  >
                    Complete Booking
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-4 mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-gray-600">
                    Your booking has been confirmed. A confirmation email has
                    been sent to {passengerInfo.email}.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Booking Details
                    </h3>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
                      Booking #{bookingNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Passenger</p>
                      <p className="font-medium">
                        {passengerInfo.name} {passengerInfo.dateofbirth}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact</p>
                      <p className="font-medium">
                        {passengerInfo.email} | {passengerInfo.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Journey</p>
                      <p className="font-medium">
                        {busRoute.from} to {busRoute.to}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                      <p className="font-medium">
                        {busRoute.date} | {formatTime(busRoute.departureTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bus Company</p>
                      <p className="font-medium">
                        {busRoute.company} ({busRoute.busType})
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Seat(s)</p>
                      <p className="font-medium">
                        {selectedSeats.sort((a, b) => a - b).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Paid</span>
                      <span className="text-lg font-bold">${total}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-8">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        Boarding Information
                      </p>
                      <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                        <li>
                          Please arrive at the bus station at least 15 minutes
                          before departure.
                        </li>
                        <li>
                          Have your booking ID and identification ready for
                          verification.
                        </li>
                        <li>
                          Check the departure boards at the station for gate
                          information.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={completeBooking}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
                  >
                    Go to My Bookings
                  </button>
                  
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Trip Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Trip Summary
              </h2>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                    <Bus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{busRoute.company}</p>
                    <p className="font-medium">{busRoute.company}</p>
                    <p className="text-sm text-gray-500">
                      {busRoute.busType} bus
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="mr-3 pt-1">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{busRoute.from}</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">
                        {formatTime(busRoute.departureTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-2 border-dotted border-gray-300 h-10 ml-4 my-2"></div>

                <div className="flex items-start">
                  <div className="mr-3 pt-1">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{busRoute.to}</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">
                        {formatTime(busRoute.arrivalTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <CalendarCheck className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-700">{busRoute.date}</p>
                </div>

                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-700">Duration: {busRoute.duration}</p>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <p className="text-gray-700">
                      {selectedSeats.length} seat
                      {selectedSeats.length > 1 ? "s" : ""}:
                      {selectedSeats
                        .sort((a, b) => a - b)
                        .map((seat, i) => (
                          <span key={seat} className="ml-1">
                            {seat}
                            {i < selectedSeats.length - 1 ? "," : ""}
                          </span>
                        ))}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div
                    className={`flex items-center ${
                      busRoute.amenities.wifi
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        busRoute.amenities.wifi
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span>Wi-Fi</span>
                  </div>

                  <div
                    className={`flex items-center ${
                      busRoute.amenities.power
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        busRoute.amenities.power
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span>Power Outlets</span>
                  </div>

                  <div
                    className={`flex items-center ${
                      busRoute.amenities.food
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        busRoute.amenities.food
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span>Food & Drinks</span>
                  </div>

                  <div
                    className={`flex items-center ${
                      busRoute.amenities.extraLegroom
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        busRoute.amenities.extraLegroom
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span>Extra Legroom</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Price Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Bus Tickets ({passengerInfo.passengers})
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>${fees}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
