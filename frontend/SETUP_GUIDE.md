# Quick Commerce Frontend Setup Guide

## Prerequisites
- Node.js 18+
- npm 9+

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture Overview

This project uses a **Modular Role-Based Architecture**.

### Key Directories

- `src/core/`: Global logic (Auth, API, Guards, Router)
- `src/shared/`: Reusable UI components and layouts
- `src/modules/`: Isolated features per role
  - `customer/`: Customer-facing application
  - `seller/`: Seller dashboard
  - `admin/`: Platform administration
  - `delivery/`: Delivery partner app

## Key Features

- **Role-Based Routing**: Secure access control using `ProtectedRoute` and `RoleGuard`.
- **Lazy Loading**: Modules are loaded only when needed for better performance.
- **Tailwind CSS**: Modern styling with a custom primary color palette.
- **Axios Interceptors**: Automatic token management and global error handling.

## Adding a New Module

1. Create a new folder in `src/modules/[module-name]`.
2. Define routes in `src/modules/[module-name]/routes/index.tsx`.
3. Add the module to the root router in `src/core/routes/index.tsx`.
4. Implement role-specific pages and services.
