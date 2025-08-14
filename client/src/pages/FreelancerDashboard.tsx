import React from 'react';
import { Link } from 'react-router-dom';

const FreelancerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">GigConnect</div>
              <div className="hidden md:flex space-x-6 ml-10">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link to="/jobs" className="text-gray-700 hover:text-blue-600">Find Jobs</Link>
                <Link to="/proposals" className="text-gray-700 hover:text-blue-600">Proposals</Link>
                <Link to="/messages" className="text-gray-700 hover:text-blue-600">Messages</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="Profile" />
                  <span className="text-gray-700">John Doe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$15,750</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">Completed Projects</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">Active Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Projects */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
                  <div className="space-y-6">
                    {[1, 2].map((project) => (
                      <div key={project} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">E-commerce Website Development</h3>
                            <p className="text-gray-600 mt-1">Client: Digital Solutions Inc.</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Due in 15 days
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                $4,500
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            In Progress
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Gigs */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
                    <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {[1, 2, 3].map((gig) => (
                      <div key={gig} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Senior Web Developer Needed</h3>
                            <p className="text-gray-600 mt-1">Looking for an experienced web developer for a long-term project</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">React</span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Node.js</span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">MongoDB</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-green-600">$50-70/hr</span>
                            <p className="text-sm text-gray-500 mt-1">Posted 2 days ago</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <img
                    className="h-24 w-24 rounded-full mx-auto"
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">John Doe</h2>
                  <p className="text-gray-600">Full Stack Developer</p>
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-gray-900">4.9</span>
                    <span className="text-gray-600">(120 reviews)</span>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="text-gray-900 font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    Complete Profile
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">AWS</span>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                <div className="space-y-4">
                  {[1, 2].map((deadline) => (
                    <div key={deadline} className="flex items-start space-x-4">
                      <div className="bg-red-100 text-red-600 p-2 rounded">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Project Milestone Due</p>
                        <p className="text-sm text-gray-600">Frontend Development</p>
                        <p className="text-sm text-red-600 mt-1">Due in 2 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
