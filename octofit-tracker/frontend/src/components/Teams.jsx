import { useEffect, useState } from 'react'
import { API_BASE_URL, getCollection } from '../api.js'
import ResourceTable from './ResourceTable.jsx'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        setTeams(getCollection(await response.json()))
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadTeams()
    return () => controller.abort()
  }, [])

  return (
    <section className="card data-card">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Teams</h2>
        <p className="text-body-secondary mb-4">Find your crew and keep each other moving.</p>
        {loading ? <p role="status">Loading teams…</p> : null}
        {error ? <p className="alert alert-danger" role="alert">Could not load teams: {error}</p> : null}
        {!loading && !error ? (
          <ResourceTable
            columns={[
              { key: 'name', label: 'Team' },
              { key: 'description', label: 'About' },
              { key: 'points', label: 'Points' },
            ]}
            records={teams}
          />
        ) : null}
      </div>
    </section>
  )
}

export default Teams
