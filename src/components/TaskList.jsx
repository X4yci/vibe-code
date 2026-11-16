import TaskItem from './TaskItem'
import './TaskList.css'

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <p>Tidak ada tugas yang sesuai dengan filter saat ini.</p>
      </div>
    )
  }

  return (
    <div className="task-list" aria-live="polite">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
