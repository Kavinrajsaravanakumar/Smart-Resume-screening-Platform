import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerHr, saveSession } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const result = await registerHr(form);
      saveSession(result.data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">HR Authentication</p>
        <h1>Register</h1>
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button className="button primary" type="submit"><UserPlus size={18} /> Register</button>
        {message && <div className="upload-status error">{message}</div>}
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
