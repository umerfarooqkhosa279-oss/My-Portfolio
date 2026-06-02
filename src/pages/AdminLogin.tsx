import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage('Checking secure login...');
    try {
      await signIn(username, password);
      navigate('/admin');
    } catch (error: any) {
      setMessage(error.message || 'Login failed.');
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl dark:bg-slate-900">
        <Link to="/" className="text-sm font-bold text-brand-primary">← Back to website</Link>
        <div className="mt-8 grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-brand-primary dark:bg-teal-950"><Lock /></div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-950 dark:text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use the admin username/email and password created in Supabase Auth.</p>
        <div className="mt-6 grid gap-4">
          <label><span className="admin-label">Admin Username or Email</span><input className="admin-input mt-1" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" /></label>
          <label><span className="admin-label">Password</span><input className="admin-input mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button className="focus-ring rounded-xl bg-brand-primary px-5 py-3 font-bold text-white">Login</button>
          {message && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{message}</p>}
        </div>
      </form>
    </div>
  );
}
