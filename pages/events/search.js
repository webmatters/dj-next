import axios from 'axios'
import qs from 'qs'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import { API_URL } from '@/config/index'

export default function SearchPage({ events }) {
  const router = useRouter()
  return (
    <div>
      <Layout title="Search Results">
        <Link href={'/events'}>Go Back</Link>
        <h1>Search Results for "{router.query.term}"</h1>
        {events.length === 0 && <h3>No Events Found</h3>}
        {events.map(evt => (
          <EventItem key={evt.id} evt={evt.attributes} />
        ))}
      </Layout>
    </div>
  )
}

export async function getServerSideProps({ query: { term } }) {
  const queryString = qs.stringify(
    {
      filters: {
        $or: [
          {
            name: {
              $contains: term,
            },
          },
          {
            performers: {
              $contains: term,
            },
          },
          {
            description: {
              $contains: term,
            },
          },
          {
            venue: {
              $contains: term,
            },
          },
        ],
      },
      populate: 'image',
    },
    {
      encodeValuesOnly: true,
    }
  )

  const url = `${API_URL}/events?${queryString}`

  const {
    data: { data: events },
  } = await axios.get(url)
  return {
    props: { events },
  }
}
