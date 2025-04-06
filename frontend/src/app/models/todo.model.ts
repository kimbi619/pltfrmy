export interface Todo {
    id: number
    title: string
    completed: boolean
    date: Date | null
    subtasks?: number
    list: {
      id: number
      name: string
      color: string
    } | null
    tags: {
      id: number
      name: string
      color: string
    }[]
  }
  
  