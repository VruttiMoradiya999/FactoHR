import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    Bell,
    MessageCircle,
    Settings,
    LayoutDashboard,
    Briefcase,
    FileText,
    Calendar,
    LogOut,
    X,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Team', path: '/employees', icon: Briefcase },
        { name: 'Leaves', path: '/leaves', icon: FileText },
        { name: 'Schedule', path: '/attendance', icon: Calendar },
    ];

    const notifications = [
        { id: 1, title: 'New Leave Request', time: '5m ago', desc: 'John Doe requested sick leave' },
        { id: 2, title: 'Attendance Alert', time: '1h ago', desc: '3 employees marked late today' },
        { id: 3, title: 'System Update', time: '2h ago', desc: 'Dashboard v2.0 is now live' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            {/* TOP NAVIGATION */}
            <header style={{
                backgroundColor: 'white',
                padding: '12px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                            width: '32px', height: '32px', backgroundColor: 'var(--text-main)', 
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>TrackPro</span>
                    </div>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', gap: '8px' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                            <Bell 
                                size={20} 
                                style={{ cursor: 'pointer', color: showNotifications ? 'var(--primary)' : 'inherit' }} 
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                            {notifications.length > 0 && <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>}
                            
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        style={{ position: 'absolute', top: '35px', right: '-50px', width: '300px', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow)', padding: '16px', zIndex: 1000 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h4 style={{ fontWeight: 700, color: 'var(--text-main)' }}>Notifications</h4>
                                            <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {notifications.map(n => (
                                                <div key={n.id} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#f5f3ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                                        <Check size={16} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</p>
                                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</p>
                                                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{n.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <MessageCircle size={20} style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
                        
                        {/* Settings */}
                        <Settings 
                            size={20} 
                            style={{ cursor: 'pointer', color: showSettings ? 'var(--primary)' : 'inherit' }} 
                            onClick={() => setShowSettings(true)}
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=8b5cf6&color=fff`}
                            alt="Avatar" 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0', cursor: 'pointer'
                            }}
                        />
                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute', top: '48px', right: 0, width: '180px',
                                        backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px',
                                        boxShadow: 'var(--shadow)', padding: '8px', overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '13px' }}>{user?.name}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.email}</p>
                                    </div>
                                    <button onClick={handleLogout} style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px', backgroundColor: 'transparent', color: '#ef4444',
                                        fontSize: '13px', borderRadius: '6px', border: 'none', cursor: 'pointer'
                                    }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <LogOut size={14} /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="track-card" style={{ width: '500px', position: 'relative' }}
                        >
                            <button onClick={() => setShowSettings(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Settings</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Theme Preference</h4>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid var(--primary)', backgroundColor: '#f8f9fd', textAlign: 'center', cursor: 'pointer' }}>
                                            <p style={{ fontSize: '13px', fontWeight: 600 }}>Light Mode</p>
                                        </div>
                                        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: '#1e293b', color: 'white', textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
                                            <p style={{ fontSize: '13px', fontWeight: 600 }}>Dark Mode (Soon)</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Email Notifications</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8f9fd', borderRadius: '12px' }}>
                                        <span style={{ fontSize: '13px' }}>Notify me about new requests</span>
                                        <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--primary)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSettings(false)}>
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main style={{ padding: '32px 40px' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
