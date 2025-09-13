import { Routes } from "@angular/router";

import { authGuard, loginGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("./features/auth/login/login.component").then((m) => m.LoginComponent),
        canActivate: [loginGuard]
    },
    {
        path: "tasks",
        loadComponent: () => import("./features/tasks/tasks.component").then((m) => m.TasksComponent),
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];
