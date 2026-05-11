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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Manage and Track Your Team</p>
                    <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Team Dashboard</h1>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Attendance Rate</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.attendanceRate}%</span>
                                <span style={{ fontSize: '10px', color: 'var(--success)', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '10px' }}>+15%</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Employees</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 700 }}>{employees.length}</span>
                                <span style={{ fontSize: '10px', color: '#ef4444', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '10px' }}>-2%</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Leaves</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalLeaves}</span>
                                <span style={{ fontSize: '10px', color: 'var(--success)', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '10px' }}>+5%</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            style={{ 
                                padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid var(--border)', 
                                backgroundColor: 'white', width: '200px', fontSize: '13px' 
                            }} 
                        />
                    </div>
                    
                    <button className="btn-primary" onClick={() => navigate('/employees')}>
                        <Plus size={18} /> Add Member
                    </button>
                </div>
            </div>

            {/* MIDDLE SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                {/* Manage Requests Card */}
                <div className="track-card purple-gradient" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 600, maxWidth: '150px' }}>Manage Requests</h2>
                        <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/leaves')}>
                            <Play size={16} style={{ transform: 'rotate(-45deg)' }} />
                        </div>
                    </div>

                    <button style={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '20px', 
                        padding: '10px 20px', width: 'fit-content', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
                    }} onClick={() => navigate('/leaves')}>
                        <Plus size={16} /> View All
                    </button>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Internal Meeting</h4>
                            <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Time: 02.00 pm - 04.00 pm</p>
                        <button style={{ 
                            width: '100%', padding: '10px', borderRadius: '12px', border: 'none', 
                            backgroundColor: '#e9d5ff', color: 'var(--primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' 
                        }}>
                            Start Meeting
                        </button>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="track-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Team Timeline</h3>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                <Calendar size={14} /> August 10 - 16, 2025
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, cursor: 'pointer' }}>
                                This Week <ChevronDown size={14} />
                            </span>
                        </div>
                    </div>

                    {/* Timeline Grid */}
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: '600px' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                <div style={{ width: '150px', color: 'var(--text-muted)', fontSize: '13px' }}>Employees</div>
                                {weekDays.map(d => (
                                    <div key={d.date} style={{ 
                                        flex: 1, textAlign: 'center', fontSize: '13px', color: d.active ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: d.active ? 600 : 400
                                    }}>
                                        {d.date} {d.day}
                                    </div>
                                ))}
                            </div>

                            {/* Timeline Rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                                {employees.slice(0, 6).map((emp, i) => (
                                    <div key={emp._id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '150px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp._id}`)}>
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${emp.name}&background=random&color=fff`} 
                                                style={{ width: '28px', height: '28px', borderRadius: '50%' }} 
                                            />
                                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{emp.name.split(' ')[0]}</span>
                                        </div>
                                        <div style={{ flex: 1, position: 'relative', height: '36px', display: 'flex', alignItems: 'center' }}>
                                            {weekDays.map((_, idx) => (
                                                <div key={idx} style={{ flex: 1, borderRight: '1px solid #f1f5f9', height: '100%' }}></div>
                                            ))}
                                            <div style={{ 
                                                position: 'absolute', 
                                                left: `${[20, 10, 40, 5, 30, 15][i]}%`, 
                                                width: `${[40, 60, 30, 80, 45, 55][i]}%`,
                                                height: '28px',
                                                backgroundColor: ['#fef3c7', '#fdf2f8', '#e0f2fe', '#f0fdf4', '#f5f3ff', '#fff7ed'][i % 6],
                                                border: `1px solid ${['#fcd34d', '#f9a8d4', '#7dd3fc', '#86efac', '#c4b5fd', '#fdba74'][i % 6]}`,
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                padding: '0 12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                color: 'var(--text-main)'
                                            }}>
                                                {['Architecture', 'Frontend Dev', 'UI Design', 'API Integration', 'Data Flow', 'Testing'][i % 6]}
                                                <MoreHorizontal size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {/* My Task Schedule (Calendar) */}
                <div className="track-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Work Schedule</h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            August <ChevronDown size={14} />
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{d}</div>
                        ))}
                        {[...Array(21)].map((_, i) => {
                            const day = i + 1;
                            const isToday = day === 13;
                            const hasEvent = [10, 11, 12, 17, 18, 19, 20].includes(day);
                            return (
                                <div key={day} style={{ 
                                    height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
                                    borderRadius: '50%', cursor: 'pointer',
                                    backgroundColor: isToday ? 'var(--primary)' : hasEvent ? '#f1f5f9' : 'transparent',
                                    color: isToday ? 'white' : 'var(--text-main)',
                                    fontWeight: isToday ? 700 : 400
                                }}>
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Attendance Progress (Radial Chart) */}
                <div className="track-card">
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Attendance Progress</h3>
                    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '20px auto', cursor: 'pointer' }} onClick={() => navigate('/attendance')}>
                        <svg width="180" height="180" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" 
                                strokeDasharray={`${stats.attendanceRate * 2.83} 283`}
                                transform="rotate(-90 50 50)"
                                strokeLinecap="round"
                            />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                        </svg>
                        <div style={{ 
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <span style={{ fontSize: '32px', fontWeight: 700 }}>{stats.attendanceRate}%</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goal Complete</span>
                        </div>
                    </div>
                </div>

                {/* Team Chat - NOW FUNCTIONAL */}
                <div className="track-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageCircle size={18} /> Team Chat <ChevronDown size={14} />
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Bell size={12} />
                            </div>
                            <MoreHorizontal size={18} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'sent' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start', 
                                        maxWidth: '80%' 
                                    }}
                                >
                                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: msg.type === 'sent' ? '0' : '4px', textAlign: msg.type === 'sent' ? 'right' : 'left' }}>
                                        {msg.sender}
                                    </p>
                                    <div style={{ 
                                        backgroundColor: msg.type === 'sent' ? '#fce7f3' : '#f5f3ff', 
                                        color: 'var(--text-main)',
                                        padding: '10px 14px', 
                                        borderRadius: msg.type === 'sent' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', 
                                        fontSize: '12px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <p style={{ fontSize: '8px', color: '#94a3b8', marginTop: '4px', textAlign: msg.type === 'sent' ? 'right' : 'left' }}>{msg.time}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} style={{ marginTop: '20px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <StickyNote size={16} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Message Here..." 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            style={{ 
                                padding: '10px 40px', borderRadius: '20px', border: 'none', 
                                backgroundColor: '#f8f9fd', width: '100%', fontSize: '12px' 
                            }} 
                        />
                        <button type="submit" style={{ 
                            position: 'absolute', right: '4px', top: '4px', width: '28px', height: '28px', 
                            backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: 'white', cursor: 'pointer', border: 'none' 
                        }}>
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
