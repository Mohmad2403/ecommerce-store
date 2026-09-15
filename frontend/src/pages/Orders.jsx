import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"

const statusStyles = {
    pending: { bg: '#f1f5f9', text: '#334155', label: 'Pending' },
    processing: { bg: '#dbeafe', text: '#1e40af', label: 'Processing' },
    shipped: { bg: '#fef3c7', text: '#92400e', label: 'Shipped' },
    delivered: { bg: '#dcfce7', text: '#166534', label: 'Delivered' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
}

function Orders() {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await api.get('orders/')
            setOrders(response.data)
        }
        catch (err) {
            setError('Failed to load orders.')
        }
    }

    const handlePayNow = async (order) => {
        try {
            const res = await api.post(`orders/${order.id}/create_payment/`)
            const { razorpay_order_id, amount, currency, key_id } = res.data

            const options = {
                key: key_id,
                amount: amount,
                currency: currency,
                order_id: razorpay_order_id,
                name: "MyShop",
                description: `Payment for Order #${order.id}`,
                prefill: { name: "Test User", email: "test@example.com", contact: "9999999999" },
                handler: async function (response) {
                    try {
                        await api.post(`orders/${order.id}/verify_payment/`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                        toast.success('Payment successful!')
                        fetchOrders()
                    } catch (err) {
                        toast.error('Payment verification failed.')
                    }
                },
                theme: { color: "#ea580c" }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        }
        catch (err) {
            toast.error('Failed to initiate payment.')
        }
    }

    const handleCancelOrder = async (orderId) => {
        try {
            await api.post(`orders/${orderId}/cancel_order/`)
            toast.success('Order cancelled.')
            fetchOrders()
        }
        catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel order.')
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Link to="/profile" className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-arrow-left"></i> Back to Profile
                </Link>
            </div>
            <div className="container mt-5">
                {error && <div className="alert alert-danger">{error}</div>}

                <h2 className="fw-bold mb-1">My Orders <span className="text-muted fs-5">({orders.length})</span></h2>
                <p className="text-muted mb-4">Track and manage your orders</p>

                {orders.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-box-seam fs-1 text-muted"></i>
                        <p className="mt-2">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn text-white" style={{ backgroundColor: '#ea580c' }}>Start Shopping</Link>
                    </div>
                ) : (
                    orders.map((order) => {
                        const statusInfo = statusStyles[order.status] || statusStyles.pending
                        return (
                            <div className="card shadow-sm mb-3 border-0" key={order.id}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                        <div>
                                            <p className="fw-bold mb-0">Order #{order.id}</p>
                                            <p className="text-muted small mb-0">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            {order.is_paid && (
                                                <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                                                    <i className="bi bi-check-circle"></i> Paid
                                                </span>
                                            )}
                                            <span className="badge" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        {order.items.map((item) => (
                                            <div className="col-12 col-sm-auto d-flex align-items-center gap-2 border rounded p-2" key={item.id}>
                                                {item.product_detail.image && (
                                                    <img src={item.product_detail.image} alt={item.product_detail.name} style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                                                )}
                                                <div className="text-truncate">
                                                    <p className="small mb-0 text-truncate">{item.product_detail.name}</p>
                                                    <p className="text-muted small mb-0">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <h5 className="fw-bold mb-0">Total: Rs. {order.total_amount}</h5>
                                        <div className="d-flex gap-2">
                                            {!order.is_paid && order.status !== 'cancelled' && (
                                                <button className="btn text-white btn-sm" style={{ backgroundColor: '#ea580c' }} onClick={() => handlePayNow(order)}>
                                                    Pay Now
                                                </button>
                                            )}
                                            {order.is_paid && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                <button className="btn btn-outline-secondary btn-sm" disabled>
                                                    <i className="bi bi-geo-alt"></i> Track Order
                                                </button>
                                            )}
                                            {order.status !== 'delivered' && order.status !== 'cancelled' && !order.is_paid && (
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelOrder(order.id)}>
                                                    <i className="bi bi-x-circle"></i> Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}

                <div className="row text-center g-3 mt-5 mb-5 p-4 shadow-sm rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-truck fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Free Delivery</p>
                        <p className="small text-muted">On orders over ₹999</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-shield-check fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Secure Payment</p>
                        <p className="small text-muted">100% secure payments</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-arrow-repeat fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Easy Returns</p>
                        <p className="small text-muted">7 days return policy</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-headset fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">24/7 Support</p>
                        <p className="small text-muted">We're here to help</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Orders