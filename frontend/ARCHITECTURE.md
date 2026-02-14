# Frontend Architecture Documentation

## Technology Stack

- **React 18** (Vite template)
- **TypeScript** for type safety
- **Tailwind CSS** for utility styling
- **React Router v6** for complex routing
- **Axios** for API communication
- **React Context** for lightweight state management

## Core Infrastructure

### Authentication Flow
The application uses a Context API (`AuthContext`) to manage user state globally. 
- `ProtectedRoute`: Ensures the user is logged in.
- `RoleGuard`: Ensures the user has the correct role (`ADMIN`, `SELLER`, etc.) for the accessed module.

### API Layer
Axios is configured in `core/api/axios.ts` with interceptors:
- **Request Interceptor**: Automatically attaches the Bearer token from localStorage.
- **Response Interceptor**: Handles 401 errors by logging the user out and redirecting to login.

## Modular Design

Each module is self-contained with its own:
- **Pages**: Role-specific views.
- **Components**: UI elements used only within that module.
- **Routes**: Nested routing specific to the module.
- **Services**: API call logic.

This structure allows multiple teams to work on different modules without merge conflicts and improves code maintainability.

## Shared System

- `src/shared/components/ui/`: Atomic UI components (Button, Input, Loader, etc.).
- `src/shared/layout/`: Global layout components (Sidebar, Topbar, DashboardLayout).

The `DashboardLayout` is a high-level component that accepts navigation items, making it easy to create consistent headers and sidebars across different roles.
