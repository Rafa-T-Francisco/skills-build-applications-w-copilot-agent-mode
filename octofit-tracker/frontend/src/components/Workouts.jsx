import { useEffect, useState } from 'react'
import { API_BASE_URL, getCollection } from '../api.js'
import ResourceTable from './ResourceTable.jsx'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        setWorkouts(getCollection(await response.json()))
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadWorkouts()
    return () => controller.abort()
  }, [])

  return (
    <section className="card data-card">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Workouts</h2>
        <p className="text-body-secondary mb-4">A little inspiration for your next session.</p>
        {loading ? <p role="status">Loading workouts…</p> : null}
        {error ? <p className="alert alert-danger" role="alert">Could not load workouts: {error}</p> : null}
        {!loading && !error ? (
          <ResourceTable
            columns={[
              { key: 'name', label: 'Workout' },
              { key: 'description', label: 'Description' },
              { key: 'difficulty', label: 'Difficulty' },
              { key: 'durationMinutes', label: 'Minutes' },
              { key: 'category', label: 'Category' },
            ]}
            records={workouts}
          />
        ) : null}
      </div>
    </section>
  )
}

export default Workouts
