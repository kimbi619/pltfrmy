import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TodoListComponent } from '../../../components/list/list.component';
import { AsideRightComponent } from '../../../components/aside-right/aside-right.component';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-todo-home',
  standalone: true,
  imports: [
    TodoListComponent,
    SidebarComponent,
    AsideRightComponent,
    CommonModule,
  ],
  template: `
    <div class="app-container">
      <div class="aside-left" [class.show]="showLeftSidebar">
        <app-sidebar (menuItemSelected)="onMenuItemSelected($event)" />
      </div>

      <div class="app-content">
        <div class="content-header">
          <h1>{{ selectedSection }}</h1>
          <button class="create-task-btn" (click)="createNewTask()">
            <i class="fas fa-plus"></i> New Task
          </button>
        </div>

        <div *ngIf="filteredTasks.length === 0" class="no-tasks">
          No tasks available.
        </div>

        <app-list
          [tasks]="filteredTasks"
          (taskSelected)="onTaskSelected($event)"
          (statusChanged)="onTaskStatusChanged($event)"
        />
      </div>

      <div class="app-aside-right" [class.show]="showRightSidebar">
        <app-aside-right
          [selectedTask]="selectedTask"
          (close)="closeTaskDetail()"
        />
      </div>

      <button class="mobile-menu-btn" (click)="toggleLeftSidebar()">
        <i class="fas fa-bars"></i>
      </button>

      <div
        class="overlay"
        [class.show]="showLeftSidebar || showRightSidebar"
        (click)="closeOverlay()"
      ></div>
    </div>
  `,
  styleUrl: './todo-home.component.scss',
})
export class TodoHomeComponent implements OnInit {
  title = 'angular-todo';
  isAuthenticated = false;
  showLeftSidebar = false;
  showRightSidebar = false;
  selectedSection = 'Today';
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  isLoading = false;
  error = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.loadTasks();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = '';

    let filterParams = {};
    switch (this.selectedSection.toLowerCase()) {
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filterParams = { due_date: today };
        break;
      case 'upcoming':
        filterParams = { status: 'active' };
        break;
      case 'completed':
        filterParams = { status: 'completed' };
        break;
      default:
        filterParams = { category: this.selectedSection };
    }

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks received in component:', tasks);
        this.filteredTasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load tasks';
        this.isLoading = false;
        console.error('Error loading tasks:', err);
      },
    });
  }

  checkScreenSize(): void {
    if (window.innerWidth > 768) {
      this.showLeftSidebar = true;
    } else {
      this.showLeftSidebar = false;
    }
  }

  toggleLeftSidebar(): void {
    this.showLeftSidebar = !this.showLeftSidebar;
    if (this.showLeftSidebar && window.innerWidth <= 768) {
      this.showRightSidebar = false;
    }
  }

  onMenuItemSelected(section: string): void {
    this.selectedSection = section;

    if (window.innerWidth <= 768) {
      this.showLeftSidebar = false;
    }

    this.loadTasks();
  }

  createNewTask(): void {
    const now = new Date();

    this.selectedTask = {
      title: '',
      description: '',
      status: 'active',
      priority: 'Medium',
      due_date: now.toISOString().split('T')[0],
      subtasks: [],
      tags: [],
      isNew: true,
    };

    this.showRightSidebar = true;
  }

  onTaskSelected(task: Task): void {
    if (task.id) {
      this.taskService.getTaskById(task.id).subscribe({
        next: (fullTask) => {
          this.selectedTask = { ...fullTask, isNew: false };
          this.showRightSidebar = true;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load task details';
        },
      });
    } else {
      this.selectedTask = { ...task, isNew: false };
      this.showRightSidebar = true;
    }
  }

  closeTaskDetail(): void {
    this.showRightSidebar = false;
    this.selectedTask = null;
  }

  closeOverlay(): void {
    this.showLeftSidebar = false;
    this.showRightSidebar = false;
  }

  onTaskSaved(task: Task): void {
    if (task.isNew) {
      this.taskService
        .createTask({
          title: task.title,
          description: task.description,
          category: task.categories?.[0]?.name,
          due_date: task.due_date,
          start_date: task.start_date,
          status: task.status,
          priority: task.priority,
          tags: task.tags?.map((tag) => tag.name),
        })
        .subscribe({
          next: () => {
            this.closeTaskDetail();
            this.loadTasks();
          },
          error: (err) => {
            this.error = err.message || 'Failed to create task';
          },
        });
    } else if (task.id) {
      this.taskService
        .updateTask(task.id, {
          title: task.title,
          description: task.description,
          category: task.categories?.[0]?.name,
          due_date: task.due_date,
          start_date: task.start_date,
          status: task.status,
          priority: task.priority,
          tags: task.tags?.map((tag) => tag.name),
        })
        .subscribe({
          next: () => {
            this.closeTaskDetail();
            this.loadTasks();
          },
          error: (err) => {
            this.error = err.message || 'Failed to update task';
          },
        });
    }
  }

  onTaskDeleted(taskId: number): void {
    if (!taskId) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.closeTaskDetail();
        this.loadTasks();
      },
      error: (err) => {
        this.error = err.message || 'Failed to delete task';
      },
    });
  }

  onTaskStatusChanged(event: { taskId: number; status: string }): void {
    this.taskService.updateTaskStatus(event.taskId, event.status).subscribe({
      next: () => {
        if (this.selectedSection.toLowerCase() === 'completed') {
          this.loadTasks();
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to update task status';
      },
    });
  }
}
