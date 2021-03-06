import Link from 'next/link'

export default function Pagination({ page, pageCount }) {
  return (
    <div>
      {page > 1 && (
        <Link href={`/events?page=${page - 1}`}>
          <a className="btn-secondary">Previous</a>
        </Link>
      )}
      {page < pageCount && (
        <Link href={`/events?page=${page + 1}`}>
          <a className="btn-secondary">Next</a>
        </Link>
      )}
    </div>
  )
}
