import { useEffect, useState } from 'react'
import { API_BASE_URL, getCollection } from '../api.js'
import ResourceTable from './ResourceTable.jsx'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        setEntries(getCollection(await response.json()))
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadLeaderboard()
    return () => controller.abort()
  }, [])

  return (
    <section className="card data-card">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Leaderboard</h2>
        <p className="text-body-secondary mb-4">Recognizing consistent effort and team spirit.</p>
        {loading ? <p role="status">Loading leaderboard…</p> : null}
        {error ? <p className="alert alert-danger" role="alert">Could not load leaderboard: {error}</p> : null}
        {!loading && !error ? (
          <ResourceTable
            columns={[
              { key: 'rank', label: 'Rank' },
              { key: 'user', label: 'Athlete' },
              { key: 'team', label: 'Team' },
              { key: 'points', label: 'Points' },
            ]}
            records={entries}
          />
        ) : null}
      </div>
    </section>
  )
}

export default Leaderboard
