import { useEffect, useState } from 'react'
import { API_BASE_URL, getCollection } from '../api.js'
import ResourceTable from './ResourceTable.jsx'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        setActivities(getCollection(await response.json()))
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadActivities()
    return () => controller.abort()
  }, [])

  return (
    <section className="card data-card">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Activities</h2>
        <p className="text-body-secondary mb-4">Recent movement from your community.</p>
        {loading ? <p role="status">Loading activities…</p> : null}
        {error ? <p className="alert alert-danger" role="alert">Could not load activities: {error}</p> : null}
        {!loading && !error ? (
          <ResourceTable
            columns={[
              { key: 'type', label: 'Activity' },
              { key: 'durationMinutes', label: 'Minutes' },
              { key: 'points', label: 'Points' },
              { key: 'date', label: 'Date' },
            ]}
            records={activities}
          />
        ) : null}
      </div>
    </section>
  )
}

export default Activities
