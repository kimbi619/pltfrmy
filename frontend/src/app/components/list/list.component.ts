import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

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
          <input 
            type="checkbox" 
            [checked]="task.status === 'completed'"  
            (click)="$event.stopPropagation(); toggleTaskStatus(task)"
          >
        </div>
        <div class="task-content">
          <h3 [class.completed]="task.status === 'completed'">{{ task.title }}</h3>
          <div class="task-meta">
            <span *ngIf="task.due_date" class="due-date">
              <i class="far fa-calendar"></i> {{ task.due_date | date:'shortDate' }}
            </span>
            
            <div *ngIf="task.tags && task.tags.length > 0" class="task-tags">
              <span *ngFor="let tag of task.tags" class="task-tag">
                {{ tag?.name || 'Unnamed tag' }}
              </span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <span *ngIf="task.subtasks && task.subtasks.length > 0" class="subtasks-count">
            {{ task.subtasks.length }} subtask{{ task.subtasks.length > 1 ? 's' : '' }}
          </span>
          
          <button 
            class="priority-indicator"          
            [class]="'priority-' + getPriorityClass(task)">
            {{ task.priority }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class TodoListComponent {
  @Input() tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<Task>();
  @Output() statusChanged = new EventEmitter<{taskId: number, status: string}>();

  selectTask(task: Task): void {
    this.taskSelected.emit(task);
  }

  toggleTaskStatus(task: Task): void {
    if (!task || !task.id) return;
    
    const newStatus = task.status === 'completed' ? 'active' : 'completed';
    this.statusChanged.emit({ taskId: task.id, status: newStatus });
    
    task.status = newStatus;
  }

  getPriorityClass(task: Task): string {
    return task.priority ? task.priority.toLowerCase() : 'medium';
  }
}

