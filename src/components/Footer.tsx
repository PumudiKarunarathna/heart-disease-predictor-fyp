import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-white bg-gray-800">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="ml-2 text-xl font-semibold">HeartCare</span>
            </div>
            <p className="text-gray-400">
              Advanced heart disease prediction using cutting-edge technology and machine learning.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Heart Disease Prediction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Health Monitoring</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Expert Consultation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>xxxxxxxxxxxxx</li>
              <li>xxxxxxxxxxxxxxx</li>
              <li>Phone: 1111111111111111</li>
              <li>Email: sssssssssssssssss</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} HeartCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;