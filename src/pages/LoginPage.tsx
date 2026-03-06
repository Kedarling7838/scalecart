import { useState } from 'react';
import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function LoginPage() {
  const { login, register, adminLogin, guestLogin, googleLogin, isLoggedIn, username, role, logout } = useSimulation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <p className="text-foreground">Logged in as <span className="font-mono text-primary">{username}</span></p>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">{role}</span>
        <Button variant="outline" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'admin') {
      if (!adminLogin(user, pass)) setError('Invalid admin credentials (admin / admin123)');
      else navigate('/admin');
    } else if (mode === 'register') {
      if (!register(user, pass)) setError('Username is required or already taken');
      else navigate('/products');
    } else {
      if (!login(user, pass)) setError('Username is required');
      else navigate('/products');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-full max-w-sm border border-border rounded-lg bg-card p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground text-center">
          {mode === 'admin' ? 'Admin Login' : mode === 'register' ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} className="bg-secondary" />
          <Input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} className="bg-secondary" />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {mode === 'register' ? 'Create Account' : 'Login'}
          </Button>
        </form>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => { googleLogin(); navigate('/products'); }}>
            🔵 Continue with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => { guestLogin(); navigate('/products'); }}>
            👤 Guest Mode – Explore Store
          </Button>
        </div>

        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <button onClick={() => setMode('login')} className={mode === 'login' ? 'text-primary font-medium' : ''}>Login</button>
          <button onClick={() => setMode('register')} className={mode === 'register' ? 'text-primary font-medium' : ''}>Register</button>
          <button onClick={() => setMode('admin')} className={mode === 'admin' ? 'text-primary font-medium' : ''}>Admin</button>
        </div>
      </div>
    </div>
  );
}
