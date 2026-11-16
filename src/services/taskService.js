import { isSupabaseConfigured, supabase } from './supabaseClient.js'

const demoTasks = [
  {
    id: 'demo-1',
    title: 'Review proposal skripsi',
    description: 'Tinjau outline dan prioritas konten untuk bab pendahuluan.',
    category: 'Akademik',
    priority: 'Tinggi',
    due_date: '2026-11-18',
    is_completed: false,
    created_at: '2026-11-12T08:00:00.000Z',
    updated_at: '2026-11-12T08:00:00.000Z',
  },
  {
    id: 'demo-2',
    title: 'Menyiapkan meeting tim',
    description: 'Buat agenda rapat dan catat target minggu ini.',
    category: 'Kerja',
    priority: 'Sedang',
    due_date: '2026-11-20',
    is_completed: true,
    created_at: '2026-11-13T10:30:00.000Z',
    updated_at: '2026-11-13T11:00:00.000Z',
  },
]

const normalizeTask = (task) => ({
  ...task,
  description: task.description ?? '',
  category: task.category ?? 'Umum',
  priority: task.priority ?? 'Sedang',
  due_date: task.due_date ?? null,
  is_completed: Boolean(task.is_completed),
})

const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const aDate = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER
    const bDate = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER
    if (a.is_completed !== b.is_completed) {
      return Number(a.is_completed) - Number(b.is_completed)
    }
    return aDate - bDate
  })

const getDemoTasks = () => sortTasks(demoTasks.map(normalizeTask))

export async function fetchTasks() {
  if (!isSupabaseConfigured || !supabase) {
    return getDemoTasks()
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return sortTasks((data ?? []).map(normalizeTask))
}

export async function createTask(taskInput) {
  const payload = normalizeTask({
    ...taskInput,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (!isSupabaseConfigured || !supabase) {
    const newTask = {
      ...payload,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `demo-${Date.now()}`,
    }
    demoTasks.unshift(newTask)
    return normalizeTask(newTask)
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        priority: payload.priority,
        due_date: payload.due_date,
        is_completed: payload.is_completed,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return normalizeTask(data)
}

export async function updateTask(taskId, updates) {
  const payload = normalizeTask({
    ...updates,
    updated_at: new Date().toISOString(),
  })

  if (!isSupabaseConfigured || !supabase) {
    const taskIndex = demoTasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task tidak ditemukan dalam mode demo.')
    }

    const task = demoTasks[taskIndex]
    demoTasks[taskIndex] = normalizeTask({
      ...task,
      ...payload,
      id: taskId,
      updated_at: new Date().toISOString(),
    })
    return demoTasks[taskIndex]
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      due_date: payload.due_date,
      is_completed: payload.is_completed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return normalizeTask(data)
}

export async function toggleTaskStatus(taskId) {
  const currentTask = demoTasks.find((task) => task.id === taskId)

  if (!isSupabaseConfigured || !supabase) {
    if (!currentTask) {
      throw new Error('Task tidak ditemukan dalam mode demo.')
    }

    return updateTask(taskId, {
      ...currentTask,
      is_completed: !currentTask.is_completed,
    })
  }

  const { data: taskData } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (!taskData) {
    throw new Error('Task tidak ditemukan untuk diubah statusnya.')
  }

  return updateTask(taskId, {
    ...taskData,
    is_completed: !taskData.is_completed,
  })
}

export async function deleteTask(taskId) {
  if (!isSupabaseConfigured || !supabase) {
    const taskIndex = demoTasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task tidak ditemukan dalam mode demo.')
    }
    demoTasks.splice(taskIndex, 1)
    return taskId
  }

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) {
    throw error
  }

  return taskId
}
