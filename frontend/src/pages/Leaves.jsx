import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
    FilePlus, 
    X,
    Loader2,
    CheckCircle2,
    XCircle,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Leaves = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave', startDate: '', endDate: '', reason: ''
    });

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/leaves`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setLeaves(data);
        } catch (error) {
            console.error('Error fetching leaves', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/leaves`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchLeaves();
            setIsModalOpen(false);
        } catch (error) { alert('Failed'); }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/leaves/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchLeaves();
        } catch (error) { alert('Failed'); }
    };

    return (
        <div className="animate-slide">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Leave Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track and process time-off applications.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ width: 'fit-content' }}>
                    <FilePlus size={18} /> Apply Leave
                </button>
            </div>

            <div className="track-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Request History</h3>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fd', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                {user.role === 'admin' && <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Employee</th>}
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Duration</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '48px' }}><Loader2 className="animate-spin" /></td></tr>
                            ) : leaves.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No requests found.</td></tr>
                            ) : leaves.map((leave) => (
                                <tr key={leave._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {user.role === 'admin' && (
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${leave.user?.name || 'U'}&background=random&color=fff`} 
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                                                />
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{leave.user?.name}</p>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{leave.user?.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '14px' }}>{leave.leaveType}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            <MessageSquare size={12} /> {leave.reason}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} />
                                            {new Date(leave.startDate).toLocaleDateString()} – {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                            backgroundColor: leave.status === 'Approved' ? '#dcfce7' : leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                                            color: leave.status === 'Approved' ? '#166534' : leave.status === 'Rejected' ? '#991b1b' : '#92400e'
                                        }}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        {user.role === 'admin' && leave.status === 'Pending' && (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                                <button onClick={() => handleUpdateStatus(leave._id, 'Approved')} style={{ color: 'var(--success)', background: 'none', cursor: 'pointer' }}>
                                                    <CheckCircle2 size={20} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(leave._id, 'Rejected')} style={{ color: '#ef4444', background: 'none', cursor: 'pointer' }}>
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="track-card" style={{ width: '450px', position: 'relative' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none' }}><X size={20} /></button>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Apply for Leave</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <select value={formData.leaveType} onChange={(e) => setFormData({...formData, leaveType: e.target.value})} style={{ backgroundColor: '#f8f9fd', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Paid Leave">Paid Leave</option>
                                </select>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                </div>
                                <textarea placeholder="Reason for leave" rows="3" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required style={{ backgroundColor: '#f8f9fd', borderRadius: '12px', border: '1px solid var(--border)', padding: '12px', resize: 'none' }} />
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Submit Request</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaves;
