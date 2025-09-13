import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { CreateTaskRequest, Task } from "../../../shared/models/task.model";

export interface TaskFormDialogData {
    mode: "create" | "edit";
    task?: Task;
}

export interface TaskFormDialogResult {
    task: CreateTaskRequest;
}

@Component({
    selector: "app-task-form-dialog",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: "./task-form-dialog.component.html",
    styleUrl: "./task-form-dialog.component.scss"
})
export class TaskFormDialogComponent implements OnInit {
    readonly taskForm: FormGroup;
    readonly isEditMode: boolean;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<TaskFormDialogComponent, TaskFormDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: TaskFormDialogData
    ) {
        this.isEditMode = data.mode === "edit";
        this.taskForm = this.createForm();
    }

    ngOnInit(): void {
        if (this.isEditMode && this.data.task) {
            this.taskForm.patchValue({
                title: this.data.task.title,
                description: this.data.task.description
            });
        }
    }

    private createForm(): FormGroup {
        return this.formBuilder.group({
            title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
        });
    }

    onSubmit(): void {
        if (this.taskForm.valid) {
            const taskData: CreateTaskRequest = {
                title: this.taskForm.get("title")!.value.trim(),
                description: this.taskForm.get("description")!.value.trim()
            };

            this.dialogRef.close({ task: taskData });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    get titleControl() {
        return this.taskForm.get("title");
    }

    get descriptionControl() {
        return this.taskForm.get("description");
    }

    get dialogTitle(): string {
        return this.isEditMode ? "Editar Tarea" : "Nueva Tarea";
    }

    get submitButtonText(): string {
        return this.isEditMode ? "Actualizar" : "Crear";
    }
}
