import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'

type SignInForm = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6,'Minimum 6 characters').required('Password required')
}).required()

export default function SignIn() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({ resolver: yupResolver(schema) })

  const onSubmit = (data: SignInForm) => {
    setError('')
    const users = JSON.parse(localStorage.getItem('users' ) || '[]')
    const user = users.find((u: any) => u.email === data.email && u.password === data.password)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      navigate('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="container">
      <div className="card max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 small">Email</label>
            <input {...register('email')} className="input" />
            <div className="text-red-600 text-sm">{errors.email?.message}</div>
          </div>
          <div>
            <label className="block mb-1 small">Password</label>
            <input {...register('password')} type="password" className="input" />
            <div className="text-red-600 text-sm">{errors.password?.message}</div>
          </div>
          <div className="flex items-center justify-between">
            <button className="btn" type="submit">Sign In</button>
            <a className="small text-gray-600">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  )
}
