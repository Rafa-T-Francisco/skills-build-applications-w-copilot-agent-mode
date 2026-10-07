import { useEffect, useState } from 'react'
import { API_BASE_URL, getCollection } from '../api.js'
import ResourceTable from './ResourceTable.jsx'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        setUsers(getCollection(await response.json()))
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadUsers()
    return () => controller.abort()
  }, [])

  return (
    <section className="card data-card">
      <div className="card-body p-4">
        <h2 className="h4 mb-1">Users</h2>
        <p className="text-body-secondary mb-4">Meet the people on your fitness journey.</p>
        {loading ? <p role="status">Loading users…</p> : null}
        {error ? <p className="alert alert-danger" role="alert">Could not load users: {error}</p> : null}
        {!loading && !error ? (
          <ResourceTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'username', label: 'Username' },
              { key: 'email', label: 'Email' },
              { key: 'team', label: 'Team' },
            ]}
            records={users}
          />
        ) : null}
      </div>
    </section>
  )
}

export default Users
