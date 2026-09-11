import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#0d6efd', '#ffc107', '#198754', '#dc3545', '#6c757d'];

function AdminStats() {
    const [stats, setStats] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('orders/stats/')
                setStats(response.data)
            } catch (err) {
                setError('Failed to load stats.')
            }
        }
        fetchStats()
    }, [])

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <Link to="/admin" className="btn btn-sm btn-outline-secondary mb-3">← Back to Dashboard</Link>
                <h2 className="mb-4">Sales Overview</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                {!stats ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="card text-center p-3 shadow-sm">
                                    <h6 className="text-muted">Total Revenue</h6>
                                    <h3>Rs. {stats.total_revenue}</h3>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-center p-3 shadow-sm">
                                    <h6 className="text-muted">Total Orders</h6>
                                    <h3>{stats.total_orders}</h3>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-center p-3 shadow-sm">
                                    <h6 className="text-muted">Paid Orders</h6>
                                    <h3>{stats.paid_orders}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card p-3 shadow-sm">
                                    <h5 className="mb-3">Orders by Status</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={stats.status_counts}
                                                dataKey="count"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >
                                                {stats.status_counts.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card p-3 shadow-sm">
                                    <h5 className="mb-3">Top Selling Products</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.top_products}>
                                            <XAxis dataKey="product__name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total_sold" fill="#0d6efd" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default AdminStats