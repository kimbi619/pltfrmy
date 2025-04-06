import { Component } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { TodoListComponent } from "../../../components/list/list.component";
import { AsideRightComponent } from "../../../components/aside-right/aside-right.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-home',
  standalone: true,
  imports: [TodoListComponent, SidebarComponent, AsideRightComponent, CommonModule],
  template: `
    <div class="app-container">
      <div class="aside-left" [class.show]="showLeftSidebar">
        <app-sidebar  />
      </div>
      
      <div class="app-content">
        <div class="content-header">
          <h1>{{ selectedSection }}</h1>
        </div>
        
          <button class="create-task-btn" (click)="createNewTask()">
            <i class="fas fa-plus"></i> New Task
          </button>
        <app-list [tasks]="filteredTasks" (taskSelected)="onTaskSelected($event)" />
      </div>

      <div class="app-aside-right" [class.show]="showRightSidebar">
        <app-aside-right [selectedTask]="selectedTask" (close)="closeTaskDetail()" />
      </div>
      
      <button class="mobile-menu-btn" (click)="toggleLeftSidebar()">
        <i class="fas fa-bars"></i>
      </button>
      
      <div class="overlay" [class.show]="showLeftSidebar || showRightSidebar" (click)="closeOverlay()"></div>
    </div>
  `,
  styleUrl: './todo-home.component.scss'
})
export class TodoHomeComponent {
  title = "angular-todo";
  isAuthenticated = false;
  showLeftSidebar = false;
  showRightSidebar = false;
  selectedSection = 'Today';
  filteredTasks: any[] = [];
  selectedTask: any;

  constructor() {
    this.filteredTasks = [
      {
        id: 1, 
        title: 'Complete project documentation',
        description: 'Write detailed specs for the new feature',
        completed: false,
        dueDate: '2025-04-10',
        priority: 'high',
        tags: ['work', 'docs']
      },
      {
        id: 2,
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        completed: false,
        dueDate: '2025-04-06',
        priority: 'medium',
        tags: ['personal']
      },
      {
        id: 3,
        title: 'Exercise',
        description: '30 minutes of cardio',
        completed: true,
        priority: 'low',
        tags: ['health']
      }
    ];
  }

  ngOnInit(): void {
    this.checkScreenSize();
    
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
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
  }

  createNewTask(): void {
    this.selectedTask = { 
      isNew: true,
      title: '', 
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      tags: [],
      subtasks: []
    };
    this.showRightSidebar = true;
  }

  onTaskSelected(task: any): void {
    this.selectedTask = { ...task, isNew: false };
    this.showRightSidebar = true;
  }

  closeTaskDetail(): void {
    this.showRightSidebar = false;
  }

  closeOverlay(): void {
    this.showLeftSidebar = false;
    this.showRightSidebar = false;
  }
}
