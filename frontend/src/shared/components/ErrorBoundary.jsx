import React, { Component } from 'react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Something went wrong.</h2>
                    <p className="mt-2 text-gray-600">We're sorry for the inconvenience. Please try refreshing the page.</p>
                    <Button
                        className="mt-6"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
