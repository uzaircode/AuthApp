import React from 'react';
import { AuthProvider } from './src/context/auth-context';
import AppNavigator from './src/navigation/app-navigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
