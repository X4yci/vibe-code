import './TaskStats.css'

export default function TaskStats({ total, active, completed }) {
  return (
    <section className="stats-grid" aria-label="Statistik tugas">
      <article className="stat-card">
        <span className="stat-label">Total</span>
        <strong>{total}</strong>
      </article>
      <article className="stat-card warn">
        <span className="stat-label">Aktif</span>
        <strong>{active}</strong>
      </article>
      <article className="stat-card success">
        <span className="stat-label">Selesai</span>
        <strong>{completed}</strong>
      </article>
    </section>
  )
}
