import axios from 'axios'
import cookie from 'cookie'

import { API_URL } from '@/config/index'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.headers.cookie) {
      res.status(403).json({ message: 'Not Authorized' })
      return
    }

    const { token } = cookie.parse(req.headers.cookie)
    console.log('token: ', token)

    try {
      const { data: user } = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Strapi me response: ', user)
      res.status(200).json({ user })
    } catch (error) {
      console.log('Strapi Me error: ', error.response.data.error)
      res
        .status(error.response.data.error.status)
        .json({ error: error.response.data.error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed.` })
  }
}
