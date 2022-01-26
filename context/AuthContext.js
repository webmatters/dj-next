import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { NEXT_URL } from '../config/index'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Register user
  const register = async user => {
    console.log(user)
  }

  const login = async ({ email: identifier, password }) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/login`, {
        identifier,
        password,
      })
      setUser(res.data.user)
    } catch (err) {
      console.log('Login error: ', err.response.data.error)
      setErrorMessage(err.response.data.error)
      setErrorMessage(null)
    }
  }

  // Log out user
  const logout = async () => {
    console.log('logout')
  }

  // Check if user is logged in
  const checkUserLoggedIn = async user => {
    console.log('Check')
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
