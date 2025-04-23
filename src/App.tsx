import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import { AuthForms } from './components/AuthForms';
import PredictionForm from './components/PredictionForm';
import Results from './components/Results';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import MoreInformation from './components/MoreInformation';
import Footer from './components/Footer';
import image1 from './assets/8.jpeg';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const results = localStorage.getItem('predictionResult');
    if (results && window.location.pathname === '/results') {
      setCurrentPage('results');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('predictionResult'); 
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleAuthSuccess = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setCurrentPage('form');
    } else {
      setCurrentPage('home');
    }
  };

  const handleAuthNavigation = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

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

    switch (currentPage) {
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'auth':
        return <AuthForms onSuccess={handleAuthSuccess} initialMode={authMode} />;
      case 'form':
        return isLoggedIn ? <PredictionForm /> : null;
      case 'results':
        return <Results setCurrentPage={setCurrentPage} />;
      case 'more-info':
        return <MoreInformation />;
      default:
        return null;
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