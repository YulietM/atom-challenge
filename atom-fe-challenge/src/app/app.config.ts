import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { errorInterceptor } from "./core/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        importProvidersFrom(MatDialogModule)
    ]
};
