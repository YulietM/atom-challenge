import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnDestroy {
    readonly loginForm: FormGroup;
    readonly registerForm: FormGroup;
    isLoading = false;
    errorMessage = "";
    showRegisterForm = false;
    userEmail = "";

    private readonly destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.createLoginForm();
        this.registerForm = this.createRegisterForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createLoginForm(): FormGroup {
        return this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]]
        });
    }

    private createRegisterForm(): FormGroup {
        return this.formBuilder.group({
            name: ["", [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = "";
            this.userEmail = this.loginForm.get("email")!.value;

            this.authService.login({ email: this.userEmail })
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isLoading = false;
                        this.router.navigate(["/tasks"]);
                    },
                    error: (error) => {
                        this.isLoading = false;
                        if (error?.needsRegistration) {
                            this.showRegisterForm = true;
                            this.errorMessage = "";
                        } else {
                            this.errorMessage = error?.message || "Error al iniciar sesión. Intenta nuevamente.";
                        }
                    }
                });
        }
    }

    onRegister(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = "";

            const name = this.registerForm.get("name")!.value;

            this.authService.createUser(this.userEmail, name)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isLoading = false;
                        this.router.navigate(["/tasks"]);
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.errorMessage = error?.message || "Error al crear la cuenta. Intenta nuevamente.";
                    }
                });
        }
    }

    backToLogin(): void {
        this.showRegisterForm = false;
        this.errorMessage = "";
        this.registerForm.reset();
    }

    get emailControl() {
        return this.loginForm.get("email");
    }

    get nameControl() {
        return this.registerForm.get("name");
    }
}
