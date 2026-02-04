import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-red-700 font-semibold">Oops! Something went wrong.</p>
    <p className="text-red-600 mt-2">{message}</p>
  </div>
);

export default ErrorDisplay;
