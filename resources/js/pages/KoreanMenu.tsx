import BootstrapLayout from '@/layouts/BootstrapLayout';
import { useEffect, useRef, useState } from 'react';

interface Dish {
    id: number;
    image: string;
    name: string;
    rating: number;
    price: number;
    description: string;
}

export default function KoreanMenu() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        fetch('/api/KoreanDish')
            .then((res) => res.json())
            .then((data) => setDishes(data));
    }, []);
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

    const handleSubmit = async () => {
        const { name, description, rating, price, image } = form;

        if (!name || !description || !image || rating <= 0 || price <= 0) {
            showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/KoreanDish/${editingId}` : '/api/KoreanDish';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to save');

            // ดึงข้อมูลล่าสุดหลังบันทึก
            const updatedDishes = await fetch('/api/KoreanDish').then((res) => res.json());
            setDishes(updatedDishes);

            showToast(editingId ? 'แก้ไขเมนูสำเร็จแล้ว' : 'เพิ่มเมนูสำเร็จแล้ว', 'success');
            setShowModal(false);
            setEditingId(null);
            setForm({ name: '', description: '', rating: 0, price: 0, image: '' });
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการบันทึกเมนู');
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        const scrollAmount = 270; // ปรับตามขนาด card
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<any>({
        name: '',
        description: '',
        rating: 0,
        price: 0,
        image: '',
    });
    const handleEdit = (dish: Dish) => {
        setForm({
            name: dish.name,
            description: dish.description,
            rating: dish.rating,
            price: dish.price,
            image: dish.image,
        });
        setEditingId(dish.id);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?')) return;
        try {
            const res = await fetch(`/api/KoreanDish/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('ลบไม่สำเร็จ');
            setDishes(dishes.filter((dish) => dish.id !== id));
            showToast('ลบเมนูสำเร็จแล้ว', 'success');
        } catch (error) {
            alert(error);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage(null);
            setToastType(null);
        }, 3000);
    };

    return (
        <>
            <BootstrapLayout>
                <div className="container my-4" style={{ fontFamily: "'Dongle', sans-serif" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 style={{ fontWeight: 900, fontSize: '4rem' }} className="m-0">
                            MENU
                        </h1>
                        <button
                            className="btn"
                            onClick={() => setShowModal(true)}
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold', // ทำให้ตัวหนังสือหนาขึ้น
                                padding: '0.5rem 1.5rem',
                                borderRadius: '20px',
                                border: '2px solid #28a745',
                                color: '#28a745',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px', // ระยะห่างระหว่างไอคอนและข้อความ
                            }}
                        >
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>

                    {/* ปุ่มควบคุม */}
                    <div className="position-relative">
                        <button
                            onClick={() => scroll('left')}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                boxShadow: '0 2px 6px rgba(170, 113, 113, 0.2)',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                            }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        <div
                            ref={scrollRef}
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                scrollBehavior: 'smooth',
                                gap: '20px',
                                padding: '10px 50px',
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE 10+
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            {dishes.map((dish) => (
                                <div
                                    key={dish.id}
                                    className="card"
                                    style={{
                                        minWidth: '300px',
                                        borderRadius: '30px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: 'white',
                                        paddingBottom: '20px',
                                        marginTop: '50px',
                                    }}
                                >
                                    <img
                                        src={dish.image}
                                        className="card-img-top"
                                        alt={dish.name}
                                        style={{
                                            width: '200px',
                                            height: 'auto',
                                            display: 'block',
                                            margin: '0 auto',
                                            marginTop: '-60px',
                                        }}
                                    />
                                    <div className="card-body">
                                        <h2 style={{ fontSize: '3rem' }} className="card-title text-center">
                                            {dish.name}
                                        </h2>
                                        <p style={{ fontSize: '25px' }} className="card-text text-center">
                                            <i className="fas fa-star" style={{ color: 'gold', fontSize: '20px' }}></i> {dish.rating}
                                        </p>
                                        <p className="card-text text-center">{dish.description}</p>
                                        <p style={{ fontSize: '3rem' }} className="card-text text-center">
                                            {dish.price} Bath
                                        </p>
                                        <div className="d-flex justify-content-center mt-3 gap-2">
                                            <button
                                                style={{
                                                    fontSize: '20px',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                }}
                                                className="btn"
                                                onClick={() => handleEdit(dish)}
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            <button
                                                style={{
                                                    fontSize: '20px',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                }}
                                                className="btn"
                                                onClick={() => handleDelete(dish.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll('right')}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                            }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </BootstrapLayout>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(2px)',
                    }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content rounded-4 border-0 shadow-sm">
                            <div className="position-relative">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        color: '#aaa',
                                        cursor: 'pointer',
                                    }}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                                <div className="p-4 pb-0 text-center">
                                    <h5 className="modal-title mb-3" style={{ fontWeight: 600 }}>
                                        เพิ่มเมนูใหม่
                                    </h5>
                                </div>
                            </div>

                            <div className="modal-body p-4 pt-0">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="ชื่อเมนู"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-3"
                                    placeholder="คำอธิบาย"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                                <div className="mb-3">
                                  <small className="text-muted">เพิ่มคะแนน</small>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="เรตติ้ง"
                                        value={form.rating}
                                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                                    />
                                    
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted">เพิ่มราคา</small>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="ราคา"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    />
                                    
                                </div>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="ลิงก์รูปภาพ"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer border-0 px-4 pt-0 pb-4">
                                <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setShowModal(false)}>
                                    ยกเลิก
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleSubmit}>
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div
                    className="toast show position-fixed d-flex align-items-center end-0 bottom-0 m-3 text-white"
                    style={{
                        backgroundColor: toastType === 'success' ? 'rgba(40, 167, 69, 0.85)' : 'rgba(220, 53, 69, 0.85)',
                        zIndex: 9999,
                        borderRadius: '10px',
                        padding: '10px 20px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <i
                        className={`me-2 ${toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'}`}
                        style={{ fontSize: '1.5rem', color: toastType === 'success' ? '#00ff7f' : '#ff4d4f' }}
                    ></i>
                    <div className="toast-body">{toastMessage}</div>
                </div>
            )}
        </>
    );
}
