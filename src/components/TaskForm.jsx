import { useEffect, useState } from 'react'
import './TaskForm.css'

const emptyForm = {
  title: '',
  description: '',
  category: 'Umum',
  priority: 'Sedang',
  due_date: '',
}

export default function TaskForm({ editingTask, onSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title ?? '',
        description: editingTask.description ?? '',
        category: editingTask.category ?? 'Umum',
        priority: editingTask.priority ?? 'Sedang',
        due_date: editingTask.due_date ?? '',
      })
      return
    }

    setFormData(emptyForm)
  }, [editingTask])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category || 'Umum',
      priority: formData.priority || 'Sedang',
      due_date: formData.due_date || null,
    })

    if (!editingTask) {
      setFormData(emptyForm)
    }
  }

  return (
    <section className="form-panel">
      <h2>{editingTask ? 'Edit Tugas' : 'Tambah Tugas'}</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="field">
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Menyelesaikan laporan mingguan"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tambahkan detail tugas..."
          />
        </div>

        <div className="two-column">
          <div className="field">
            <label htmlFor="category">Kategori</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Umum"
            />
          </div>

          <div className="field">
            <label htmlFor="priority">Prioritas</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Rendah">Rendah</option>
              <option value="Sedang">Sedang</option>
              <option value="Tinggi">Tinggi</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="due_date">Tenggat Waktu</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="actions">
          <button type="submit" className="primary-button">
            {editingTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
          </button>
          {editingTask && (
            <button type="button" className="secondary-button" onClick={onCancelEdit}>
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
