import './TaskItem.css'

const priorityMap = {
  Tinggi: 'priority-high',
  Sedang: 'priority-medium',
  Rendah: 'priority-low',
}

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Tanpa tenggat waktu'
  }

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-card ${task.is_completed ? 'completed' : ''}`}>
      <div className="task-main">
        <div className="task-check-wrap">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggle(task.id)}
            aria-label={`Tandai ${task.title} sebagai selesai`}
          />
        </div>

        <div className="task-copy">
          <div className="task-header-row">
            <h3>{task.title}</h3>
            <span className={`priority-badge ${priorityMap[task.priority] ?? 'priority-medium'}`}>
              {task.priority}
            </span>
          </div>

          {task.description && <p className="description">{task.description}</p>}

          <div className="meta-row">
            <span className="meta-pill">{task.category}</span>
            <span className="meta-text">{formatDate(task.due_date)}</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="icon-button edit-button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="icon-button delete-button" onClick={() => onDelete(task.id)}>
          Hapus
        </button>
      </div>
    </article>
  )
}
