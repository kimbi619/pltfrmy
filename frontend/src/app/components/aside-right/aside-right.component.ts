import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aside-right',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sidebar">

      <div class="sidebar-header">
        <h3>{{ selectedTask?.isNew ? 'Create Task' : 'Task Details' }}</h3>
      </div>

      <div class="task-details" *ngIf="selectedTask">
        <div class="task-title">
          <input
            type="text"
            [(ngModel)]="selectedTask.title"
            placeholder="Task title"
            class="title-input"
            />
          </div>
          
          <div class="meta-item">
            <label>Category</label>
            <select [(ngModel)]="selectedTask.category">
              <option value="personal" >Personal</option>
              <option value="work">Work</option>
              <option value="fun">Fun</option>
            </select>
          </div>

        <div class="task-description">
          <textarea
            [(ngModel)]="selectedTask.description"
            placeholder="Add description"
            rows="4"
          ></textarea>
        </div>

        <div class="task-meta">
          <div class="meta-item">
            <label>Due date</label>
            <input type="date" [(ngModel)]="selectedTask.dueDate" />
          </div>

          <div class="meta-item">
            <label>Priority</label>
            <select [(ngModel)]="selectedTask.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="task-tags">
          <label>Tags</label>
          <div class="tags-container">
            <span *ngFor="let tag of selectedTask.tags || []" class="tag">
              {{ tag?.name || tag }}
              <i class="fas fa-times" (click)="removeTag(tag)"></i>
            </span>
            <input
              type="text"
              placeholder="Add tag"
              class="tag-input"
              #tagInput
              (keyup.enter)="addTag(tagInput.value); tagInput.value = ''"
            />
          </div>
        </div>

        <div *ngIf="!selectedTask.isNew" class="subtasks">
          <h4>Add Subtasks</h4>
          <div class="subtask-list">
            <div
              *ngFor="let subtask of selectedTask.subtasks || []"
              class="subtask-item"
            >
              <input type="checkbox" [(ngModel)]="subtask.completed" />
              <span [class.completed]="subtask.completed">{{
                subtask.title
              }}</span>
              <i class="fas fa-times" (click)="removeSubtask(subtask)"></i>
            </div>
            <div class="add-subtask">
              <input
                type="text"
                placeholder="Add subtask"
                #subtaskInput
                (keyup.enter)="
                  addSubtask(subtaskInput.value); subtaskInput.value = ''
                "
              />
              <button
                (click)="
                  addSubtask(subtaskInput.value); subtaskInput.value = ''
                "
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div class="task-actions">
          <button class="save-btn" (click)="saveTask()">
            {{ selectedTask.isNew ? 'Create Task' : 'Save Changes' }}
          </button>
          <button
            *ngIf="!selectedTask.isNew"
            class="delete-btn"
            (click)="deleteTask()"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './aside-right.component.scss',
})
export class AsideRightComponent {
  @Input() selectedTask: any;
  @Output() close = new EventEmitter<void>();

  addTag(tag: string) {
    if (!tag.trim()) return;

    if (!this.selectedTask.tags) {
      this.selectedTask.tags = [];
    }

    if (!this.selectedTask.tags.includes(tag)) {
      this.selectedTask.tags.push(tag);
    }
  }

  removeTag(tag: string) {
    this.selectedTask.tags = this.selectedTask.tags.filter(
      (t: string) => t !== tag
    );
  }

  addSubtask(title: string) {
    if (!title.trim()) return;

    if (!this.selectedTask.subtasks) {
      this.selectedTask.subtasks = [];
    }

    this.selectedTask.subtasks.push({
      id: Date.now(),
      title,
      completed: false,
    });
  }

  removeSubtask(subtask: any) {
    this.selectedTask.subtasks = this.selectedTask.subtasks.filter(
      (t: any) => t.id !== subtask.id
    );
  }

  saveTask() {
    console.log('Saving task:', this.selectedTask);
    this.close.emit();
  }

  deleteTask() {
    console.log('Deleting task:', this.selectedTask);
    this.close.emit();
  }
}
