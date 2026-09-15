import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Admin Dashboard</h2>
                <div className="row g-3">
                    <div className="col-6 col-md-4">
                        <Link to="/admin/products" className="text-decoration-none">
                            <div className="card text-center p-3 p-md-4 h-100 shadow-sm">
                                <h5>Manage Products</h5>
                                <p className="text-muted mb-0 small">Add, edit, or remove products</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 col-md-4">
                        <Link to="/admin/categories" className="text-decoration-none">
                            <div className="card text-center p-3 p-md-4 h-100 shadow-sm">
                                <h5>Manage Categories</h5>
                                <p className="text-muted mb-0 small">Add, edit, or remove categories</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 col-md-4">
                        <Link to="/admin/orders" className="text-decoration-none">
                            <div className="card text-center p-3 p-md-4 h-100 shadow-sm">
                                <h5>Manage Orders</h5>
                                <p className="text-muted mb-0 small">View orders and update status</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 col-md-4">
                        <Link to="/admin/stats" className="text-decoration-none">
                            <div className="card text-center p-3 p-md-4 h-100 shadow-sm">
                                <h5>Sales Overview</h5>
                                <p className="text-muted mb-0 small">View revenue and top products</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard