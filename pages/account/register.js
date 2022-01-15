import { FaUser } from 'react-icons/fa'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { API_URL } from '@/config/index'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/AuthForm.module.css'
import Layout from '@/components/Layout'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const { register, error } = useContext(AuthContext)

  const handleSubmit = e => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match')
      return
    }
    register({ username, email, password })
  }

  return (
    <Layout title="User Signup">
      <div className={styles.auth}>
        <h1>
          {' '}
          <FaUser /> Sign Up
        </h1>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
            />
          </div>
          <input type="submit" value="Sign Up" className="btn" />
        </form>
        <p>
          Already have an account? <Link href={`/account/login`}>Log In</Link>
        </p>
      </div>
    </Layout>
  )
}
