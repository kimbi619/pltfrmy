import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list">
      <div *ngIf="tasks.length === 0" class="no-tasks">
        <p>No tasks found</p>
      </div>
      
      <div *ngFor="let task of tasks" class="task-item" (click)="selectTask(task)">
        <div class="task-checkbox">
          <input type="checkbox" [checked]="task.completed" (click)="$event.stopPropagation(); toggleComplete(task)">
        </div>
        <div class="task-content">
          <h3 [class.completed]="task.completed">{{ task.title }}</h3>
          <div class="task-meta">
            <span *ngIf="task.dueDate" class="due-date">
              <i class="far fa-calendar"></i> {{ task.dueDate | date:'shortDate' }}
            </span>
            <div class="task-tags">
              <span *ngFor="let tag of task.tags" class="task-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="priority-indicator" [class]="'priority-' + task.priority">
            {{ task.priority }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class TodoListComponent {
  @Input() tasks: any[] = [];
  @Output() taskSelected = new EventEmitter<any>();

  selectTask(task: any): void {
    this.taskSelected.emit(task);
  }

  toggleComplete(task: any): void {
    task.completed = !task.completed;
  }
}

