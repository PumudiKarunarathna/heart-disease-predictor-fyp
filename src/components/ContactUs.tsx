import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Contact Us</h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Have questions? We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-bold">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Message</label>
                <textarea
                  className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="flex-shrink-0 w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">xxxxxxxxxxxxxxxx</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="flex-shrink-0 w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+1111111111111111</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="flex-shrink-0 w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">xxxxxxxxxxxxxxxxxxxxxxx</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="flex-shrink-0 w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold">Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;