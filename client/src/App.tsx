import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

export default function App() {
  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">GinConnect</Link>
          <div className="space-x-3">
            <Link to="/signup" className="text-brand">Sign Up</Link>
            <Link to="/signin" className="text-brand">Sign In</Link>
          </div>
        </div>
      </nav>
      <main className="container py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </div>
  )
}
