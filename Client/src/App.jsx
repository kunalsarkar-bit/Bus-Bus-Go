// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import MainLayout from './Layouts/MainLayout';
import ContactUs from './Pages/ContactUsPage';
import AboutUsPage from './Pages/AboutUsPage';
import LoginSignupForm from './Pages/LoginSignupForm';
import Busses from './Pages/Busses1';
import Busbooking from './Pages/Busbooking';
import ForgetPasswordPage from './Components/ForgetPassword/ForgetPasswordPage';
import ResetPasswordPage from './Components/ForgetPassword/ResetPasswordPage';
import VerificationPage from './Pages/VerificationPage';
import UserProfile from './Components/UserProfile/UserProfile';
import BusDashboard from './Components/Admin/AdminDashboard';
import MyBusBookingsPage from './Pages/MyBusBookingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with header & footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
         <Route
          path="/contact"
          element={
            <MainLayout>
              <ContactUs />
            </MainLayout>
          }
        />
         <Route
          path="/about"
          element={
            <MainLayout>
              <AboutUsPage />
            </MainLayout>
          }
        />
        <Route path="/busses"
        element={<MainLayout>
                    <Busses />
                 </MainLayout>} />
        <Route path="/busbooking"
        element={<MainLayout>
                    <Busbooking />
                 </MainLayout>} />

                    <Route path="/profile"
        element={<MainLayout>
                    <UserProfile />
                 </MainLayout>} />
        <Route path="/mybookings"
        element={<MainLayout>
                    <MyBusBookingsPage />
                 </MainLayout>} />
     
     
        <Route path="/login" element={<LoginSignupForm  />} />
  <Route path="/forgot-password" element={<ForgetPasswordPage />} />
<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/admin" element={<BusDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
