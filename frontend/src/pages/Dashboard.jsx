import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    MoreHorizontal, 
    Play, 
    ChevronDown, 
    Search,
    Clock,
    Send,
    Calendar,
    MessageCircle,
    StickyNote,
    Bell,
    Check
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({
        presentToday: 0,
        totalLeaves: 0,
        attendanceRate: 0
    });

    // Chat State
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Robert', text: 'Today we will have a scrum meeting at 10 pm.', type: 'received', time: '10:00 AM' },
        { id: 2, sender: 'You', text: 'Okay, I will be there.', type: 'sent', time: '10:05 AM' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, overviewRes] = await Promise.all([
                    axios.get(`${API_URL}/employees`, { headers: { Authorization: `Bearer ${user.token}` } }),
                    axios.get(`${API_URL}/employees/${user._id}/overview`, { headers: { Authorization: `Bearer ${user.token}` } })
                ]);
                
                setEmployees(empRes.data);
                
                const attendance = overviewRes.data.attendance || [];
                const presentCount = attendance.filter(a => a.status === 'Present').length;
                const rate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;
                
                setStats({
                    presentToday: presentCount,
                    totalLeaves: (overviewRes.data.leaves || []).length,
                    attendanceRate: Math.round(rate)
                });
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };

        if (user) fetchData();
    }, [user]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'You',
            text: inputMessage,
            type: 'sent',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    const weekDays = [
        { date: '10', day: 'Thu' },
        { date: '11', day: 'Fri' },
        { date: '12', day: 'Sat' },
        { date: '13', day: 'Sun', active: true },
        { date: '14', day: 'Mon' },
        { date: '15', day: 'Tue' },
        { date: '16', day: 'Wed' },
    ];

    return (
        <div className="animate-slide">
            {/* HEADER SECTION */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Manage and Track Your Team</p>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Team Dashboard</h1>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Attendance</p>
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>{stats.attendanceRate}%</span>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Team Size</p>
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>{employees.length}</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            style={{ 
                                padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid var(--border)', 
                                backgroundColor: 'white', width: '160px', fontSize: '13px' 
                            }} 
                        />
                    </div>
                    
                    <button className="btn-primary" onClick={() => navigate('/employees')} style={{ fontSize: '14px' }}>
                        <Plus size={16} /> Add Member
                    </button>
                </div>
            </div>

            {/* MIDDLE SECTION */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                {/* Manage Requests Card */}
                <div className="track-card purple-gradient" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, maxWidth: '150px' }}>Manage Requests</h2>
                        <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/leaves')}>
                            <Play size={16} style={{ transform: 'rotate(-45deg)' }} />
                        </div>
                    </div>

                    <button style={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '20px', 
                        padding: '8px 16px', width: 'fit-content', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
                    }} onClick={() => navigate('/leaves')}>
                        <Plus size={14} /> View All
                    </button>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Internal Meeting</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>02.00 pm - 04.00 pm</p>
                        <button style={{ 
                            width: '100%', padding: '8px', borderRadius: '10px', border: 'none', 
                            backgroundColor: '#e9d5ff', color: 'var(--primary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' 
                        }}>
                            Start Meeting
                        </button>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="track-card" style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Team Timeline</h3>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                                <Calendar size={14} /> Aug 10-16
                            </span>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: '500px' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                <div style={{ width: '120px', color: 'var(--text-muted)', fontSize: '12px' }}>Team</div>
                                {weekDays.map(d => (
                                    <div key={d.date} style={{ 
                                        flex: 1, textAlign: 'center', fontSize: '12px', color: d.active ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: d.active ? 600 : 400
                                    }}>{d.date} {d.day}</div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                                {employees.slice(0, 5).map((emp, i) => (
                                    <div key={emp._id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp._id}`)}>
                                            <img src={`https://ui-avatars.com/api/?name=${emp.name}&background=random&color=fff`} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                            <span style={{ fontSize: '12px', fontWeight: 500 }}>{emp.name.split(' ')[0]}</span>
                                        </div>
                                        <div style={{ flex: 1, position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
                                            {weekDays.map((_, idx) => (
                                                <div key={idx} style={{ flex: 1, borderRight: '1px solid #f1f5f9', height: '100%' }}></div>
                                            ))}
                                            <div style={{ 
                                                position: 'absolute', left: `${[20, 10, 40, 5, 30][i]}%`, width: `${[40, 60, 30, 80, 45][i]}%`,
                                                height: '20px', backgroundColor: ['#fef3c7', '#fdf2f8', '#e0f2fe', '#f0fdf4', '#f5f3ff'][i % 5],
                                                border: `1px solid ${['#fcd34d', '#f9a8d4', '#7dd3fc', '#86efac', '#c4b5fd'][i % 5]}`,
                                                borderRadius: '6px', fontSize: '10px', padding: '0 8px', display: 'flex', alignItems: 'center', color: 'var(--text-main)'
                                            }}>{['Arch', 'Dev', 'UI', 'API', 'Data'][i % 5]}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="dashboard-bottom-grid">
                {/* Work Schedule */}
                <div className="track-card">
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Work Schedule</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>{d}</div>
                        ))}
                        {[...Array(21)].map((_, i) => {
                            const day = i + 1;
                            const isToday = day === 13;
                            return (
                                <div key={day} style={{ 
                                    height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                                    borderRadius: '50%', backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                                    color: isToday ? 'white' : 'var(--text-main)', fontWeight: isToday ? 700 : 400
                                }}>{day}</div>
                            );
                        })}
                    </div>
                </div>

                {/* Attendance Radial */}
                <div className="track-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', alignSelf: 'flex-start' }}>Attendance</h3>
                    <div style={{ position: 'relative', width: '140px', height: '140px', cursor: 'pointer' }} onClick={() => navigate('/attendance')}>
                        <svg width="140" height="140" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray={`${stats.attendanceRate * 2.83} 283`} transform="rotate(-90 50 50)" strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '24px', fontWeight: 700 }}>{stats.attendanceRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Team Chat */}
                <div className="track-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <MessageCircle size={16} /> Team Chat
                    </h3>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <div style={{ 
                                    backgroundColor: msg.type === 'sent' ? '#fce7f3' : '#f5f3ff', 
                                    padding: '8px 12px', borderRadius: '12px', fontSize: '11px'
                                }}>{msg.text}</div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} style={{ marginTop: '12px', position: 'relative' }}>
                        <input type="text" placeholder="Type..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} style={{ padding: '8px 36px 8px 12px', borderRadius: '16px', border: 'none', backgroundColor: '#f8f9fd', width: '100%', fontSize: '11px' }} />
                        <button type="submit" style={{ position: 'absolute', right: '4px', top: '4px', width: '24px', height: '24px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer' }}><Send size={12} /></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
