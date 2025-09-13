export interface Task {
    id?: string;
    title: string;
    description: string;
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
}

export interface UpdateTaskRequest {
    id?: string;
    title?: string;
    description?: string;
    done?: boolean;
}
