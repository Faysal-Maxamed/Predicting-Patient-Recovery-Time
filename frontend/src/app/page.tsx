"use client";

import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, HeartPulse, User, PlusCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DIAGNOSIS_MAPPING = {
  "Cancer": 0,
  "Cardiovascular Disease": 1,
  "Diabetes": 2,
  "Emergency Condition": 3,
  "Gastrointestinal Disease": 4,
  "Hypertension": 5,
  "Infectious Disease": 6,
  "Kidney Disease": 7,
  "Neurological Disease": 8,
  "Orthopedic Injury": 9,
  "Other": 10,
  "Pregnancy & Obstetrics": 11,
  "Respiratory Disease": 12,
  "Trauma": 13,
  "Urinary Disease": 14
};

export default function PredictPage() {
  const [formData, setFormData] = useState({
    Age: '',
    SPO2: '',
    Body_Temperature: '',
    Systolic_BP: '',
    Diastolic_BP: '',
    Sex: '1',
    ICU_Admission: '0',
    Diagnosis: '10' // Default to Other
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getAgeGroupEncoded = (age: number) => {
    if (age < 18) return 0; // Child
    if (age < 60) return 1; // Adult
    return 2; // Senior
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const age = parseInt(formData.Age);
    const payload = {
      Age: age,
      SPO2: parseFloat(formData.SPO2),
      'Body Temperature': parseFloat(formData.Body_Temperature),
      Systolic_BP: parseFloat(formData.Systolic_BP),
      Diastolic_BP: parseFloat(formData.Diastolic_BP),
      Sex_Encoded: parseInt(formData.Sex),
      ICU_Encoded: parseInt(formData.ICU_Admission),
      Age_Group_Encoded: getAgeGroupEncoded(age),
      Diagnosis_Encoded: parseInt(formData.Diagnosis)
    };

    try {
      // Connect to Flask API
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Cillad ayaa dhacday, fadlan hubi in API-gu shaqeynayo (Port 5000).');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Header & Info */}
        <div className="w-full md:w-1/3 bg-blue-600 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-10 h-10" />
              <h1 className="text-3xl font-bold">HealthAI</h1>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed">
              Mishiinka casriga ah ee saadaaliya bogsashada bukaanka. Geli xogta bukaanka si aad u ogaato haddii uu u baahan yahay daryeel dheeraad ah.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-blue-100">
              <PlusCircle className="w-5 h-5" />
              <span>Smart Age Detection</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <HeartPulse className="w-5 h-5" />
              <span>Live Vitals Analysis</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Xogta Bukaanka (Patient Vitals)</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Da'da (Age)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input required type="number" name="Age" value={formData.Age} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tusaale: 45" />
                </div>
              </div>

              {/* Sex */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jinsiga (Sex)</label>
                <select name="Sex" value={formData.Sex} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="1">Lab (Male)</option>
                  <option value="0">Dhedig (Female)</option>
                </select>
              </div>

              {/* SPO2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ogsajiinta (SPO2 %)</label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input required type="number" step="0.1" name="SPO2" value={formData.SPO2} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tusaale: 98" />
                </div>
              </div>

              {/* Body Temp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xummadda (Body Temp °C)</label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input required type="number" step="0.1" name="Body_Temperature" value={formData.Body_Temperature} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tusaale: 37.5" />
                </div>
              </div>

              {/* Systolic BP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dhiigkar Kore (Systolic BP)</label>
                <input required type="number" name="Systolic_BP" value={formData.Systolic_BP} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tusaale: 120" />
              </div>

              {/* Diastolic BP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dhiigkar Hoose (Diastolic BP)</label>
                <input required type="number" name="Diastolic_BP" value={formData.Diastolic_BP} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tusaale: 80" />
              </div>

              {/* ICU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ma la dhigay ICU?</label>
                <select name="ICU_Admission" value={formData.ICU_Admission} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="0">Maya (No)</option>
                  <option value="1">Haa (Yes)</option>
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cudurka (Diagnosis)</label>
                <select name="Diagnosis" value={formData.Diagnosis} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {Object.entries(DIAGNOSIS_MAPPING).map(([name, code]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition duration-200 flex justify-center items-center gap-2"
            >
              {loading ? 'Falanqaynayaa...' : 'Saadaali Xaaladda Bukaanka'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className={`mt-6 p-6 rounded-xl border-l-4 shadow-sm flex items-start gap-4 transition-all duration-500 ${result.prediction_code === 1 ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}>
              <div className={`p-2 rounded-full ${result.prediction_code === 1 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {result.prediction_code === 1 ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${result.prediction_code === 1 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {result.prediction_text}
                </h3>
                <p className={`mt-1 font-medium ${result.prediction_code === 1 ? 'text-red-600/80' : 'text-emerald-600/80'}`}>
                  {result.prediction_code === 1 
                    ? "Bukaankan wuxuu halis ugu jiraa inuu isbitaalka jiifo in ka badan todobaad (Prolonged). Wuxuu u baahan yahay daryeel gaar ah." 
                    : "Xaaladda bukaanku waa mid degan. Wuxuu si dhakhso ah uga bixi karaa isbitaalka (<= 7 days)."}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
