import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

import { environment } from "../../../environments/environment";
import { AuthService } from "../services/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = "Ha ocurrido un error inesperado";

            if (error.error?.message) {
                errorMessage = error.error.message;
            }

            switch (error.status) {
                case 401:
                    authService.logout();
                    router.navigate(["/login"]);
                    errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
                    break;
                case 403:
                    errorMessage = "No tienes permisos para realizar esta acción.";
                    break;
                case 404:
                    errorMessage = "Recurso no encontrado.";
                    break;
                case 409:
                    errorMessage = "El recurso ya existe o hay un conflicto.";
                    break;
                case 422:
                    errorMessage = "Los datos proporcionados no son válidos.";
                    break;
                case 500:
                    errorMessage = "Error interno del servidor. Intenta más tarde.";
                    break;
                case 0:
                    errorMessage = "Error de conexión. Verifica tu conexión a internet.";
                    break;
                default:
                    break;
            }
            if (!environment.production) {
                console.error("HTTP Error:", {
                    status: error.status,
                    statusText: error.statusText,
                    message: errorMessage,
                    error: error.error,
                    url: error.url
                });
            }

            return throwError(() => ({
                message: errorMessage,
                status: error.status,
                originalError: error
            }));
        })
    );
};
