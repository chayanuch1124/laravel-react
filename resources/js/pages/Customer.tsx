import React, { useEffect, useState } from 'react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        purchase_history: '',
    });
    const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    purchase_history?: string;
}>({});


    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = () => {
        fetch(`/api/customers?search=${encodeURIComponent(search)}`)
            .then((res) => res.json())
            .then((data) => setCustomers(data));
    };
    useEffect(() => {
        /*load front*/
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Dongle&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        /*load icon*/
        const iconLink = document.createElement('link');
        iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
        iconLink.rel = 'stylesheet';
        document.head.appendChild(iconLink);
    }, []);

    const handleExport = (format: any) => {
        fetch(`/api/customers/export?format=${format}`)
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `customers.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch((error) => {
                alert('Export failed: ' + error.message);
            });
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', email: '', phone: '', purchase_history: '' });
        setErrors({});
        setModalOpen(true);
    };

    const openEditModal = (customer: any) => {
        setModalMode('edit');
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            purchase_history: customer.purchase_history,
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleSave = () => {
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@gmail\.com$/;

        let validationErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            validationErrors.name = 'Name is required.';
        }
        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
            validationErrors.email = 'Email must end with @gmail.com.';
        }
        if (!formData.phone.trim()) {
            validationErrors.phone = 'Phone is required.';
        } else if (!phoneRegex.test(formData.phone)) {
            validationErrors.phone = 'Phone number must be exactly 10 digits.';
        }

        if (!formData.purchase_history.trim()) {
            validationErrors.purchase_history = 'Purchase history is required.';
        }

        // Set errors
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return; // prevent save

        const url = modalMode === 'add' ? '/api/customers' : `/api/customers/${selectedCustomer.id}`;
        const method = modalMode === 'add' ? 'POST' : 'PUT';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to save customer');
                return res.json();
            })
            .then(() => {
                fetchCustomers();
                closeModal();
            })
            .catch((err) => alert(err.message));
    };

    const handleDelete = (customer: any) => {
        if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
            fetch(`/api/customers/${customer.id}`, { method: 'DELETE' })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to delete customer');
                    fetchCustomers();
                })
                .catch((err) => alert(err.message));
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Customer List</h1>
            <input
                type="text"
                placeholder="Search by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
            />
            <div style={{ ...styles.buttonGroup, justifyContent: 'space-between' }}>
                <button
                    style={{
                        ...styles.button,
                        backgroundColor: '#fff', // พื้นหลังขาว
                        color: '#28a745', // ตัวอักษรสีเขียว
                        border: '2px solid #28a745', // ขอบสีเขียว
                        borderRadius: '30px', // มุมโค้งมน
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxSizing: 'border-box', // สำคัญมาก! ฟิกขนาดรวมถึงขอบด้วย
                        padding: '5px 16px',
                    }}
                    onClick={openAddModal}
                >
                    <i className="fas fa-user-plus" style={{ fontSize: 20 }}></i>
                </button>

                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        style={{
                            ...styles.button,
                            backgroundColor: '#fff', // พื้นหลังขาว
                            color: '#28a745', // สีเขียว
                            border: '2px solid #28a745', // ขอบสีเขียว
                            borderRadius: '30px', // มุมมน
                        }}
                        onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    >
                        Export{' '}
                        <i
                            className="fas fa-file-export"
                            style={{
                                marginLeft: 8,
                                marginTop: 2, // ระยะห่างจากด้านบน
                                position: 'relative',
                                top: '3px', // เลื่อนไอคอนลงมาจากด้านบน (ตัวเลือกอีกแบบ)
                            }}
                        ></i>
                    </button>

                    {exportDropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                borderRadius: 6,
                                marginTop: 4,
                                zIndex: 1000,
                                minWidth: 160,
                            }}
                        >
                            <button
                                style={{
                                    ...styles.button,
                                    width: '100%',
                                    borderRadius: '6px 6px 0 0',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    color: '#28a745',
                                    fontSize: '25px',
                                    textAlign: 'left',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    handleExport('csv');
                                    setExportDropdownOpen(false);
                                }}
                            >
                                Export CSV
                            </button>
                            <button
                                style={{
                                    ...styles.button,
                                    width: '100%',
                                    borderRadius: '0 0 6px 6px',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    color: '#28a745',
                                    fontSize: '25px',
                                    textAlign: 'left',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderTop: '1px solid #eee',
                                }}
                                onClick={() => {
                                    handleExport('xlsx');
                                    setExportDropdownOpen(false);
                                }}
                            >
                                Export Excel
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Phone</th>
                        <th style={styles.th}>Purchase History</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer: any) => (
                        <tr key={customer.id} style={styles.tr}>
                            <td style={styles.td}>{customer.name}</td>
                            <td style={styles.td}>{customer.email}</td>
                            <td style={styles.td}>{customer.phone}</td>
                            <td style={styles.td}>{customer.purchase_history}</td>
                            <td style={styles.td}>
                                <button
                                    onClick={() => openEditModal(customer)}
                                    style={{ ...styles.iconButton, marginRight: 8 }}
                                    aria-label="Edit Customer"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>

                                <button
                                    onClick={() => handleDelete(customer)}
                                    style={{ ...styles.iconButton, color: 'red' }}
                                    aria-label="Delete Customer"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.h2}>{modalMode === 'add' ? 'Add Customer' : 'Edit Customer'}</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    setErrors({ ...errors, name: '' }); // clear error on input
                                }}
                                style={styles.input}
                            />
                            {errors.name && <div style={{ color: 'red', fontSize: 18 }}>{errors.name}</div>}
                        </label>

                        <label>
                            Email:
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    setErrors({ ...errors, email: '' });
                                }}
                                style={styles.input}
                            />
                            {errors.email && <div style={{ color: 'red', fontSize: 18 }}>{errors.email}</div>}
                        </label>
                        <label>
                            Phone:
                            <input
                                type="text"
                                value={formData.phone}
                                
                                onChange={(e) => {
                                    setFormData({ ...formData, phone: e.target.value });
                                    setErrors({ ...errors, phone: '' });
                                }}
                                style={styles.input}
                            />
                            {errors.phone && <div style={{ color: 'red', fontSize: 18 }}>{errors.phone}</div>}
                        </label>
                        <label>
                            Purchase History:
                            <textarea
                                value={formData.purchase_history}
                                
                                onChange={(e) => {
                                    setFormData({ ...formData, purchase_history: e.target.value });
                                    setErrors({ ...errors, purchase_history: '' });
                                }}
                                style={styles.textarea}
                            />
                            {errors.purchase_history && <div style={{ color: 'red', fontSize: 18 }}>{errors.purchase_history}</div>}
                        </label>
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <button
                                style={{
                                    ...styles.button,
                                    width: '80px',
                                    boxSizing: 'border-box',
                                }}
                                onClick={handleSave}
                            >
                                {modalMode === 'add' ? 'Add' : 'Save'}
                            </button>
                            <button
                                onClick={closeModal}
                                style={{
                                    ...styles.button,
                                    backgroundColor: '#6c757d',
                                    width: '80px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
        fontFamily: `'Dongle', Segoe UI, Tahoma, Geneva, Verdana, sans-serif`,
        fontSize: '25px',
        color: '#333',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    header: {
        marginBottom: 9,
        fontWeight: 600,
        fontSize: '50px',
        textAlign: 'center',
        color: '#222',
    },
    searchInput: {
        width: '100%',
        padding: '1px 10px',
        fontSize: '25px',
        borderRadius: 6,
        fontFamily: "'Dongle', sans-serif",
        border: '1px solid #ccc',
        marginBottom: 20,
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        gap: 12,
        marginBottom: 20,
    },
    button: {
        padding: '5px 10px',
        fontSize: '25px',
        borderRadius: 6,
        border: 'none',
        fontFamily: "'Dongle', sans-serif",
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        transition: 'background-color 0.2s',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: 6,
        boxShadow: '0 0 5px rgba(0,0,0,0.05)',
    },
    th: {
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '2px solid #ddd',
        backgroundColor: '#f1f3f5',
        fontWeight: 600,
        color: '#555',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        color: '#444',
    },
    tr: {
        transition: 'background-color 0.2s',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(6px)', // เพิ่มเบลอพื้นหลัง
        WebkitBackdropFilter: 'blur(6px)', // รองรับ Safari
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    h2: {
        marginTop: 0,
        marginBottom: '1px',
    },

    modalContent: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Dongle', sans-serif",
        color: '#222',

        transition: 'all 0.3s ease-in-out',
    },

    input: {
        padding: '1px 10px',
        fontSize: '25px',
        borderRadius: 8,
        border: '1px solid #ccc',
        fontFamily: "'Dongle', sans-serif",
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    textarea: {
        padding: '10px 14px',
        fontSize: '25px',
        borderRadius: 8,
        border: '1px solid #ccc',
        fontFamily: "'Dongle', sans-serif",
        outline: 'none',
        width: '100%',
        resize: 'vertical',
        minHeight: 80,
        boxSizing: 'border-box',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        padding: 0,
        lineHeight: 1,
        color: '#007bff',
        transition: 'color 0.2s',
    },
};

export default Customers;
