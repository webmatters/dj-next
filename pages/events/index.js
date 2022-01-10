import qs from 'qs'
import axios from 'axios'

import { API_URL } from '@/config/index'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'

export default function EventsPage({ events }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No Events to Show</h3>}
      {events.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  )
}

export async function getStaticProps() {
  const query = qs.stringify(
    {
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
    props: { events },
    revalidate: 1,
  }
}
