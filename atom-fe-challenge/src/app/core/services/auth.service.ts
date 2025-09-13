import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
    BehaviorSubject, Observable, throwError
} from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import {
    AuthResponse, LoginRequest, User
} from "../../shared/models/user.model";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}`;
    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
    public readonly currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            this.currentUserSubject.next(user);
        }
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/email/${request.email}`)
            .pipe(
                map((response) => {
                    const authResponse: AuthResponse = { user: response.data! };
                    return authResponse;
                }),
                tap((authResponse) => this.setCurrentUser(authResponse.user)),
                catchError((error) => {
                    if (error.status === 404) {
                        return throwError(() => ({ 
                            message: "El correo no está registrado. ¿Deseas crear una nueva cuenta?",
                            status: 404,
                            needsRegistration: true,
                            email: request.email
                        }));
                    }
                    return throwError(() => error);
                })
            );
    }

    createUser(email: string, name: string): Observable<AuthResponse> {
        const createRequest = { email, name };
        
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, createRequest)
            .pipe(
                map((response) => {
                    const authResponse: AuthResponse = { user: response.data! };
                    return authResponse;
                }),
                tap((authResponse) => this.setCurrentUser(authResponse.user)),
                catchError((error) => {
                    return throwError(() => error);
                })
            );
    }


    logout(): void {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        this.currentUserSubject.next(null);
        this.router.navigate(["/login"]);
    }

    isAuthenticated(): boolean {
        return this.currentUserSubject.value !== null;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    private setCurrentUser(user: User): void {
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
