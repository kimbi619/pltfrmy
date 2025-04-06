import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        [(ngModel)]="searchQuery" 
        placeholder="Search" 
        class="search-input"
        (input)="onSearch()"
      />
    </div>
  `,
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchQuery = ""

  onSearch() {
    // Implementation for search functionality
    console.log("Searching for:", this.searchQuery)
  }
}

