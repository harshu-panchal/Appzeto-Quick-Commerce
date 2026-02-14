import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { router } from '@core/routes';
import { AuthProvider } from '@core/context/AuthContext';
import { ToastProvider } from '@shared/components/ui/Toast';
import Loader from '@shared/components/ui/Loader';
import ErrorBoundary from '@shared/components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ToastProvider>
                    <Suspense fallback={<Loader fullScreen />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </ToastProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
