import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { loginHr, saveSession } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const result = await loginHr(form);
      saveSession(result.data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">HR Authentication</p>
        <h1>Login</h1>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button className="button primary" type="submit"><LogIn size={18} /> Login</button>
        {message && <div className="upload-status error">{message}</div>}
        <p className="auth-switch">New HR user? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
