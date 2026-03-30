import { useState } from 'react';
import { UserPlus, ArrowLeft, User, Lock, Mail, Phone, Calendar } from 'lucide-react';

interface RegisterProps {
    onGoToLogin: () => void;
}

export function Register({ onGoToLogin }: RegisterProps) {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        age: '',
        phone: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resp = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age) || 0
                })
            });
            const data = await resp.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onGoToLogin();
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="glass-panel auth-panel success-glow">
                    <h2 className="auth-title" style={{ color: 'var(--status-up)' }}>Registration Successful!</h2>
                    <p className="text-muted" style={{ textAlign: 'center', marginTop: '16px' }}>
                        Welcome to the platform, {formData.name}. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="glass-panel auth-panel register-panel hover-glow">
                <button onClick={onGoToLogin} className="back-btn interactive-icon">
                    <ArrowLeft size={24} />
                </button>

                <h2 className="auth-title">Create Account</h2>
                <p className="text-muted auth-subtitle">Join to access real-time Big Data analytics.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form two-col-form">
                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text" name="name" className="auth-input hover-border"
                            placeholder="Full Name" required
                            value={formData.name} onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text" name="username" className="auth-input hover-border"
                            placeholder="Username" required
                            value={formData.username} onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <Calendar className="input-icon" size={20} />
                        <input
                            type="number" name="age" className="auth-input hover-border"
                            placeholder="Age" required min="18"
                            value={formData.age} onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <Phone className="input-icon" size={20} />
                        <input
                            type="tel" name="phone" className="auth-input hover-border"
                            placeholder="Phone Number" required
                            value={formData.phone} onChange={handleChange}
                        />
                    </div>

                    <div className="input-group full-width">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email" name="email" className="auth-input hover-border"
                            placeholder="Email ID" required
                            value={formData.email} onChange={handleChange}
                        />
                    </div>

                    <div className="input-group full-width">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password" name="password" className="auth-input hover-border"
                            placeholder="Password" required minLength={6}
                            value={formData.password} onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="auth-button interactive-btn full-width" disabled={loading} style={{ marginTop: '16px' }}>
                        {loading ? 'Registering...' : <><UserPlus size={20} /> Register</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
