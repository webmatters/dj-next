import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import qs from 'qs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'
import Layout from '@/components/Layout'

export default function EventPage({ evt }) {
  const { date, time, name, image, performers, description, venue, address } =
    evt.attributes

  const router = useRouter()

  const deleteEvent = async event => {
    if (confirm('Are you sure?')) {
      try {
        const res = await axios.delete(`${API_URL}/events/${evt.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        router.push('/events')
      } catch (error) {
        console.error('There was an error!', error?.response?.data?.error)
        toast.error(error?.response?.data?.error?.message)
      }
    }
  }

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt />
              Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>

        <span>
          {new Date(date).toLocaleDateString('en-US')} at {time}
          <h1>{name}</h1>
          <ToastContainer />
          {image && (
            <div className={styles.image}>
              <Image
                src={
                  image?.data?.attributes?.formats?.medium?.url ||
                  '/images/event-default.png'
                }
                width={960}
                height={600}
                alt={evt.name}
              />
            </div>
          )}
          <h3>Performers: </h3>
          <p>{performers}</p>
          <h3>Description: </h3>
          <p>{description}</p>
          <h3>Venue: {venue}</h3>
          <p>{address}</p>
          <Link href={'/events'}>
            <a className={styles.back}>{'<'} Go Back</a>
          </Link>
        </span>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ query: { slug } }) {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: 'image',
    },
    {
      encodeValuesOnly: true,
    }
  )

  const url = `${API_URL}/events?${query}`

  const {
    data: { data: events },
  } = await axios.get(url)
  return {
    props: { evt: events[0] },
  }
}
