import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-blue-700 h-64 w-full absolute top-0 left-0 opacity-90"></div>
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-64 w-full absolute top-0 left-0 opacity-80"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">About Bus Go</h2>
            <p className="text-xl">Connecting destinations, simplifying journeys.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold text-blue-800 mb-6">Our Story</h3>
            <p className="text-gray-700 mb-6">
              Founded in 2015, Bus Go was born from a simple idea: make bus travel booking simple, 
              transparent, and accessible to everyone. What started as a small startup with 
              connections to just 5 cities has now grown into one of the country's leading 
              bus ticketing platforms, serving over 500 destinations nationwide.
            </p>
            <p className="text-gray-700">
              Our journey has been driven by our commitment to enhance the travel experience 
              for millions of passengers. We've partnered with hundreds of bus operators to 
              provide the most comprehensive network of routes and ensure you always find the 
              perfect journey for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fillOpacity="0.5" />
                </svg>
                <h3 className="text-xl font-semibold text-blue-800">Our Mission</h3>
              </div>
              <p className="text-gray-700">
                To transform the way people book and experience bus travel by providing a 
                seamless, reliable platform that connects travelers with quality bus services 
                across the nation. We're committed to making transportation more accessible, 
                convenient, and enjoyable for everyone.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fillOpacity="0.2" />
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                </svg>
                <h3 className="text-xl font-semibold text-blue-800">Our Vision</h3>
              </div>
              <p className="text-gray-700">
                To be the most trusted and preferred bus ticketing platform worldwide, known for 
                innovation, reliability, and customer satisfaction. We envision a future where 
                booking a bus journey is as simple as a few taps on your phone, with real-time 
                information and personalized services that make every journey special.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold text-blue-800 mb-6">What Sets Us Apart</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM13 12H17V14H11V7H13V12Z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-blue-800 mb-2">24/7 Support</h4>
                <p className="text-gray-600">Our dedicated customer service team is always available to assist you with any queries or concerns.</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 2V4H8V2H6V4H5C3.89 4 3 4.89 3 6V20C3 21.11 3.89 22 5 22H19C20.11 22 21 21.11 21 20V6C21 4.89 20.11 4 19 4H18V2H16ZM19 20H5V9H19V20ZM7 11H9V13H7V11ZM11 11H13V13H11V11ZM15 11H17V13H15V11ZM7 15H9V17H7V15ZM11 15H13V17H11V15Z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-blue-800 mb-2">Instant Bookings</h4>
                <p className="text-gray-600">Book your tickets in minutes with our fast, secure, and user-friendly platform.</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.032 3 3 7.032 3 12C3 16.968 7.032 21 12 21C16.968 21 21 16.968 21 12C21 7.032 16.968 3 12 3ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19ZM12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8ZM12 14C10.33 14 7 14.83 7 16.5V18H17V16.5C17 14.83 13.67 14 12 14Z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-blue-800 mb-2">Trusted Partners</h4>
                <p className="text-gray-600">We partner with verified bus operators to ensure safe and comfortable travel experiences.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-800 mb-6">Our Team</h3>
            <p className="text-gray-700 mb-8">
              Behind Bus Go is a passionate team of travel enthusiasts, technology experts, and 
              customer service professionals dedicated to transforming the bus travel industry. 
              We work tirelessly to improve our platform and expand our services to meet the 
              evolving needs of our customers.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                <h4 className="font-medium text-blue-800">Sarah Johnson</h4>
                <p className="text-gray-600 text-sm">CEO & Founder</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                <h4 className="font-medium text-blue-800">Michael Chen</h4>
                <p className="text-gray-600 text-sm">CTO</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                <h4 className="font-medium text-blue-800">Priya Sharma</h4>
                <p className="text-gray-600 text-sm">Head of Operations</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4"></div>
                <h4 className="font-medium text-blue-800">David Wilson</h4>
                <p className="text-gray-600 text-sm">Customer Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h3 className="text-2xl font-semibold mb-4">Ready to Experience Hassle-Free Bus Travel?</h3>
            <p className="text-lg mb-8">Join thousands of satisfied travelers who book with Bus Go every day.</p>
            <button className="bg-white text-blue-600 font-medium py-3 px-8 rounded-md shadow-md hover:bg-blue-50 transition duration-300">Book Your Journey Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
}