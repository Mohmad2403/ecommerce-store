import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await api.get('orders/')
            setOrders(response.data)
        } catch (err) {
            setError('Failed to load orders.')
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        setMessage('')
        setError('')
        try {
            await api.patch(`orders/${orderId}/update_status/`, { status: newStatus })
            setMessage(`Order #${orderId} updated to ${newStatus}.`)
            fetchOrders()
        } catch (err) {
            setError('Failed to update status.')
        }
    }

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Link to="/admin" className="btn btn-sm btn-outline-secondary mb-3">← Back to Dashboard</Link>
            </div>
            <div className="container mt-5">
                <h2 className="mb-4">Admin — Manage Orders</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    <table className="table table-bordered align-middle">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Placed On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.username}</td>
                                    <td>
                                        {order.items.map((item) => (
                                            <div key={item.id}>{item.product_detail.name} x {item.quantity}</div>
                                        ))}
                                    </td>
                                    <td>Rs. {order.total_amount}</td>
                                    <td>
                                        <span className={`badge ${order.is_paid ? 'bg-success' : 'bg-secondary'}`}>
                                            {order.is_paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

export default AdminOrders