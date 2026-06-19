import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // In production you'd send this to an error tracking service
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
                    <div className="max-w-md w-full text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/10 rounded-full">
                                <AlertCircle className="text-red-400 w-12 h-12" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-ink mb-3 tracking-tight">
                            Something went wrong
                        </h1>
                        <p className="text-sm text-ink-subtle mb-8 leading-relaxed">
                            An unexpected error occurred. This has been logged automatically.
                            You can try refreshing the page or returning to the dashboard.
                        </p>

                        {this.state.error?.message && (
                            <div className="bg-surface-1 border border-hairline rounded-xl p-4 mb-6 text-left">
                                <p className="text-xs font-mono text-ink-tertiary break-words">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-all duration-200"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-5 py-2.5 bg-surface-1 border border-hairline text-ink text-sm font-medium rounded-lg hover:bg-surface-2 transition-all duration-200"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
