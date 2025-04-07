import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('Categories API response:', response);
        if (response && response.categories && Array.isArray(response.categories)) {
          return response.categories;
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  getTasksByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}/tasks`).pipe(
      map(response => {
        console.log('Category tasks response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getCategoryColor(name: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
      '#073B4C', '#9C89B8', '#F4A261', '#2A9D8F', '#E76F51'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  private handleError(error: any): Observable<never> {
    console.error('CategoryService error:', error);
    throw error;
  }
}