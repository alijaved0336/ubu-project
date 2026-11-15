import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in Error Boundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; 
    }

    return this.props.children;
  }
}

const ErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();

  if (React.Children.toArray(children).some(child => child.props.hasError)) {
    navigate('/404');
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;
