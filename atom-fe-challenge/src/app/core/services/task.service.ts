import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import {
    CreateTaskRequest, Task, UpdateTaskRequest
} from "../../shared/models/task.model";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class TaskService {
    private readonly apiUrl = `${environment.apiUrl}/tasks`;
    private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
    public readonly tasks$ = this.tasksSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    getTasks(): Observable<Task[]> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return of([]);
        }

        return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}?userId=${currentUser.id}`)
            .pipe(
                map((response) => response.data!),
                tap((tasks) => this.tasksSubject.next(tasks)),
                catchError(() => of([]))
            );
    }

    createTask(request: CreateTaskRequest): Observable<Task> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const requestWithUserId = { ...request, userId: currentUser.id };
        
        return this.http.post<ApiResponse<Task>>(`${this.apiUrl}`, requestWithUserId)
            .pipe(
                map((response) => response.data!),
                tap((task) => {
                    const currentTasks = this.tasksSubject.value;
                    this.tasksSubject.next([task, ...currentTasks]);
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    updateTask(request: UpdateTaskRequest): Observable<Task> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const requestWithUserId = { ...request, userId: currentUser.id };
        
        return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${request.id}`, requestWithUserId)
            .pipe(
                map((response) => response.data!),
                tap((updatedTask) => {
                    const currentTasks = this.tasksSubject.value;
                    const taskIndex = currentTasks.findIndex((task) => task.id === updatedTask.id);
                    if (taskIndex !== -1) {
                        currentTasks[taskIndex] = updatedTask;
                        this.tasksSubject.next([...currentTasks]);
                    }
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    deleteTask(taskId: string): Observable<void> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${taskId}`, {
            body: { userId: currentUser.id }
        })
            .pipe(
                map(() => undefined),
                tap(() => {
                    const currentTasks = this.tasksSubject.value;
                    const filteredTasks = currentTasks.filter((task) => task.id !== taskId);
                    this.tasksSubject.next(filteredTasks);
                }),
                catchError((error) => {
                    throw error;
                })
            );
    }

    toggleTaskCompletion(taskId: string): Observable<Task> {
        const task = this.tasksSubject.value.find((t) => t.id === taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        const updateRequest: UpdateTaskRequest = {
            id: taskId,
            done: !task.done
        };

        return this.updateTask(updateRequest);
    }
}
