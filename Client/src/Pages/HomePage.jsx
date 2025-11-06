import React from 'react';
import Header from '../Components/Common/Header';
import Footer from '../Components/Common/Footer';
import MainPage from '../Components/Home';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
   
      <MainPage />
   
    </div>
  );
}