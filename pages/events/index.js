import qs from 'qs'
import axios from 'axios'

import { API_URL, PER_PAGE } from '@/config/index'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import Pagination from '@/components/Pagination'

export default function EventsPage({ events, page, pageCount }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No Events to Show</h3>}
      {events.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
      <Pagination page={page} pageCount={pageCount} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  const query = qs.stringify(
    {
      populate: 'image',
      pagination: {
        page,
        pageSize: PER_PAGE,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const url = `${API_URL}/events?${query}`

  const res = await axios.get(url)

  return {
    props: {
      events: res.data.data,
      page: res.data.meta.pagination.page,
      pageCount: res.data.meta.pagination.pageCount,
    },
  }
}
