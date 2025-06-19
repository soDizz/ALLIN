'use client';

import { Toaster } from '@/components/ui/sonner';
import { Main } from './main/Main';
import { LeftPanel } from './main/leftPanel/LeftPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function Home() {
  return (
    <div className='flex flex-row h-0 items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <QueryClientProvider client={queryClient}>
        <LeftPanel />
        <Main />
        <Toaster richColors duration={2000} />
      </QueryClientProvider>
    </div>
  );
}
