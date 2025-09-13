import { CommonModule } from "@angular/common";
import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";

import { Task } from "../../../shared/models/task.model";

@Component({
    selector: "app-task-list",
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    templateUrl: "./task-list.component.html",
    styleUrl: "./task-list.component.scss"
})
export class TaskListComponent {
    @Input() tasks: Task[] | null = [];
    @Output() readonly editTask = new EventEmitter<Task>();
    @Output() readonly deleteTask = new EventEmitter<string>();
    @Output() readonly toggleCompletion = new EventEmitter<string>();

    onToggleCompletion(taskId: string): void {
        this.toggleCompletion.emit(taskId);
    }

    onEditTask(task: Task): void {
        this.editTask.emit(task);
    }

    onDeleteTask(taskId: string): void {
        this.deleteTask.emit(taskId);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    trackByTaskId(_index: number, task: Task): string | undefined {
        return task.id;
    }

    get sortedTasks(): Task[] {
        if (!this.tasks) return [];

        return [...this.tasks].sort((a, b) => {
            if (a.done !== b.done) {
                return a.done ? 1 : -1;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
}
