'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LeftPanel } from './main/leftPanel/LeftPanel';
import { Main } from './main/Main';
import {
  initToolManager,
  ToolManagerContext,
} from './tools/ToolManagerContext';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className='flex flex-row h-0 items-center justify-center min-h-screen max-sm:h-[100dvh] font-[family-name:var(--font-geist-sans)]'>
      <QueryClientProvider client={queryClient}>
        <ToolManagerContext value={initToolManager()}>
          <LeftPanel />
          <Main />
          {/* <RightPanel /> */}
          <Toaster richColors duration={3000} />
        </ToolManagerContext>
      </QueryClientProvider>
    </div>
  );
}
