import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const pages = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/activities">
            <img className="brand-logo" src="/octofit-logo.png" alt="" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <nav className="nav app-nav" aria-label="Main navigation">
            {pages.map(({ label, path }) => (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-5">
        <div className="mb-4">
          <p className="text-uppercase small fw-semibold text-success mb-2">Move together</p>
          <h1 className="display-6 fw-bold mb-2">Your fitness, in focus.</h1>
          <p className="text-body-secondary mb-0">
            Track progress, support your team, and celebrate every milestone.
          </p>
        </div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate replace to="/activities" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
