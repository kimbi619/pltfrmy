import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type { Todo } from "../models/todo.model"
import type { List } from "../models/list.model"

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      title: "Research content ideas",
      completed: false,
      date: null,
      list: null,
      tags: [],
    },
    {
      id: 2,
      title: "Create a database of guest authors",
      completed: false,
      date: null,
      list: null,
      tags: [],
    },
    {
      id: 3,
      title: "Renew driver's license",
      completed: false,
      date: new Date("2022-03-22"),
      subtasks: 1,
      list: { id: 1, name: "Personal", color: "#ff6b6b" },
      tags: [],
    },
    {
      id: 4,
      title: "Consult accountant",
      completed: false,
      date: null,
      subtasks: 1,
      list: { id: 3, name: "List 1", color: "#ffd166" },
      tags: [],
    },
    {
      id: 5,
      title: "Print business card",
      completed: false,
      date: null,
      list: null,
      tags: [],
    },
  ]

  private lists: List[] = [
    { id: 1, name: "Personal", color: "#ff6b6b", count: 3 },
    { id: 2, name: "Work", color: "#4ecdc4", count: 8 },
    { id: 3, name: "List 1", color: "#ffd166", count: 3 },
  ]

  private activeViewSubject = new BehaviorSubject<string>("today")
  activeView$ = this.activeViewSubject.asObservable()

  private activeListSubject = new BehaviorSubject<number | null>(null)
  activeList$ = this.activeListSubject.asObservable()

  constructor() {}

  getTodos(): Todo[] {
    const activeView = this.activeViewSubject.getValue()
    const activeList = this.activeListSubject.getValue()

    if (activeList) {
      return this.todos.filter((todo) => todo.list && todo.list.id === activeList)
    }

    if (activeView === "today") {
      return this.todos
    } else if (activeView === "upcoming") {
      return this.todos.filter((todo) => todo.date && todo.date > new Date())
    }

    return this.todos
  }

  addTodo(todo: Todo) {
    this.todos.push(todo)
  }

  toggleTodoComplete(todoId: number) {
    const todo = this.todos.find((t) => t.id === todoId)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  setActiveView(view: string) {
    this.activeViewSubject.next(view)
    this.activeListSubject.next(null)
  }

  setActiveList(listId: number) {
    this.activeListSubject.next(listId)
  }

  getListById(listId: number): List | undefined {
    return this.lists.find((list) => list.id === listId)
  }
}

