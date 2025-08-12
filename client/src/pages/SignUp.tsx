import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'

type SignUpForm = {
  name: string
  email: string
  password: string
}

const schema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6,'Minimum 6 characters').required('Password required')
}).required()

export default function SignUp() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({ resolver: yupResolver(schema) })

  const onSubmit = (data: SignUpForm) => {
    setError('')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.find((u: any) => u.email === data.email)
    if (exists) {
      setError('Email already registered')
      return
    }
    users.push(data)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(data))
    navigate('/')
  }

  return (
    <div className="container">
      <div className="card max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 small">Full name</label>
            <input {...register('name')} className="input" />
            <div className="text-red-600 text-sm">{errors.name?.message}</div>
          </div>
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
            <button className="btn" type="submit">Create account</button>
            <a className="small text-gray-600">Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  )
}
