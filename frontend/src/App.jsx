import { Suspense } from 'react';
import AppRouter from './core/routes/AppRouter';
import { AuthProvider } from './core/context/AuthContext';
import { ToastProvider } from './shared/components/ui/Toast';
import Loader from './shared/components/ui/Loader';
import ErrorBoundary from './shared/components/ErrorBoundary';
import LenisScroll from './shared/components/LenisScroll';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ToastProvider>
                    <Suspense fallback={<Loader fullScreen />}>
                        <LenisScroll />
                        <AppRouter />
                    </Suspense>
                </ToastProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
