import { Component } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { TodoListComponent } from "../../../components/list/list.component";

@Component({
  selector: 'app-todo-home',
  imports: [TodoListComponent, SidebarComponent],
  template: `
    <div class="app-container" >
      <app-sidebar></app-sidebar>
      <app-list></app-list>
    </div>
  `,
  styleUrl: './todo-home.component.scss'
})
export class TodoHomeComponent {
  title = "angular-todo"
  isAuthenticated = false
  
  constructor(
  ) {}
  
  ngOnInit(): void {
    
  }

}
