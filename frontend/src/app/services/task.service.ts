import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Task, TaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && response.tasks && Array.isArray(response.tasks)) {
          return response.tasks;
        } else {
          console.warn('Error here or something:', response);
          return [];
        }
      }),
      tap(tasks => {
        this.tasksSubject.next(tasks);
      }),
      catchError(this.handleError)
    );
  }

  getTasksByFilter(filterParams: any): Observable<Task[]> {
    return this.http.get<any>(`${this.apiUrl}`, { params: filterParams }).pipe(
      map(response => response?.tasks || []),
      tap(tasks => this.tasksSubject.next(tasks)),
      catchError(this.handleError)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response?.task || {}),
      catchError(this.handleError)
    );
  }

  createTask(taskData: TaskRequest): Observable<Task> {
    return this.http.post<any>(this.apiUrl, taskData).pipe(
      map(response => response?.task || {}),
      tap(newTask => {
        if (newTask?.id) {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, newTask]);
        }
      }),
      catchError(this.handleError)
    );
  }

  updateTask(id: number, taskData: Partial<TaskRequest>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          const updatedTasks = [...currentTasks];
          updatedTasks[index] = updatedTask;
          this.tasksSubject.next(updatedTasks);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter(task => task.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  createSubtask(parentId: number, subtaskData: TaskRequest): Observable<Task> {
    subtaskData.parent = parentId;
    return this.http.post<Task>(this.apiUrl, subtaskData).pipe(
      catchError(this.handleError)
    );
  }

  updateTaskStatus(id: number, status: string): Observable<Task> {
    return this.updateTask(id, { status });
  }

  private handleError(error: any): Observable<never> {
    return new Observable(observer => {
      observer.error(error.error || 'Server error');
    });
  }
}