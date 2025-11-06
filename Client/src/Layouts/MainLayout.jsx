// src/Layouts/MainLayout.js
import React from 'react';
import Header from '../Components/Common/Header';
import Footer from '../Components/Common/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
