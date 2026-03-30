import { useState } from 'react';
import { LogIn, UserPlus, Lock, User } from 'lucide-react';

interface LoginProps {
    onLogin: (user: any) => void;
    onGoToRegister: () => void;
}

export function Login({ onLogin, onGoToRegister }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resp = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await resp.json();

            if (data.success) {
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-panel hover-glow">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="text-muted auth-subtitle">Enter your credentials to access the analytics dashboard.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            className="auth-input hover-border"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            className="auth-input hover-border"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button interactive-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : <><LogIn size={20} /> Login</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-muted">Don't have an account?</p>
                    <button onClick={onGoToRegister} className="text-btn hover-underline">
                        Register as a new user <UserPlus size={16} style={{ display: 'inline', marginLeft: '4px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
