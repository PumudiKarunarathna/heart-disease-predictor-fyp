import { Heart, Activity, Dumbbell, Beaker, AlertCircle } from 'lucide-react';

const MoreInformation = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-red-50 to-white">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="relative mb-12 text-center">
          <div className="absolute top-0 -translate-x-1/2 -translate-y-1/2 animate-pulse left-1/2">
            <Heart className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="pt-8 mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Important Health Information
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Understanding the differences between common chest-related conditions
          </p>
        </div>

        <div className="space-y-8">
          {/* Chest Muscle Pain Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center p-6 space-x-4 bg-gradient-to-r from-red-100 to-red-50">
              <Dumbbell className="w-8 h-8 text-red-600 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-900">Chest Muscle Pain</h2>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-600">
                Chest muscle pain, also known as musculoskeletal chest pain, occurs when the muscles, tendons, or ligaments in the chest become strained, inflamed, or injured.
              </p>
              <p className="text-gray-600">
                The symptoms typically include sharp, aching, or stabbing sensations that worsen with movement, deep breathing, or pressing on the affected area.
              </p>
              <p className="text-gray-600">
                Treatment primarily involves rest, ice or heat therapy, and over-the-counter pain relievers.
              </p>
            </div>
          </div>

          {/* Gastritis Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center p-6 space-x-4 bg-gradient-to-r from-red-100 to-red-50">
              <Beaker className="w-8 h-8 text-red-600 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-900">Gastritis</h2>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-600">
                Gastritis is the inflammation of the stomach lining, which can be caused by various factors including bacterial infections and excessive alcohol consumption.
              </p>
              <p className="text-gray-600">
                Common signs include burning or gnawing pain in the upper abdomen, nausea, and bloating.
              </p>
              <p className="text-gray-600">
                Treatment typically involves medications such as antacids and proton pump inhibitors.
              </p>
            </div>
          </div>

          {/* Heart Attack Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center p-6 space-x-4 bg-gradient-to-r from-red-100 to-red-50">
              <Activity className="w-8 h-8 text-red-600 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-900">Heart Attack</h2>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-600">
                A heart attack occurs when blood flow to a part of the heart is blocked, usually due to plaque buildup.
              </p>
              <p className="text-gray-600">
                Symptoms often include chest pain or discomfort that feels like pressure or squeezing.
              </p>
              <p className="text-gray-600">
                Treatment typically involves emergency interventions such as medications to dissolve clots or angioplasty.
              </p>
            </div>
          </div>

          {/* Connection Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center p-6 space-x-4 bg-gradient-to-r from-red-100 to-red-50">
              <AlertCircle className="w-8 h-8 text-red-600 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-900">Understanding the Connections</h2>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-gray-600">
                These conditions can sometimes present with similar symptoms, particularly chest discomfort.
              </p>
              <div className="p-4 mt-4 border-l-4 border-red-400 bg-red-50">
                <p className="text-red-700">
                  <strong>Important Notice:</strong> If chest pain is sudden, persistent, or accompanied by symptoms such as shortness of breath, seek immediate medical attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInformation;