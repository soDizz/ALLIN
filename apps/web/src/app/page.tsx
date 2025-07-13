'use client';

import { Toaster } from '@/components/ui/sonner';
import { Main } from './main/Main';
import { LeftPanel } from './main/leftPanel/LeftPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  initToolManager,
  ToolManagerContext,
} from './tools/ToolManagerContext';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className='flex flex-row h-0 items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <QueryClientProvider client={queryClient}>
        <ToolManagerContext value={initToolManager()}>
          <LeftPanel />
          <Main />
          <Toaster richColors duration={3000} />
        </ToolManagerContext>
      </QueryClientProvider>
    </div>
  );
}
