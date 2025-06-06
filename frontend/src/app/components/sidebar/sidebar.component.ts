import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SearchComponent } from "../search/search.component";
import { AuthService } from "../../services/auth.service";
import { CategoryService } from "../../services/category.service";
import { Category } from "../../models/task.model";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Hi Kimbi!</h2>
        <button class="menu-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M21 6.75C21 4.67893 19.3211 3 17.25 3C15.1789 3 13.5 4.67893 13.5 6.75C13.5 8.82107 15.1789 10.5 17.25 10.5C19.3211 10.5 21 8.82107 21 6.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M10.5 6.75C10.5 4.67893 8.82107 3 6.75 3C4.67893 3 3 4.67893 3 6.75C3 8.82107 4.67893 10.5 6.75 10.5C8.82107 10.5 10.5 8.82107 10.5 6.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.1789 13.5 13.5 15.1789 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M10.5 17.25C10.5 15.1789 8.82107 13.5 6.75 13.5C4.67893 13.5 3 15.1789 3 17.25C3 19.3211 4.67893 21 6.75 21C8.82107 21 10.5 19.3211 10.5 17.25Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      
      <app-search></app-search>
      
      <div class="sidebar-section">
        <h3>TASKS</h3>
        <ul class="sidebar-list">
          <li [class.active]="activeSection === 'upcoming'" (click)="setActiveSection('upcoming')">
            <i class="fas fa-chevron-right"></i>
            <span>Upcoming</span>
            <span class="count">{{ counts.upcoming }}</span>
          </li>
          <li [class.active]="activeSection === 'today'" (click)="setActiveSection('today')">
            <i class="fas fa-list"></i>
            <span>Today</span>
            <span class="count">{{ counts.today }}</span>
          </li>
          <li [class.active]="activeSection === 'calendar'" (click)="setActiveSection('calendar')">
            <i class="fas fa-calendar"></i>
            <span>Calendar</span>
          </li>
          <li [class.active]="activeSection === 'sticky-wall'" (click)="setActiveSection('sticky-wall')">
            <i class="fas fa-sticky-note"></i>
            <span>Sticky Wall</span>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3>CATEGORIES</h3>
        <ul class="sidebar-list">
          <li *ngFor="let category of categories" 
              [class.active]="activeCategory === category.id" 
              (click)="setActiveCategory(category)">
            <span class="list-color" [style.backgroundColor]="getCategoryColor(category)"></span>
            <span>{{ category.name }}</span>
            <span class="count">{{ category._count?.tasks || 0 }}</span>
          </li>
          <li class="add-new" (click)="addNewCategory()">
            <i class="fas fa-plus"></i>
            <span>Add New Category</span>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3>TAGS</h3>
        <div class="tags-container">
          <span *ngFor="let tag of tags" 
                class="tag" 
                [style.backgroundColor]="tag.color + '33'"
                [style.color]="tag.color">
            {{ tag.name }}
          </span>
          <span class="add-tag" (click)="addNewTag()">
            + Add Tag
          </span>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" (click)="openSettings()">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </button>
        <button class="sidebar-footer-btn" (click)="signOut()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  activeSection = "today";
  activeList: number | null = null;
  activeCategory: number | null = null;

  counts = {
    upcoming: 12,
    today: 5,
  };

  lists = [
    { id: 1, name: "Personal", color: "#ff6b6b", count: 3 },
    { id: 2, name: "Work", color: "#4ecdc4", count: 8 },
    { id: 3, name: "List 1", color: "#ffd166", count: 3 },
  ];

  tags = [
    { id: 1, name: "Tag 1", color: "#4ecdc4" },
    { id: 2, name: "Tag 2", color: "#ff6b6b" },
  ];

  categories: Category[] = [];

  constructor(private authService: AuthService, private categoryService: CategoryService) {}

  @Output() menuItemSelected = new EventEmitter<string>();

  ngOnInit() {
    this.loadCategories();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.activeList = null;
    this.activeCategory = null;

    this.menuItemSelected.emit(section);
  }

  setActiveList(listId: number) {
    this.activeList = listId;
    this.activeSection = "";
    this.activeCategory = null;

    const selectedList = this.lists.find(list => list.id === listId);
    if (selectedList) {
      this.menuItemSelected.emit(selectedList.name);
    }
  }

  setActiveCategory(category: Category) {
    this.activeCategory = category.id;
    this.activeSection = "";
    this.activeList = null;

    this.menuItemSelected.emit(`category:${category.id}`);
  }

  addNewList() {
    console.log("add new list clicked");
  }

  addNewTag() {
    console.log("goto add new tag clicked");
  }

  addNewCategory() {
    console.log("add new category clicked");
  }

  openSettings() {
    console.log("goto settings clicked");
  }

  signOut() {
    console.log("Sign out clicked");
    this.authService.logout();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Loaded categories:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  getCategoryColor(category: Category): string {
    return category.color || "#cccccc";
  }
}

