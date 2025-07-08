// app/(auth)/login/page.js
import { signIn } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  async function handleLogin(formData) {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');
    const result = await signIn(email, password);
    
    if (result) {
      redirect('/dashboard/listings');
    } else {
      redirect('/auth/login?error=Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Admin Dashboard Login</h2>
        <form className="mt-8 space-y-6" action={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}