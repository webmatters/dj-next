import Link from 'next/link'
import axios from 'axios'
import qs from 'qs'

import { API_URL } from '@/config/index'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No Events to Show</h3>}
      {events.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
      {events.length > 0 && (
        <Link href="/events">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const query = qs.stringify(
    {
      populate: 'image',
      sort: ['date:asc'],
      pagination: {
        page: 1,
        pageSize: 3,
      },
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
    props: { events },
    revalidate: 1,
  }
}
