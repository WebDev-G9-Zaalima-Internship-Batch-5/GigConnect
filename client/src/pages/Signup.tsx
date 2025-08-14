import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'freelancer',
  });

  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your signup logic here
    console.log('Signup form submitted:', formData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <div className="relative">
                  <div className="overflow-hidden h-2 flex rounded bg-gray-200">
                    <div
                      style={{ width: `${(step / 3) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                    ></div>
                  </div>
                  <div className="flex justify-between -mt-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      1
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                      I want to
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: 'freelancer' })}
                        className={`p-4 border rounded-lg text-center ${
                          formData.userType === 'freelancer'
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Find Work
                        <p className="text-sm text-gray-500">Work as a freelancer</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: 'client' })}
                        className={`p-4 border rounded-lg text-center ${
                          formData.userType === 'client'
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Hire Talent
                        <p className="text-sm text-gray-500">Hire freelancers</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Terms and Privacy */}
          <p className="mt-6 text-center text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
