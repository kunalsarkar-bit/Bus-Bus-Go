# BUS-BUS-GO - BUS TICKET BOOKING PLATFORM

_Seamless Bus Travel Booking With Real-Time Seat Selection & Secure Payments_

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)

## Built with the rocks and technologies:

## Frontend Technologies:  

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![React DOM](https://img.shields.io/badge/Rendering-React%20DOM-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/Routing-React%20Router-CA4245?logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-PostCSS-DD3A0A?logo=postcss&logoColor=white)
![Axios](https://img.shields.io/badge/API-Axios-5A29E4?logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Icons-Lucide%20React-6B7280?logo=react&logoColor=white)

## Backend Technologies:  

![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000?logo=mongodb&logoColor=white)
![RESTful API](https://img.shields.io/badge/Architecture-RESTful%20API-009688?logo=fastapi&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Bcryptjs](https://img.shields.io/badge/Security-Bcryptjs-F97316?logo=javascript&logoColor=white)
![CORS](https://img.shields.io/badge/Security-CORS-10B981?logo=javascript&logoColor=white)
![Dotenv](https://img.shields.io/badge/Config-Dotenv-4ADE80?logo=dotenv&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-F97316?logo=nodemailer&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-9333EA?logo=cloudinary&logoColor=white)
![Multer](https://img.shields.io/badge/Upload-Multer-3B82F6?logo=javascript&logoColor=white)
![Multer Cloudinary](https://img.shields.io/badge/Storage-Multer%20Cloudinary-9333EA?logo=cloudinary&logoColor=white)
![Nodemon](https://img.shields.io/badge/Dev-Nodemon-76D04B?logo=nodemon&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## Overview

**BUS-BUS-GO** is a modern, full-stack bus ticket booking platform built on the MERN stack that revolutionizes the way travelers book intercity bus tickets. With real-time seat selection, secure JWT authentication, and a sleek Tailwind-powered responsive UI, Bus-Bus-Go provides a seamless booking experience from search to payment confirmation.

The platform leverages RESTful API architecture for efficient client-server communication, Cloudinary for secure image storage, and Nodemailer for automated booking confirmations. Whether you're a daily commuter or an occasional traveler, Bus-Bus-Go makes bus booking fast, secure, and hassle-free.

### Why BUS-BUS-GO?

This project streamlines bus ticket booking with:

✓ **Real-Time Seat Selection**: Interactive seat map with live availability updates  
✓ **Secure JWT Authentication**: Token-based auth with 7-day session management  
✓ **Responsive UI**: Mobile-first design built with Tailwind CSS for all screen sizes  
✓ **RESTful API Architecture**: Clean, scalable API endpoints for all operations  
✓ **Cloudinary Integration**: Secure profile and document image uploads and storage  
✓ **Automated Email Notifications**: Instant booking confirmations via Nodemailer  
✓ **Password Recovery**: Secure password reset functionality with email verification  
✓ **Bus Route Management**: Comprehensive route, schedule, and pricing management  
✓ **User Profiles**: Personalized user accounts with booking history and preferences  
✓ **Admin Dashboard**: Manage buses, routes, bookings, and users efficiently  
✓ **Booking History**: Track all past and upcoming bookings in one place  
✓ **Search & Filter**: Find buses by route, date, time, and bus type  

---

## Key Features

### 🚌 Smart Bus Booking
- Search buses by source, destination, and travel date
- Real-time seat availability with interactive seat layout
- Multiple bus types (AC/Non-AC, Sleeper/Seater)
- Dynamic pricing based on seat type and availability
- Instant booking confirmation with e-ticket generation

### 💺 Interactive Seat Selection
- Visual seat map with real-time availability status
- Color-coded seats (Available, Booked, Selected)
- Single and multiple seat selection support
- Seat number and position preview
- Gender-based seat allocation (optional)

### 🔐 Secure Authentication
- JWT-based authentication with 7-day token validity
- Encrypted password storage using bcryptjs
- Secure password reset via email verification
- Protected routes and API endpoints
- Session management with automatic token refresh

### 📧 Email Automation
- Automated booking confirmation emails
- E-ticket delivery with booking details
- Password reset verification codes
- Booking cancellation notifications
- Promotional offers and updates

### ☁️ Cloud Storage
- Cloudinary integration for image uploads
- Profile picture management
- Document verification uploads (ID proof, etc.)
- Optimized image delivery with CDN
- Secure, scalable storage solution

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Lucide React icons for intuitive navigation
- Mobile-optimized booking flow
- Fast loading times with Vite build system

### 📊 Admin Features
- Comprehensive admin dashboard
- Bus fleet management
- Route and schedule management
- Booking analytics and reports
- User management and verification

---

## Getting Started

### Prerequisites

This project requires the following dependencies installed on your system:

- **Programming Language**: JavaScript (Node.js for backend & React for frontend)  
- **Package Manager**: NPM (for managing Node.js dependencies)  
- **Database**: MongoDB (for storing users, buses, bookings, and routes)  
- **Cloud Service**: Cloudinary account (for image storage)  
- **Email Service**: SMTP credentials (Gmail or other email provider)  
- **Node.js Version**: 14.x or higher recommended  

---

## Installation

Build BUS-BUS-GO from the source and install dependencies:

### 1. Clone the repository:

```bash
git clone https://github.com/kunalsarkar-bit/Bus-Bus-Go.git
```

### 2. Go to project folder
```bash
cd Bus-Bus-Go
```

### 3. FOR THE FRONTEND PART :------------------------------------------------------------------------

  **A. Go to "client" folder for accessing frontend**
  ```bash
  cd client
  ```
  
  **B. Create a .env file inside "client" folder (if needed)**
  ```bash
  # Step 1: Create a new .env file
  touch .env

  # Step 2: Open the .env file in your code editor (VS Code example)
  code .env

  # Step 3: Add your environment variable inside the file (if any frontend-specific configs)
  # Example:
  # VITE_API_URL=http://localhost:5000
  ```

  **C. Install dependencies along with node modules**
  ```bash
  npm install
  ```

  **D. Start the client side**
  ```bash
  npm run dev
  ```

### 4. FOR THE BACKEND PART :------------------------------------------------------------------------

  **A. Go to "backend" folder for accessing backend**
  ```bash
  cd backend
  ```
  
  **B. Create a .env file inside "backend" folder**
  ```bash
  # Step 1: Create a new .env file
  touch .env

  # Step 2: Open the .env file in your code editor (VS Code example)
  code .env

  # Step 3: Add your environment variables inside the file
  # Example:
  PORT=5000
  MONGO_URI=mongodb+srv://<your-username>:<password>@cluster0.afdo5i2.mongodb.net/travel?retryWrites=true&w=majority&appName=Cluster0

  # JWT Configuration
  JWT_SECRET=your-secret-key-here
  JWT_EXPIRES_IN=7d

  # Email Configuration for Password Reset
  EMAIL_USER=your-email@example.com
  EMAIL_PASS=your-email-password-or-app-password

  FRONTEND_URL=http://localhost:3000

  # Cloudinary Configuration (for profile and document image uploads)
  CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
  CLOUDINARY_API_KEY=your-cloudinary-api-key
  CLOUDINARY_API_SECRET=your-cloudinary-api-secret
  ```

  **C. Install dependencies along with node modules**
  ```bash
  npm install
  ```

  **D. Start the server side**
  ```bash
  npm start
  ```

---

## Usage

To run the project locally, follow these steps:

### For Backend (Server)
```bash
cd backend
npm install
npm start
```
This starts the backend server using Express on the configured port (default: **http://localhost:5000**).

### For Frontend (Client)
```bash
cd client
npm install
npm run dev
```
This runs the React frontend with Vite on **http://localhost:3000**.

### Access the App

Once both servers are running, open your browser and go to:
```
http://localhost:3000
```

You can now:

• **Register/Login** as a user or admin  
• **Search Buses** by entering source, destination, and travel date  
• **Select Seats** from the interactive seat layout  
• **Book Tickets** with real-time seat reservation  
• **Receive Confirmation** via automated email with e-ticket  
• **Manage Profile** including profile picture upload via Cloudinary  
• **View Booking History** with all past and upcoming trips  
• **Reset Password** using secure email verification  
• **Admin Panel** (if admin) to manage buses, routes, and bookings  

---

## Testing

### Steps:

**1. Start backend and frontend**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

✓ Backend runs on **http://localhost:5000**  
✓ Frontend runs on **http://localhost:3000**  

**2. Open your browser → go to http://localhost:3000**

**3. Create a test account or log in**

**4. Try out the main features:**

### User Flow Testing:
• **Register Account** — Create a new user account with email verification  
• **Login** — Test JWT authentication and session management  
• **Search Buses** — Enter route and date to find available buses  
• **View Bus Details** — Check bus amenities, timings, and pricing  
• **Select Seats** — Click on available seats in the interactive layout  
• **Confirm Booking** — Complete the booking process  
• **Email Verification** — Check inbox for booking confirmation email  
• **View Bookings** — Navigate to booking history page  
• **Update Profile** — Upload profile picture via Cloudinary  
• **Password Reset** — Test forgot password functionality  

### Admin Flow Testing:
• **Login as Admin** — Access admin dashboard  
• **Add New Bus** — Create bus with details and seat layout  
• **Add Route** — Set up new travel routes with schedules  
• **Manage Bookings** — View all bookings and their status  
• **Upload Images** — Test Cloudinary integration for bus images  
• **Generate Reports** — Check analytics and booking statistics  

**5. Review MongoDB (optional) to confirm data integrity:**

• Verify users, buses, routes, and bookings are saved correctly  
• Check seat availability updates after bookings  
• Confirm email logs and JWT token management  
• Validate Cloudinary image URLs in database  

**6. Test Responsiveness:**

• Open on mobile device or resize browser  
• Test seat selection on smaller screens  
• Verify navigation and UI elements adapt properly  
• Check touch interactions for mobile users  

**7. Security Testing:**

• Try accessing protected routes without authentication  
• Test JWT token expiration (after 7 days)  
• Verify password encryption in database  
• Test CORS policies with different origins  

That's all for manual testing — the goal is to verify that booking, seat selection, authentication, email notifications, and image uploads all work seamlessly with maximum security and user experience.

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login with JWT |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/profile` | Get user profile (Protected) |

### Bus Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buses` | Get all buses |
| GET | `/api/buses/:id` | Get bus by ID |
| POST | `/api/buses` | Add new bus (Admin) |
| PUT | `/api/buses/:id` | Update bus (Admin) |
| DELETE | `/api/buses/:id` | Delete bus (Admin) |

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get user bookings (Protected) |
| GET | `/api/bookings/:id` | Get booking details |
| POST | `/api/bookings` | Create new booking |
| PUT | `/api/bookings/:id` | Update booking status |
| DELETE | `/api/bookings/:id` | Cancel booking |

### Route Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes` | Search available routes |
| GET | `/api/routes/:id` | Get route details |
| POST | `/api/routes` | Add new route (Admin) |
| PUT | `/api/routes/:id` | Update route (Admin) |

---

## Project Structure

```
Bus-Bus-Go/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── BusList.jsx    # Bus search results
│   │   │   ├── SeatLayout.jsx # Interactive seat selection
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── SearchBus.jsx  # Bus search page
│   │   │   ├── BookingPage.jsx# Booking confirmation
│   │   │   ├── Profile.jsx    # User profile
│   │   │   └── ...
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js         # Axios API calls
│   │   │   └── auth.js        # Auth helpers
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
├── backend/                    # Backend Node.js application
│   ├── models/                # MongoDB schemas
│   │   ├── User.js            # User model
│   │   ├── Bus.js             # Bus model
│   │   ├── Booking.js         # Booking model
│   │   └── Route.js           # Route model
│   ├── routes/                # API endpoints
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── busRoutes.js       # Bus management routes
│   │   ├── bookingRoutes.js   # Booking routes
│   │   └── routeRoutes.js     # Route routes
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Auth logic
│   │   ├── busController.js   # Bus operations
│   │   └── ...
│   ├── middleware/            # Middleware functions
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── adminMiddleware.js # Admin access control
│   │   └── upload.js          # Multer & Cloudinary config
│   ├── utils/                 # Helper functions
│   │   ├── emailService.js    # Nodemailer configuration
│   │   └── cloudinary.js      # Cloudinary setup
│   ├── config/                # Configuration files
│   │   └── database.js        # MongoDB connection
│   ├── server.js              # Entry point
│   └── package.json           # Backend dependencies
│
└── README.md                  # Project documentation
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/travel
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

**Author**: Kunal Sarkar

For questions or support, please reach out via:
- GitHub: [kunalsarkar-bit](https://github.com/kunalsarkar-bit)
- Repository: [Bus-Bus-Go](https://github.com/kunalsarkar-bit/Bus-Bus-Go)

---

## Acknowledgments

- MongoDB for the robust database solution
- Cloudinary for seamless image management
- Tailwind CSS for the modern UI framework
- The MERN stack community for excellent documentation

---

**Made with 🚌 by Kunal Sarkar** | Making Bus Travel Booking Effortless
