import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect with Top Freelancers & Clients
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              The professional platform where talent meets opportunity
            </p>
            <div className="space-x-4">
              <Button variant="white" to="/signup" as={Link}>
                Find Work/Hire Talent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Freelancers */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">For Freelancers</h2>
              <p className="text-lg text-gray-600">
                Find exciting projects and connect with clients looking for your skills.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Access global opportunities</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Showcase your portfolio</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Get paid securely</span>
                </li>
              </ul>
            </div>

            {/* For Clients */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">For Clients</h2>
              <p className="text-lg text-gray-600">
                Post projects and hire talented professionals from around the world.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Post projects easily</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Find top talent quickly</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Work with the best</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Secure Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Safe payments and continuous support throughout your project. We ensure your work and payments are protected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
