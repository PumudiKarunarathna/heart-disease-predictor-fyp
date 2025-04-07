import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

function App() {
  
  const renderMainContent = () => {
    if (currentPage === 'home') {
      return (
        <>
          <Slider />
          <section className="max-w-7xl mx-auto py-8 md:py-16 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Choose Our Heart Disease Prediction System?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our advanced machine learning algorithms analyze your health parameters 
                  to provide accurate predictions about potential heart disease risks. 
                  Early detection can save lives.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => setCurrentPage('form')}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                      >
                        Make Prediction
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAuthNavigation('signin')}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                    >
                      Get Started
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('more-info')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full md:w-auto"
                  >
                    More Information
                  </button>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={image1}
                  alt="Heart Care"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </section>
        </>
      );
    }
  };

}

export default App;