import { rx } from '@/lib/rxjs/rx';

type AIModel = 'gpt-4.1' | 'gpt-4.1-nano';

export const aiModel$$ = rx<AIModel>('gpt-4.1');
