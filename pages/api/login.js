import { API_URL } from '@/config/index'
import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { identifier, password } = req.body
    try {
      const { data } = await axios.post(`${API_URL}/auth/local`, {
        identifier,
        password,
      })

      console.log('JWT: ', data.jwt)
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
