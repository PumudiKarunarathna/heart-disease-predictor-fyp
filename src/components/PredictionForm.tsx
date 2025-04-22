import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  interface FormData {
    Age: string;
    Sex: string;
    ChestPainType: string;
    RestingBP: string;
    Cholesterol: string;
    FastingBS: string;
    RestingECG: string;
    MaxHR: string;
    ExerciseAngina: string;
    Oldpeak: string;
    ST_Slope: string;
    NumMajorVessels: number;
    alcohol_consumption: string;
    ct_scan: string;
    dietary_habits: string;
    geographical_location: string;
    existing_conditions: string[];
    biopsy_results: string;
    family_history: boolean;
    smoking_habits: string;
  }
  
  const [formData, setFormData] = useState<FormData>({
    Age: '',
    Sex: '',
    ChestPainType: '',
    RestingBP: '',
    Cholesterol: '',
    FastingBS: '',
    RestingECG: '',
    MaxHR: '',
    ExerciseAngina: '',
    Oldpeak: '',
    ST_Slope: '',
    NumMajorVessels: 0,
    alcohol_consumption: '',
    ct_scan: '',
    dietary_habits: '',
    geographical_location: '',
    existing_conditions: [],
    biopsy_results: '',
    family_history: false,
    smoking_habits: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const processedFormData = {
        ...formData,
        Age: parseInt(formData.Age as string),
        RestingBP: parseInt(formData.RestingBP as string),
        Cholesterol: parseInt(formData.Cholesterol as string),
        FastingBS: parseInt(formData.FastingBS as string),
        MaxHR: parseInt(formData.MaxHR as string),
        Oldpeak: parseFloat(formData.Oldpeak as string),
        gender: formData.Sex === 'M' ? 'male' : 'female',
        condition_type: 'differential'
      };

      const response = await axios.post('/api/predict', processedFormData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      localStorage.setItem('predictionResult', JSON.stringify(response.data));
      window.location.href = '/results';
    } catch (error) {
      console.error('Prediction submission error:', error);
      alert('Failed to submit prediction. Please check your inputs.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleExistingConditionsChange = (condition: string) => {
    setFormData(prev => {
      const currentConditions = Array.isArray(prev.existing_conditions) ? [...prev.existing_conditions] : [];
      
      if (currentConditions.includes(condition)) {
        return {
          ...prev,
          existing_conditions: currentConditions.filter(c => c !== condition)
        };
      } else {
        return {
          ...prev,
          existing_conditions: [...currentConditions, condition]
        };
      }
    });
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 mb-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-white">Analyzing your data...</p>
        </div>
      )}
      
      <div className="max-w-4xl p-4 mx-auto md:p-6">
        <h2 className="mb-6 text-xl font-bold md:text-2xl">Health Risk Assessment Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields Section */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Patient Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Age</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.Age}
                  onChange={(e) => handleInputChange('Age', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700">Sex</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.Sex as string}
                  onChange={(e) => handleInputChange('Sex', e.target.value)}
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Heart Disease Fields */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Heart Disease Factors</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Chest Pain Type</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.ChestPainType as string}
                  onChange={(e) => handleInputChange('ChestPainType', e.target.value)}
                  required
                >
                  <option value="">Select Chest Pain Type</option>
                  <option value="ATA">Atypical Angina (ATA)</option>
                  <option value="NAP">Non-Anginal Pain (NAP)</option>
                  <option value="ASY">Asymptomatic (ASY)</option>
                  <option value="TA">Typical Angina (TA)</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Resting Blood Pressure</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.RestingBP}
                  onChange={(e) => handleInputChange('RestingBP', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Cholesterol</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.Cholesterol}
                  onChange={(e) => handleInputChange('Cholesterol', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Fasting Blood Sugar</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.FastingBS as string}
                  onChange={(e) => handleInputChange('FastingBS', e.target.value)}
                  required
                >
                  <option value="">Select Fasting Blood Sugar</option>
                  <option value="0">Less than 120 mg/dl</option>
                  <option value="1">Greater than 120 mg/dl</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Resting ECG</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.RestingECG as string}
                  onChange={(e) => handleInputChange('RestingECG', e.target.value)}
                  required
                >
                  <option value="">Select Resting ECG</option>
                  <option value="Normal">Normal</option>
                  <option value="ST">ST Wave Abnormality</option>
                  <option value="LVH">Left Ventricular Hypertrophy</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Maximum Heart Rate</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.MaxHR}
                  onChange={(e) => handleInputChange('MaxHR', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Exercise Induced Angina</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.ExerciseAngina as string}
                  onChange={(e) => handleInputChange('ExerciseAngina', e.target.value)}
                  required
                >
                  <option value="">Select Exercise Angina</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">ST Depression</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.Oldpeak}
                  onChange={(e) => handleInputChange('Oldpeak', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">ST Slope</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.ST_Slope as string}
                  onChange={(e) => handleInputChange('ST_Slope', e.target.value)}
                  required
                >
                  <option value="">Select ST Slope</option>
                  <option value="Up">Upsloping</option>
                  <option value="Flat">Flat</option>
                  <option value="Down">Downsloping</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gastric Cancer Fields */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Gastric Cancer Risk Factors</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Alcohol Consumption</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.alcohol_consumption as string}
                  onChange={(e) => handleInputChange('alcohol_consumption', e.target.value)}
                  required
                >
                  <option value="">Select Alcohol Consumption</option>
                  <option value="None">None</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">CT Scan Results</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.ct_scan as string}
                  onChange={(e) => handleInputChange('ct_scan', e.target.value)}
                  required
                >
                  <option value="">Select CT Scan Result</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                  <option value="Clear">Clear</option>
                  <option value="Suspicious">Suspicious</option>
                  <option value="Not available">Not available</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Dietary Habits</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.dietary_habits as string}
                  onChange={(e) => handleInputChange('dietary_habits', e.target.value)}
                  required
                >
                  <option value="">Select Dietary Habits</option>
                  <option value="Mixed">Mixed/Regular</option>
                  <option value="High-salt">High-salt</option>
                  <option value="High-processed">High-processed foods</option>
                  <option value="High-preserved">High-preserved foods</option>
                  <option value="Plant-based">Plant-based</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Geographical Location</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.geographical_location as string}
                  onChange={(e) => handleInputChange('geographical_location', e.target.value)}
                  required
                >
                  <option value="">Select Geographical Location</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                  <option value="Coastal">Coastal</option>
                  <option value="Mountains">Mountains</option>
                  <option value="Eastern Asia">Eastern Asia</option>
                  <option value="Western Europe">Western Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Smoking Habits</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.smoking_habits as string}
                  onChange={(e) => handleInputChange('smoking_habits', e.target.value)}
                  required
                >
                  <option value="">Select Smoking Habits</option>
                  <option value="Non-smoker">Non-smoker</option>
                  <option value="Former smoker">Former smoker</option>
                  <option value="Light smoker">Light smoker</option>
                  <option value="Heavy smoker">Heavy smoker</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Biopsy Results</label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.biopsy_results as string}
                  onChange={(e) => handleInputChange('biopsy_results', e.target.value)}
                  required
                >
                  <option value="">Select Biopsy Results</option>
                  <option value="Negative">Negative</option>
                  <option value="Positive">Positive</option>
                  <option value="Inconclusive">Inconclusive</option>
                  <option value="Not available">Not available</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Family History of Gastric Cancer</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="family_history"
                      checked={formData.family_history === true}
                      onChange={() => handleInputChange('family_history', true)}
                      className="text-red-500 focus:ring-red-500"
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="family_history"
                      checked={formData.family_history === false}
                      onChange={() => handleInputChange('family_history', false)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Existing Conditions</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['gastritis', 'ulcer', 'h_pylori', 'gerd', 'IBD'].map((condition) => (
                    <label key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.existing_conditions) && formData.existing_conditions.includes(condition)}
                        onChange={() => handleExistingConditionsChange(condition)}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <span>{condition === 'h_pylori' ? 'H. Pylori' : 
                             condition === 'gerd' ? 'GERD' : 
                             condition === 'IBD' ? 'IBD' : 
                             condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit for Analysis'}
          </button>
        </form>
      </div>
    </>
  );
}

export default PredictionForm;