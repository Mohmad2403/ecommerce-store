import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate()
    const isAdmin = localStorage.getItem('is_admin') === 'true'
    const username = localStorage.getItem('username')
    const [searchQuery, setSearchQuery] = useState('')
    const [wishlistCount, setWishlistCount] = useState(0)
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const fetchCounts = async () => {
            if (!username) return
            try {
                const wishlistRes = await api.get('wishlist/')
                setWishlistCount(wishlistRes.data.length)
                const cartRes = await api.get('cart/')
                setCartCount(cartRes.data.length)
            } catch (err) {
                // silently fail, not critical
            }
        }
        fetchCounts()
    }, [username])

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem('is_admin')
        localStorage.removeItem('username')
        navigate('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <>
            <TopBar />
            <nav className="navbar navbar-expand-lg bg-white px-4 py-3 sticky-top shadow-sm">
                <Link className="navbar-brand fw-bold fs-3" to="/" style={{ color: '#ea580c' }}>
                    🛍️ MyShop
                </Link>

                <form onSubmit={handleSearch} className="mx-auto d-none d-md-flex" style={{ width: '450px' }}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn" style={{ backgroundColor: '#ea580c', color: 'white' }} type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </form>

                <div className="d-flex align-items-center gap-4">
                    <Link className="text-dark position-relative" to="/wishlist" title="Wishlist">
                        <i className="bi bi-heart fs-5"></i>
                        {wishlistCount > 0 && (
                            <span className="position-absolute badge rounded-pill bg-danger" style={{ top: '-8px', right: '-8px', fontSize: '10px' }}>
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <Link className="text-dark position-relative" to="/cart" title="Cart">
                        <i className="bi bi-cart3 fs-5"></i>
                        {cartCount > 0 && (
                            <span className="position-absolute badge rounded-pill bg-danger" style={{ top: '-8px', right: '-8px', fontSize: '10px' }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link className="text-dark" to="/orders" title="Orders">
                        <i className="bi bi-box-seam fs-5"></i>
                    </Link>
                    {isAdmin && (
                        <Link className="text-warning" to="/admin" title="Admin">
                            <i className="bi bi-speedometer2 fs-5"></i>
                        </Link>
                    )}
                    {username ? (
                        <Link to="/profile" className="text-dark text-decoration-none d-flex align-items-center gap-1">
                            <i className="bi bi-person-circle fs-5"></i>
                            <span className="d-none d-lg-inline">{username}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="text-dark text-decoration-none">
                            <i className="bi bi-person-circle fs-5"></i> Login
                        </Link>
                    )}
                    {username && (
                        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    )}
                </div>
            </nav>

            <div className="d-none d-md-flex justify-content-center gap-4 py-2 border-bottom bg-white small">
                <Link to="/" className="text-decoration-none text-dark fw-semibold">Home</Link>
                <Link to="/products" className="text-decoration-none text-dark">Shop</Link>
                <Link to="/wishlist" className="text-decoration-none text-dark">Wishlist</Link>
                <Link to="/cart" className="text-decoration-none text-dark">Cart</Link>
                <Link to="/orders" className="text-decoration-none text-dark">Orders</Link>
                <Link to="/profile" className="text-decoration-none text-dark">Profile</Link>
            </div>
        </>
    )
}

export default Navbar