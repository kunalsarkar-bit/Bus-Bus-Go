import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load email from localStorage when component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setFormData(prevState => ({
        ...prevState,
        email: userEmail
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fallback to mailto: if API fails
    const fallbackToEmail = () => {
      const subject = `Contact Form: ${formData.subject}`;
      const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AMessage: ${formData.message}`;
      window.location.href = `mailto:support@bustravel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    try {
      // Try to use the API if available
      const response = await fetch('http://localhost:5000/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Include any additional data you want to send to the backend
          userEmailFromStorage: localStorage.getItem('userEmail') || null
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: localStorage.getItem('userEmail') || '', // Keep the stored email if available
          subject: '',
          message: ''
        });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        console.error('API failed, falling back to email');
        fallbackToEmail();
      }
    } catch (error) {
      console.error('Error:', error, 'Falling back to email');
      fallbackToEmail();
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We're here to help with your travel needs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Our Location</h3>
                  <p className="text-gray-600 mt-1">123 Travel Street, Bus City, BC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone Number</h3>
                  <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Toll-free: 1-800-BUS-RIDE</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email Address</h3>
                  <p className="text-gray-600 mt-1">support@bustravel.com</p>
                  <p className="text-gray-600">bookings@bustravel.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Working Hours</h3>
                  <p className="text-gray-600 mt-1">Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p className="text-gray-600">Weekends: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Customer Support</h3>
                  <p className="text-gray-600 mt-1">24/7 Support for Urgent Matters</p>
                  <p className="text-gray-600">Live Chat Available on Website</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send Us a Message</h2>
            
            {isSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Thank you!</strong>
                <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="mr-2" size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Frequently Asked Questions</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pr-6">
              <h3 className="font-medium text-lg text-gray-900 mb-2">How do I cancel my bus ticket?</h3>
              <p className="text-gray-600">You can cancel your ticket through your account on our website or app. Go to "My Bookings" and follow the cancellation process. Refund policies vary based on how far in advance you cancel.</p>
            </div>
            
            <div className="pt-4 md:pt-0 md:pl-6">
              <h3 className="font-medium text-lg text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit and debit cards, PayPal, and various mobile payment options. You can also pay via bank transfer for group bookings.</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 md:border-r md:pr-6">
              <h3 className="font-medium text-lg text-gray-900 mb-2">How early should I arrive before departure?</h3>
              <p className="text-gray-600">We recommend arriving at least 30 minutes before your scheduled departure time to allow for boarding procedures and baggage handling.</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 md:pl-6">
              <h3 className="font-medium text-lg text-gray-900 mb-2">Do you offer group discounts?</h3>
              <p className="text-gray-600">Yes, we offer special rates for groups of 10 or more passengers. Please contact our customer service for more information about group bookings.</p>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Find Us</h2>
          <div className="bg-gray-300 h-64 rounded-lg overflow-hidden">
         <img 
  src="https://placehold.co/1200x400/gray/white?text=Bus+Travel+Location" 
  alt="Map location" 
  className="w-full h-full object-cover"
/>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">BusTravel Tickets</h3>
            <p className="mb-4">Making your journey comfortable and convenient</p>
            <p>&copy; {new Date().getFullYear()} BusTravel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}