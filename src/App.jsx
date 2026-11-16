import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import TaskFilter from './components/TaskFilter'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskStatus,
  updateTask,
} from './services/taskService'
import { isSupabaseConfigured } from './services/supabaseClient'
import './App.css'

const emptyFilters = {
  search: '',
  status: 'Semua',
  priority: 'Semua',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = async () => {
    setLoading(true)
    try {
      const response = await fetchTasks()
      setTasks(response)
      setError('')
    } catch (loadError) {
      setError('Gagal memuat tugas. Coba muat ulang halaman.')
      console.error(loadError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = filters.search.trim().toLowerCase()
      const matchesSearch =
        !query || task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
      const matchesStatus =
        filters.status === 'Semua' ||
        (filters.status === 'Selesai' && task.is_completed) ||
        (filters.status === 'Belum Selesai' && !task.is_completed)
      const matchesPriority = filters.priority === 'Semua' || task.priority === filters.priority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, filters])

  const stats = useMemo(() => {
    const total = tasks.length
    const active = tasks.filter((task) => !task.is_completed).length
    const completed = tasks.filter((task) => task.is_completed).length

    return { total, active, completed }
  }, [tasks])

  const handleSubmitTask = async (payload) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
      }

      setEditingTask(null)
      await loadTasks()
    } catch (submitError) {
      setError('Gagal menyimpan tugas. Periksa kembali data yang Anda masukkan.')
      console.error(submitError)
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      await toggleTaskStatus(taskId)
      await loadTasks()
    } catch (toggleError) {
      setError('Gagal mengubah status tugas.')
      console.error(toggleError)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')
    if (!confirmed) {
      return
    }

    try {
      await deleteTask(taskId)
      if (editingTask && editingTask.id === taskId) {
        setEditingTask(null)
      }
      await loadTasks()
    } catch (deleteError) {
      setError('Gagal menghapus tugas.')
      console.error(deleteError)
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="top-bar">
        <span className={`config-badge ${isSupabaseConfigured ? 'configured' : 'demo'}`}>
          {isSupabaseConfigured ? 'Supabase aktif' : 'Mode demo'}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <TaskStats total={stats.total} active={stats.active} completed={stats.completed} />

      <main className="main-layout">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmitTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section className="content-panel">
          <TaskFilter filters={filters} onChange={setFilters} />

          {loading ? (
            <div className="status-box">Memuat tugas...</div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
