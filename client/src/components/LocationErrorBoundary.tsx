import React from "react";
import { Button } from "@/components/ui/button";

interface LocationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LocationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  LocationErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LocationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("LocationPicker error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 w-full border rounded-md bg-muted">
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-2">
              Unable to load map component
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LocationErrorBoundary;
