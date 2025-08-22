import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Logger } from '@/utils/log';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background border border-destructive/20 rounded-lg">
          <div className="p-3 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Something went wrong
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              An unexpected error occurred. Please try again or refresh the extension.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Error Details
                </summary>
                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto max-h-20">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={this.handleRetry}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="default"
              className="text-xs"
            >
              Reload Extension
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;