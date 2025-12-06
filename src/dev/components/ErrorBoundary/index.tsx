import React, { type ErrorInfo } from "react";
import { ErrorDisplay } from "./ErrorDisplay.tsx";
import { parseErrorStack } from "./utils.ts";

interface PreviewErrorBoundaryProps {
  children: React.ReactNode;
  errorTitle?: string;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  error: (Error & { 
    componentStack?: string; 
    source?: string;
    line?: number;
    column?: number;
  }) | null;
}

class PreviewErrorBoundary extends React.Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PreviewErrorBoundaryState> {
    return { 
      hasError: true, 
      error: error as Error & { componentStack?: string },
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const stackInfo = parseErrorStack(error.stack || '');
    
    this.setState({
      error: {
        ...error,
        message: error.message,
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        source: stackInfo.source,
        line: stackInfo.line,
        column: stackInfo.column,
      } as Error & { 
        componentStack?: string; 
        source?: string;
        line?: number;
        column?: number;
      }
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { children, errorTitle } = this.props;

    if (hasError && error) {
      return <ErrorDisplay error={error} errorTitle={errorTitle} />;
    }

    return children as React.ReactElement;
  }
}

export default PreviewErrorBoundary;

