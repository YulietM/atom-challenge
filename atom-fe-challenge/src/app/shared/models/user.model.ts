export interface User {
    id?: string;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface LoginRequest {
    email: string;
}

export interface AuthResponse {
    user: User;
    token?: string;
}
