import { ApiInitializer } from '../main/initializer/ApiInitializer';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <ApiInitializer />
      <main className='flex flex-col items-center justify-center h-full w-full ml-auto mr-auto max-sm:max-w-full sm:max-w-[400px]'>
        <LoginForm />
      </main>
    </div>
  );
}
