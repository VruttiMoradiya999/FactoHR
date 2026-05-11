import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import {
    Search,
    X,
    Loader2,
    ChevronDown,
    Plus,
    MoreHorizontal,
    Briefcase,
    Mail,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmployeeManagement = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [filterDept, setFilterDept] = useState('All');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', department: '', designation: ''
    });

    useEffect(() => { fetchEmployees(); }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/employees`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setFormData({ name: employee.name, email: employee.email, password: '', department: employee.department, designation: employee.designation });
        } else {
            setCurrentEmployee(null);
            setFormData({ name: '', email: '', password: '', department: '', designation: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEmployee) {
                await axios.put(`${API_URL}/employees/${currentEmployee._id}`, formData, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });
            } else {
                await axios.post(`${API_URL}/employees`, formData, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });
            }
            fetchEmployees();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            try {
                await axios.delete(`${API_URL}/employees/${id}`, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });
                fetchEmployees();
            } catch (error) { alert('Failed'); }
        }
    };

    const departments = ['All', ...new Set(employees.map(e => e.department))];

    let filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || emp.department === filterDept;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="animate-slide">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Team Members</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your workforce and their roles.</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 12px 10px 40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}
                    />
                </div>
                <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    style={{ width: '200px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" /></div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredEmployees.map(emp => (
                        <motion.div 
                            key={emp._id} 
                            className="track-card"
                            whileHover={{ translateY: -5 }}
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => navigate(`/employees/${emp._id}`)}
                        >
                            <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
                                <MoreHorizontal size={20} />
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${emp.name}&background=random&color=fff`} 
                                    style={{ width: '60px', height: '60px', borderRadius: '50%' }} 
                                />
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{emp.name}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500 }}>{emp.designation}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Briefcase size={14} /> {emp.department}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={14} /> {emp.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={14} /> Joined {new Date(emp.joiningDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(emp); }}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'white', fontSize: '12px', fontWeight: 600 }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(emp._id); }}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ 
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
                    }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="track-card" style={{ width: '450px', position: 'relative' }}
                        >
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none' }}>
                                <X size={20} />
                            </button>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>{currentEmployee ? 'Edit Member' : 'Add New Member'}</h2>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                {!currentEmployee && <input placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />}
                                <input placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                <input placeholder="Designation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required style={{ backgroundColor: '#f8f9fd' }} />
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                    {currentEmployee ? 'Save Changes' : 'Add Member'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeManagement;
