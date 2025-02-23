// components/ErrorBoundary.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text>Something went wrong. Please try again later.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;