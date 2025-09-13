import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AuthService } from "../../core/services/auth.service";
import { TaskService } from "../../core/services/task.service";
import { Task, User } from "../../shared/models";
import { TaskFormDialogComponent } from "./task-form-dialog/task-form-dialog.component";
import { TaskListComponent } from "./task-list/task-list.component";

@Component({
    selector: "app-tasks",
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        TaskListComponent
    ],
    templateUrl: "./tasks.component.html",
    styleUrl: "./tasks.component.scss"
})
export class TasksComponent implements OnInit, OnDestroy {
    readonly tasks$: Observable<Task[]>;
    readonly currentUser$: Observable<User | null>;
    isLoading = false;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private taskService: TaskService,
        private authService: AuthService,
        private dialog: MatDialog
    ) {
        this.tasks$ = this.taskService.tasks$;
        this.currentUser$ = this.authService.currentUser$;
    }

    ngOnInit(): void {
        this.loadTasks();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadTasks(): void {
        this.isLoading = true;
        this.taskService.getTasks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                }
            });
    }

    onAddTask(): void {
        const dialogRef = this.dialog.open(TaskFormDialogComponent, {
            width: "500px",
            maxWidth: "90vw",
            data: { mode: "create" }
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                if (result?.task) {
                    this.taskService.createTask(result.task)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                }
            });
    }

    onEditTask(task: Task): void {
        const dialogRef = this.dialog.open(TaskFormDialogComponent, {
            width: "500px",
            maxWidth: "90vw",
            data: { mode: "edit", task }
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                if (result?.task) {
                    this.taskService.updateTask({
                        id: task.id,
                        ...result.task
                    }).pipe(takeUntil(this.destroy$))
                        .subscribe();
                }
            });
    }

    onDeleteTask(taskId: string): void {
        this.taskService.deleteTask(taskId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    onToggleTaskCompletion(taskId: string): void {
        this.taskService.toggleTaskCompletion(taskId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    onLogout(): void {
        this.authService.logout();
    }
}
