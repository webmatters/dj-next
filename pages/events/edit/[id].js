import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import qs from 'qs'
import { FaImage } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'

export default function EditEventPage({ evt }) {
  const {
    date,
    time,
    name,
    image,
    performers,
    description,
    venue,
    address,
    slug,
  } = evt.attributes

  // image: {
  //   data: {
  //     attributes: { formats },
  //   },
  // },

  const [values, setValues] = useState({
    name,
    performers,
    venue,
    address,
    date,
    time,
    description,
  })

  const [imagePreview, setImagePreview] = useState(
    evt.attributes.image
      ? image.data?.attributes?.formats?.thumbnail?.url
      : null
  )

  const [showModal, setShowModal] = useState(false)

  const router = useRouter()

  const handleSubmit = async event => {
    event.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(element => element === '')

    if (hasEmptyFields) {
      toast.error('All fields are required.')
    }

    try {
      await axios.put(
        `${API_URL}/events/${evt.id}`,
        { data: values },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      router.push(`/events/${slug}`)
    } catch (error) {
      toast.error(error?.response?.data?.error?.message)
    }
  }

  const handleInputChange = event => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  const imageUploaded = async e => {
    const query = qs.stringify(
      {
        populate: 'image',
      },
      {
        encodeValuesOnly: true,
      }
    )

    try {
      const { data } = await axios.get(`${API_URL}/events/${evt.id}?${query}`)

      setImagePreview(
        data?.data?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url
      )
      setShowModal(false)
    } catch (error) {
      toast.error(error?.response?.data?.error?.message)
    }
  }

  return (
    <Layout title="Add New Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Performers</label>
            <input
              type="text"
              id="performers"
              name="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={moment(values.date).format('yyyy-MM-DD')}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="name">Time</label>
            <input
              type="text"
              id="time"
              name="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <input type="submit" value="Update Event" className="btn" />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} alt="" />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
      <div>
        <button className="btn-secondary" onClick={() => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const query = qs.stringify(
    {
      populate: 'image',
    },
    {
      encodeValuesOnly: true,
    }
  )

  const { data } = await axios.get(`${API_URL}/events/${id}?${query}`)

  return {
    props: { evt: data.data },
  }
}
