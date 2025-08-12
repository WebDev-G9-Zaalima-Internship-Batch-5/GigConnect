import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to GinConnect</h1>
      <p className="text-gray-600 mb-6">Modern React + TypeScript starter with auth pages.</p>
      <div className="space-x-3">
        <Link to="/signup" className="btn">Create account</Link>
        <Link to="/signin" className="btn border border-gray-200 text-brand">Login</Link>
      </div>
    </div>
  )
}
