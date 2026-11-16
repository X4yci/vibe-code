import './TaskFilter.css'

export default function TaskFilter({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value })
  }

  return (
    <section className="filter-panel" aria-label="Filter tugas">
      <div className="field search-field">
        <label htmlFor="search">Cari tugas</label>
        <input
          id="search"
          name="search"
          type="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Judul tugas"
        />
      </div>

      <div className="field compact-field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handleChange}>
          <option value="Semua">Semua</option>
          <option value="Belum Selesai">Belum Selesai</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <div className="field compact-field">
        <label htmlFor="priority">Prioritas</label>
        <select id="priority" name="priority" value={filters.priority} onChange={handleChange}>
          <option value="Semua">Semua</option>
          <option value="Tinggi">Tinggi</option>
          <option value="Sedang">Sedang</option>
          <option value="Rendah">Rendah</option>
        </select>
      </div>
    </section>
  )
}
