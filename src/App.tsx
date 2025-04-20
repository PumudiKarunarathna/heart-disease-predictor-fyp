import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import MoreInformation from './components/MoreInformation';

function App() {
  
  const renderMainContent = () => {
    if (currentPage === 'home') {
      return (
        <>
          <Slider />
          <section className="px-4 py-8 mx-auto max-w-7xl md:py-16">
            <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                  Why Choose Our Heart Disease Prediction System?
                </h2>
                <p className="mb-6 text-gray-600">
                  Our advanced machine learning algorithms analyze your health parameters 
                  to provide accurate predictions about potential heart disease risks. 
                  Early detection can save lives.
                </p>
                <div className="flex flex-col gap-4 md:flex-row">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => setCurrentPage('form')}
                        className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Make Prediction
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-6 py-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAuthNavigation('signin')}
                      className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Get Started
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('more-info')}
                    className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 md:w-auto"
                  >
                    More Information
                  </button>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={image1}
                  alt="Heart Care"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>
        </>
      );
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage}
        onAuthNavigation={handleAuthNavigation}
      />
      
      <main className="flex-grow">
        {renderMainContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;