import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { NEXT_URL } from '../config/index'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const router = useRouter()

  useEffect(() => checkUserLoggedIn(), [])

  const register = async user => {
    console.log('Register was called: ', user)
    try {
      const { data } = await axios.post(`${NEXT_URL}/api/register`, user)
      setUser(data.user)
      router.push('/account/dashboard')
    } catch (err) {
      console.log('Registration error: ', err.response.data.error)
      setErrorMessage(err.response.data.error)
      setErrorMessage(null)
    }
  }

  const login = async ({ email: identifier, password }) => {
    try {
      const { data } = await axios.post(`${NEXT_URL}/api/login`, {
        identifier,
        password,
      })
      setUser(data.user)
      router.push('/account/dashboard')
    } catch (err) {
      console.log('Login error: ', err.response.data.error)
      setErrorMessage(err.response.data.error)
      setErrorMessage(null)
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${NEXT_URL}/api/logout`)
      setUser(null)
      router.push('/')
    } catch (err) {
      console.log('Logout error: ', err)
      setErrorMessage(err)
      setErrorMessage(null)
    }
  }

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get(`${NEXT_URL}/api/user`)
      console.log('checkUserLoggedIn: ', data)
      setUser(data.user)
    } catch (err) {
      console.log('checkUserLoggedIn error: ', err)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, errorMessage, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
