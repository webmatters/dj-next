import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { API_URL } from '../config/index.js'
import styles from '@/styles/Form.module.css'

export default function ImageUpload({ evtId, imageUploaded }) {
  const [image, setImage] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData()

    formData.append('files', image)
    formData.append('ref', 'api::event.event')
    formData.append('refId', evtId)
    formData.append('field', 'image')

    try {
      await axios.post(`${API_URL}/upload`, formData)
      imageUploaded()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.form}>
      <h1>Upload Event Image</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={e => setImage(e.target.files[0])} />
        </div>
        <input type="submit" value="Upload" className="btn" />
      </form>
    </div>
  )
}
