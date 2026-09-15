import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function Footer() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('categories/')
                setCategories(res.data)
            } catch (err) {}
        }
        fetchCategories()
    }, [])

    return (
        <footer className="text-white pt-5 pb-4" style={{ backgroundColor: '#0f172a' }}>
            <div className="container">
                <div className="row g-4">
                    <div className="col-12 col-md-3">
                        <h5 className="mb-3">🛍️ MyShop</h5>
                        <p className="text-white-50 small">Shop the latest products online with best quality and great prices only on MyShop.</p>
                        <div className="d-flex gap-3 mt-3">
                            <i className="bi bi-facebook fs-5"></i>
                            <i className="bi bi-instagram fs-5"></i>
                            <i className="bi bi-twitter fs-5"></i>
                            <i className="bi bi-youtube fs-5"></i>
                        </div>
                    </div>
                    <div className="col-6 col-md-2">
                        <h6 className="mb-3">Quick Links</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">About Us</Link></li>
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Contact Us</Link></li>
                            <li className="mb-2"><span className="text-white-50">FAQs</span></li>
                            <li className="mb-2"><span className="text-white-50">Shipping Policy</span></li>
                            <li className="mb-2"><span className="text-white-50">Return Policy</span></li>
                            <li><span className="text-white-50">Terms & Conditions</span></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-2">
                        <h6 className="mb-3">Customer Service</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><span className="text-white-50">Track Order</span></li>
                            <li className="mb-2"><Link to="/profile" className="text-white-50 text-decoration-none">My Account</Link></li>
                            <li className="mb-2"><Link to="/wishlist" className="text-white-50 text-decoration-none">Wishlist</Link></li>
                            <li className="mb-2"><Link to="/cart" className="text-white-50 text-decoration-none">Cart</Link></li>
                            <li className="mb-2"><span className="text-white-50">Payment Methods</span></li>
                            <li><span className="text-white-50">Help Center</span></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-2">
                        <h6 className="mb-3">Categories</h6>
                        <ul className="list-unstyled small">
                            {categories.length > 0 ? (
                                categories.slice(0, 6).map((cat) => (
                                    <li className="mb-2" key={cat.id}>
                                        <Link to={`/products?category=${cat.id}`} className="text-white-50 text-decoration-none">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li><Link to="/products" className="text-white-50 text-decoration-none">All Products</Link></li>
                            )}
                        </ul>
                    </div>
                    <div className="col-12 col-md-3">
                        <h6 className="mb-3">Download Our App</h6>
                        <div className="d-flex flex-column gap-2">
                            <div className="bg-black border border-secondary rounded px-3 py-2 d-flex align-items-center gap-2" style={{ width: 'fit-content' }}>
                                <i className="bi bi-google-play fs-5"></i>
                                <div>
                                    <div className="text-white-50" style={{ fontSize: '10px' }}>GET IT ON</div>
                                    <div className="small">Google Play</div>
                                </div>
                            </div>
                            <div className="bg-black border border-secondary rounded px-3 py-2 d-flex align-items-center gap-2" style={{ width: 'fit-content' }}>
                                <i className="bi bi-apple fs-5"></i>
                                <div>
                                    <div className="text-white-50" style={{ fontSize: '10px' }}>Download on the</div>
                                    <div className="small">App Store</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="border-secondary mt-4" />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="text-white-50 small mb-2 mb-md-0">© 2026 MyShop. All Rights Reserved.</p>
                    <div className="d-flex gap-2">
                        <span className="badge bg-white text-dark">VISA</span>
                        <span className="badge bg-white text-dark">Mastercard</span>
                        <span className="badge bg-white text-dark">Paytm</span>
                        <span className="badge bg-white text-dark">UPI</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer