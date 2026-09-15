import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const statusStyles = {
    pending: { bg: '#f1f5f9', text: '#334155', label: 'Pending' },
    processing: { bg: '#dbeafe', text: '#1e40af', label: 'Processing' },
    shipped: { bg: '#fef3c7', text: '#92400e', label: 'Shipped' },
    delivered: { bg: '#dcfce7', text: '#166534', label: 'Delivered' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
}

function Profile() {
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [wishlistCount, setWishlistCount] = useState(0)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ email: '', phone: '', address: '' })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await api.get('accounts/me/')
                setUser(userRes.data)
                setFormData({ email: userRes.data.email || '', phone: userRes.data.phone || '', address: userRes.data.address || '' })
                const ordersRes = await api.get('orders/')
                setOrders(ordersRes.data)
                const wishlistRes = await api.get('wishlist/')
                setWishlistCount(wishlistRes.data.length)
            } catch (err) {
                setError('Failed to load profile.')
            }
        }
        fetchProfile()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem('is_admin')
        localStorage.removeItem('username')
        navigate('/login')
    }

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        try {
            const res = await api.patch('accounts/me/', formData)
            setUser(res.data)
            setIsEditing(false)
            toast.success('Profile updated!')
        } catch (err) {
            toast.error('Failed to update profile.')
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                {error && <div className="alert alert-danger">{error}</div>}

                <h2 className="fw-bold mb-1">My Profile</h2>
                <p className="text-muted mb-4">Manage your personal information and account details</p>

                {!user ? (
                    <p>Loading...</p>
                ) : (
                    <div className="row">
                        <div className="col-lg-3 mb-4">
                            <div className="card shadow-sm p-3">
                                <p className="text-muted small text-uppercase mb-2">My Account</p>
                                <div className="list-group list-group-flush">
                                    <span className="list-group-item border-0 px-2 py-2 fw-semibold" style={{ backgroundColor: '#fef3e7', color: '#ea580c', borderRadius: '6px' }}>
                                        <i className="bi bi-person"></i> My Profile
                                    </span>
                                    <Link to="/orders" className="list-group-item border-0 px-2 py-2 text-dark text-decoration-none">
                                        <i className="bi bi-box-seam"></i> My Orders
                                    </Link>
                                    <Link to="/wishlist" className="list-group-item border-0 px-2 py-2 text-dark text-decoration-none">
                                        <i className="bi bi-heart"></i> Wishlist
                                    </Link>
                                    <Link to="/cart" className="list-group-item border-0 px-2 py-2 text-dark text-decoration-none">
                                        <i className="bi bi-cart3"></i> Cart
                                    </Link>
                                    <button className="list-group-item border-0 px-2 py-2 text-danger text-start bg-transparent" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9">
                            <div className="card shadow-sm p-3 p-md-4 mb-4">
                                <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 text-center text-sm-start">
                                    <div className="mx-auto mx-sm-0">
                                        <i className="bi bi-person-circle" style={{ fontSize: '70px', color: '#fbbf9f' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="fw-bold mb-1">{user.username}</h4>
                                        <p className="text-muted mb-1"><i className="bi bi-envelope"></i> {user.email || 'Not set'}</p>
                                        <p className="text-muted mb-1"><i className="bi bi-telephone"></i> {user.phone || 'Not set'}</p>
                                        <p className="text-muted small mb-0">
                                            <i className="bi bi-calendar3"></i> Member since {new Date(user.date_joined).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2 gap-sm-3 w-100 w-sm-auto justify-content-center">
                                        <div className="text-center p-3 rounded flex-fill" style={{ backgroundColor: '#eef2ff' }}>
                                            <h4 className="fw-bold mb-0" style={{ color: '#4f46e5' }}>{orders.length}</h4>
                                            <p className="small text-muted mb-0">Orders</p>
                                        </div>
                                        <div className="text-center p-3 rounded flex-fill" style={{ backgroundColor: '#dcfce7' }}>
                                            <h4 className="fw-bold mb-0 text-success">{wishlistCount}</h4>
                                            <p className="small text-muted mb-0">Wishlist</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Personal Information</h6>
                                    {!isEditing && (
                                        <button className="btn btn-sm text-white" style={{ backgroundColor: '#ea580c' }} onClick={() => setIsEditing(true)}>
                                            <i className="bi bi-pencil"></i> Edit Profile
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSaveProfile}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small text-muted">Email Address</label>
                                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleEditChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small text-muted">Mobile Number</label>
                                                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleEditChange} />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label small text-muted">Address</label>
                                                <textarea className="form-control" name="address" value={formData.address} onChange={handleEditChange} />
                                            </div>
                                        </div>
                                        <button className="btn text-white me-2" style={{ backgroundColor: '#ea580c' }} type="submit">Save Changes</button>
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </form>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted small mb-1">Username</p>
                                            <p className="fw-semibold">{user.username}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted small mb-1">Email Address</p>
                                            <p className="fw-semibold">{user.email || 'Not set'}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted small mb-1">Mobile Number</p>
                                            <p className="fw-semibold">{user.phone || 'Not set'}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted small mb-1">Address</p>
                                            <p className="fw-semibold">{user.address || 'Not set'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card shadow-sm p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Recent Orders</h6>
                                    <Link to="/orders" className="text-decoration-none small">View All Orders →</Link>
                                </div>
                                {orders.length === 0 ? (
                                    <p className="text-muted small">No orders yet.</p>
                                ) : (
                                    orders.slice(0, 3).map((order) => {
                                        const statusInfo = statusStyles[order.status] || statusStyles.pending
                                        return (
                                            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" key={order.id}>
                                                <div className="d-flex align-items-center gap-2">
                                                    {order.items[0]?.product_detail.image && (
                                                        <img src={order.items[0].product_detail.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                    )}
                                                    <div>
                                                        <p className="mb-0 small fw-semibold">{order.items[0]?.product_detail.name}{order.items.length > 1 && ` +${order.items.length - 1} more`}</p>
                                                        <p className="mb-0 text-muted small">Order #{order.id} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                    </div>
                                                </div>
                                                <span className="badge" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>{statusInfo.label}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row text-center g-3 mt-4 mb-5 p-4 shadow-sm rounded" style={{ backgroundColor: '#fef3e7' }}>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-shield-check fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Secure Payments</p>
                        <p className="small text-muted">100% secure payment</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-truck fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Fast Delivery</p>
                        <p className="small text-muted">Quick & reliable delivery</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-arrow-repeat fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Easy Returns</p>
                        <p className="small text-muted">7 days return policy</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-headset fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">24/7 Support</p>
                        <p className="small text-muted">We're here to help you</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile