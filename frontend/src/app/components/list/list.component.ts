import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { TodoItemComponent } from "../task-item/task-item.component"
import type { TodoService } from "../../services/todo.service"
import type { Todo } from "../../models/todo.model"

@Component({
  selector: "app-list",
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  template: `
    <div class="todo-list-container">
      <div class="todo-list-header">
        <h1>{{ currentView }}</h1>
        <span class="todo-count">{{ todos.length }}</span>
      </div>
      
      <div class="add-task-container">
        <button class="add-task-btn" (click)="showAddTaskForm = !showAddTaskForm">
          <i class="fas fa-plus"></i>
          Add New Task
        </button>
      </div>
      
      <div *ngIf="showAddTaskForm" class="add-task-form">
        <input 
          type="text" 
          [(ngModel)]="newTaskTitle" 
          placeholder="Task title" 
          class="add-task-input"
        />
        <div class="add-task-actions">
          <button class="cancel-btn" (click)="cancelAddTask()">Cancel</button>
          <button class="save-btn" (click)="addTask()" [disabled]="!newTaskTitle.trim()">
            Save
          </button>
        </div>
      </div>
      
      <div class="todo-list">
        <app-todo-item 
          *ngFor="let todo of todos" 
          [todo]="todo"
          (toggleComplete)="toggleTodoComplete($event)"
          (openDetails)="openTodoDetails($event)"
        ></app-todo-item>
      </div>
    </div>
  `,
})
export class TodoListComponent implements OnInit {
  currentView = "Today"
  todos: Todo[] = []
  showAddTaskForm = false
  newTaskTitle = ""

  // constructor(private todoService: TodoService) {}

  ngOnInit() {
  }

  loadTodos() {
  }

  addTask() {
    // if (this.newTaskTitle.trim()) {
    //   this.todoService.addTodo({
    //     id: Date.now(),
    //     title: this.newTaskTitle,
    //     completed: false,
    //     date: new Date(),
    //     list: null,
    //     tags: [],
    //   })

    //   this.newTaskTitle = ""
    //   this.showAddTaskForm = false
    //   this.loadTodos()
    // }
  }

  cancelAddTask() {
    this.newTaskTitle = ""
    this.showAddTaskForm = false
  }

  toggleTodoComplete(todoId: number) {
    // this.todoService.toggleTodoComplete(todoId)
    // this.loadTodos()
  }

  openTodoDetails(todoId: number) {
    console.log("Opening details for todo:", todoId)
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

