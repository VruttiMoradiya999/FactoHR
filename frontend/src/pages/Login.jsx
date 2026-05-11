import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: 'var(--bg-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo & Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <div style={{ 
                        width: '48px', height: '48px', backgroundColor: 'var(--text-main)', 
                        borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', boxShadow: 'var(--shadow)'
                    }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '6px' }}></div>
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-main)' }}>TrackPro</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Team Management System Portal</p>
                </motion.div>

                {/* Login Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="track-card"
                    style={{ padding: '32px' }}
                >
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fee2e2',
                                    color: '#ef4444',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    marginBottom: '24px',
                                    textAlign: 'center'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: '40px', backgroundColor: '#f8f9fd', border: '1px solid var(--border)', borderRadius: '12px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600 }}>Password</label>
                                <span style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer' }}>Forgot?</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '40px', backgroundColor: '#f8f9fd', border: '1px solid var(--border)', borderRadius: '12px' }}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '12px' }}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </motion.div>

                {/* Demo Credentials */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginTop: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>DEMO ACCOUNTS</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    </div>

                    <div className="login-demo-grid">
                        <div 
                            onClick={() => { setEmail('admin@gmail.com'); setPassword('password'); }}
                            style={{ 
                                padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)',
                                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                                <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Admin</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to fill</p>
                        </div>
                        <div 
                            onClick={() => { setEmail('employee@gmail.com'); setPassword('password'); }}
                            style={{ 
                                padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)',
                                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--secondary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#fdf2f8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                                <User size={24} style={{ color: 'var(--secondary)' }} />
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Employee</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to fill</p>
                        </div>
                    </div>
                </motion.div>

                <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Contact HR</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
