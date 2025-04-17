import { Heart, Award, Users, Clock } from 'lucide-react';
import image from '../assets/6.jpg';

const AboutUs = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">About HeartCare</h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            We are dedicated to revolutionizing heart disease prediction through advanced technology and machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold">Expert Care</h3>
            <p className="text-gray-600">Providing top-quality heart disease prediction services</p>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <Award className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold">Certified System</h3>
            <p className="text-gray-600">Using certified and tested prediction algorithms</p>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <Users className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold">Experienced Team</h3>
            <p className="text-gray-600">Backed by experienced healthcare professionals</p>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <Clock className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock assistance for our users</p>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="mb-6 text-gray-600">
                To provide accessible and accurate heart disease prediction services to everyone, 
                enabling early detection and prevention of heart-related issues through advanced 
                technology and expert guidance.
              </p>
              <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
              <p className="text-gray-600">
                To become the world's leading platform for heart disease prediction and prevention, 
                making healthcare more proactive and accessible to all.
              </p>
            </div>
            <div className="h-full">
              <img 
                src={image} 
                alt="Medical Team" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;