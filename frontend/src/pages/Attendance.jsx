import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
    Clock, 
    CheckCircle2, 
    Loader2,
    Calendar,
    ArrowRight
} from 'lucide-react';

const Attendance = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/attendance`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setRecords(data);
        } catch (error) {
            console.error('Error fetching attendance', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAttendance = async (status) => {
        setMarkingAttendance(true);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            await axios.post(`${API_URL}/attendance`, {
                status,
                timeIn: status === 'Present' ? time : null,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchRecords();
        } catch (error) {
            alert('Failed to mark attendance');
        } finally {
            setMarkingAttendance(false);
        }
    };

    const todayDate = new Date().toISOString().split('T')[0];
    const isAlreadyMarked = records.some(r => {
        const userId = typeof r.user === 'object' ? r.user._id : r.user;
        return r.date === todayDate && userId === user._id;
    });

    return (
        <div className="animate-slide">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Attendance Activity</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Monitor daily presence and contribution history.</p>
            </div>

            {user.role === 'employee' && (
                <div className="track-card" style={{ 
                    marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #dcfce7'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            backgroundColor: '#dcfce7', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
                        }}>
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Daily Check-in</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date().toDateString()}</p>
                        </div>
                    </div>

                    {isAlreadyMarked ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            fontSize: '16px', color: 'var(--success)', fontWeight: 600,
                            backgroundColor: '#dcfce7', padding: '12px 24px',
                            borderRadius: '12px'
                        }}>
                            <CheckCircle2 size={20} />
                            Checked in for today
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-primary" onClick={() => handleMarkAttendance('Present')} disabled={markingAttendance}>
                                Mark Present
                            </button>
                            <button 
                                onClick={() => handleMarkAttendance('Late')} disabled={markingAttendance}
                                style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid var(--border)', backgroundColor: 'white', fontWeight: 600 }}
                            >
                                Mark Late
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="track-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Attendance Logs</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} /> Monthly
                        </div>
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fd', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                {user.role === 'admin' && <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Employee</th>}
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Check-in</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Check-out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px' }}><Loader2 className="animate-spin" /></td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No records found.</td>
                                </tr>
                            ) : records.map((record) => (
                                <tr key={record._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {user.role === 'admin' && (
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${record.user?.name || 'U'}&background=random&color=fff`} 
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                                                />
                                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{record.user?.name}</span>
                                            </div>
                                        </td>
                                    )}
                                    <td style={{ padding: '16px 24px', fontSize: '14px' }}>{new Date(record.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                            backgroundColor: record.status === 'Present' ? '#dcfce7' : record.status === 'Late' ? '#fef3c7' : '#fee2e2',
                                            color: record.status === 'Present' ? '#166534' : record.status === 'Late' ? '#92400e' : '#991b1b'
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>{record.timeIn || '--:--'}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)', textAlign: 'right' }}>{record.timeOut || '--:--'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
