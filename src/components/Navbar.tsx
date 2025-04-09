import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onAuthNavigation: (mode: 'signup' | 'signin') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn, 
  onLogout, 
  onNavigate, 
  onAuthNavigation 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
            <Heart className="w-8 h-8 text-red-500" />
            <span className="ml-2 text-xl font-semibold">HeartCare</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="items-center hidden space-x-4 md:flex">
            <button onClick={() => handleNavigation('home')} className="text-gray-700 hover:text-red-500">Home</button>
            <button onClick={() => handleNavigation('about')} className="text-gray-700 hover:text-red-500">About Us</button>
            <button onClick={() => handleNavigation('contact')} className="text-gray-700 hover:text-red-500">Contact Us</button>
            
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => onAuthNavigation('signup')}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => onAuthNavigation('signin')}
                  className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <div className="flex flex-col space-y-2">
            <button onClick={() => handleNavigation('home')} className="py-2 text-left text-gray-700 hover:text-red-500">Home</button>
            <button onClick={() => handleNavigation('about')} className="py-2 text-left text-gray-700 hover:text-red-500">About Us</button>
            <button onClick={() => handleNavigation('contact')} className="py-2 text-left text-gray-700 hover:text-red-500">Contact Us</button>
            
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => onAuthNavigation('signup')}
                  className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => onAuthNavigation('signin')}
                  className="w-full px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogout}
                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;