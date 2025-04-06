import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Todo } from "../../models/todo.model"

@Component({
  selector: "app-todo-item",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <div class="todo-checkbox-container">
        <input 
          type="checkbox" 
          [checked]="todo.completed" 
          (change)="onToggleComplete()"
          class="todo-checkbox"
          id="todo-{{todo.id}}"
        />
        <label class="todo-checkbox-label" for="todo-{{todo.id}}"></label>
      </div>
      
      <div class="todo-content">
        <div class="todo-title">{{ todo.title }}</div>
        
        <div *ngIf="todo.date || todo.subtasks || todo.list" class="todo-meta">
          <div *ngIf="todo.date" class="todo-date">
            <i class="fas fa-calendar-alt"></i>
            {{ formatDate(todo.date) }}
          </div>
          
          <div *ngIf="todo.subtasks && todo.subtasks > 0" class="todo-subtasks">
            <span>{{ todo.subtasks }}</span>
            <span>Subtasks</span>
          </div>
          
          <div *ngIf="todo.list" class="todo-list-tag" [style.backgroundColor]="todo.list.color + '33'" [style.color]="todo.list.color">
            {{ todo.list.name }}
          </div>
        </div>
      </div>
      
      <button class="todo-details-btn" (click)="onOpenDetails()">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `,
})
export class TodoItemComponent {
  @Input() todo!: Todo
  @Output() toggleComplete = new EventEmitter<number>()
  @Output() openDetails = new EventEmitter<number>()

  onToggleComplete() {
    this.toggleComplete.emit(this.todo.id)
  }

  onOpenDetails() {
    this.openDetails.emit(this.todo.id)
  }

  formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`
  }
}

