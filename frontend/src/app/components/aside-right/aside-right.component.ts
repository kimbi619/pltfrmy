import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-aside-right',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3 *ngIf="selectedTask">{{ selectedTask.isNew ? 'Create Task' : 'Task Details' }}</h3>
        <button class="close-btn" (click)="close.emit()">
          <i class="fas fa-times"></i>
        </button>
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
          <select [(ngModel)]="selectedCategory">
            <option value="personal">Personal</option>
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
            <input type="date" [(ngModel)]="selectedTask.due_date" />
          </div>

          <div class="meta-item">
            <label>Priority</label>
            <select [(ngModel)]="selectedTask.priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div class="task-tags">
          <label>Tags</label>
          <div class="tags-container">
            <span *ngFor="let tag of selectedTask.tags || []" class="tag">
              {{ getTagDisplay(tag) }}
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
export class AsideRightComponent implements OnChanges {
  @Input() selectedTask: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  selectedCategory: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask'] && this.selectedTask) {
      if (this.selectedTask.categories && this.selectedTask.categories.length > 0) {
        this.selectedCategory = this.selectedTask.categories[0].name;
      } else if (this.selectedTask.category) {
        this.selectedCategory = typeof this.selectedTask.category === 'string' ? 
          this.selectedTask.category : this.selectedTask.category.name;
      } else {
        this.selectedCategory = 'personal';
      }
    }
  }

  getTagDisplay(tag: any): string {
    if (typeof tag === 'string') {
      return tag;
    }
    return tag?.name || 'Unnamed tag';
  }

  addTag(tag: string) {
    if (!tag.trim() || !this.selectedTask) return;

    if (!this.selectedTask.tags) {
      this.selectedTask.tags = [];
    }

    this.selectedTask.tags.push(tag);
  }

  removeTag(tag: any) {
    if (!this.selectedTask || !this.selectedTask.tags) return;

    this.selectedTask.tags = this.selectedTask.tags.filter(t => {
      if (typeof t === 'string' && typeof tag === 'string') {
        return t !== tag;
      } else if (typeof t === 'object' && typeof tag === 'object') {
        return t.id !== tag.id;
      } else if (typeof t === 'string' && typeof tag === 'object') {
        return t !== tag.name;
      } else if (typeof t === 'object' && typeof tag === 'string') {
        return t.name !== tag;
      }
      return true;
    });
  }

  addSubtask(title: string) {
    if (!title.trim() || !this.selectedTask) return;

    if (!this.selectedTask.subtasks) {
      this.selectedTask.subtasks = [];
    }

    this.selectedTask.subtasks.push({
      title,
      status: 'active',
      priority: this.selectedTask.priority,
      completed: false
    });
  }

  removeSubtask(subtask: any) {
    if (!this.selectedTask || !this.selectedTask.subtasks) return;

    this.selectedTask.subtasks = this.selectedTask.subtasks.filter(
      s => s.id !== subtask.id
    );
  }

  saveTask() {
    if (!this.selectedTask) return;

    const taskToSave = {
      ...this.selectedTask,
      category: this.selectedCategory,
      tags: (this.selectedTask.tags || []).map(tag => 
        typeof tag === 'string' ? tag : tag.name
      )
    };

    this.taskSaved.emit(taskToSave);
  }

  deleteTask() {
    if (!this.selectedTask || !this.selectedTask.id) return;
    this.taskDeleted.emit(this.selectedTask.id);
  }
}
