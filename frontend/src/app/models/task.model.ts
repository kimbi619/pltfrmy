export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'Low' | 'Medium' | 'High';
  due_date?: string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
  google_calendar_event?: any;
  user_id?: string;
  subtasks?: Subtask[];
  categories?: Category[];
  category?: string | Category;
  tags?: (string | Tag)[];
  comments?: Comment[];
  parent?: number;
  isNew?: boolean;
}

export interface Subtask {
  id?: number;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  priority?: string;
  due_date?: string;
  start_date?: string;
  created_at?: string;
  updated_at?: string;
  task_id?: number;
  completed?: boolean; 
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface Tag {
  id?: number;
  name: string;
  color?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  task_id: number;
}

export interface TaskRequest {
  title: string;
  description?: string;
  category?: string; 
  due_date?: string;
  start_date?: string;
  status?: string;
  priority?: string;
  tags?: string[];  
  parent?: number;
}