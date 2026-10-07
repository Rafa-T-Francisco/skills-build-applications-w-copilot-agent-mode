function App() {
  return (
    <main className="container py-5">
      <header className="mb-5">
        <h1 className="display-5 fw-bold">OctoFit Tracker</h1>
        <p className="lead text-body-secondary">
          Your fitness journey, your team, your leaderboard.
        </p>
      </header>

      <section className="row g-4" aria-label="OctoFit features">
        {['Activities', 'Teams', 'Leaderboard', 'Workouts'].map((feature) => (
          <div className="col-12 col-sm-6 col-lg-3" key={feature}>
            <article className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h5 card-title">{feature}</h2>
                <p className="card-text text-body-secondary">
                  {feature === 'Activities'
                    ? 'Log and track your progress.'
                    : feature === 'Teams'
                      ? 'Reach your goals together.'
                      : feature === 'Leaderboard'
                        ? 'Celebrate your team’s achievements.'
                        : 'Find your next personalized workout.'}
                </p>
              </div>
            </article>
          </div>
        ))}
      </section>
    </main>
  )
}

export default App
