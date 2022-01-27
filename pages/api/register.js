import axios from 'axios'
import cookie from 'cookie'

import { API_URL } from '@/config/index'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Strapi register: ', req.body)
    const { username, email, password } = req.body
    try {
      const { data } = await axios.post(`${API_URL}/auth/local/register`, {
        username,
        email,
        password,
      })

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/',
        })
      )
      res.status(200).json({ user: data.user })
    } catch (error) {
      console.log(error.response.data.error.details)
      if (error.response.data.error.details.errors) {
        let errors = ''
        error.response.data.error.details.errors.forEach(error => {
          errors += ` ${error.message}`
        })

        res.status(error.response.data.error.status).json({ error: errors })
      } else {
        res
          .status(error.response.data.error.status)
          .json({ error: error.response.data.error.message })
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} is not allowed.` })
  }
}
