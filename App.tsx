// TH2 | 23731461 | LE QUAY CHE | #664791
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from '@navigation/RootNavigator';
import Watermark from '@components/Watermark';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <Watermark />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
