import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar"
import StarRating from "../components/StarRating"
import { toast } from "react-toastify"
import {Link} from "react-router-dom";

function Wishlist() {
    const [items, setItems] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        try {
            const response = await api.get('wishlist/')
            setItems(response.data)
        }
        catch (err) {
            setError('Failed to load wishlist.')
        }
    }

    const handleRemove = async (itemId) => {
        try {
            await api.delete(`wishlist/${itemId}/`)
            toast.success('Removed from wishlist.')
            fetchWishlist()
        }
        catch (err) {
            toast.error('Failed to remove item.')
        }
    }

    const handleAddToCart = async (productId) => {
        try {
            await api.post('cart/', { product: productId, quantity: 1 })
            toast.success('Added to cart!')
        }
        catch (err) {
            toast.error('Failed to add to cart.')
        }
    }

    const handleMoveAllToCart = async () => {
        try {
            for (const item of items) {
                await api.post('cart/', { product: item.product, quantity: 1 })
                await api.delete(`wishlist/${item.id}/`)
            }
            toast.success('All items moved to cart!')
            fetchWishlist()
        }
        catch (err) {
            toast.error('Failed to move all items.')
        }
    }

    const getDiscount = (productId) => 15 + (productId * 7) % 30
    const getOriginalPrice = (price, discount) => Math.round(price / (1 - discount / 100))

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

                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Wishlist <span className="text-muted fs-5">({items.length})</span></h2>
                        <p className="text-muted mb-0">Items you've saved for later</p>
                    </div>
                    {items.length > 0 && (
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}>
                                <i className="bi bi-share"></i> Share
                            </button>
                            <button className="btn text-white" style={{ backgroundColor: '#ea580c' }} onClick={handleMoveAllToCart}>
                                <i className="bi bi-cart"></i> Move All to Cart
                            </button>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <p>Your wishlist is empty.</p>
                ) : (
                    <div className="row">
                        {items.map((item) => {
                            const discount = getDiscount(item.product)
                            const originalPrice = getOriginalPrice(item.product_detail.price, discount)
                            return (
                                <div className="col-md-3 mb-4" key={item.id}>
                                    <div className="card hover-card h-100 border-0 shadow-sm position-relative">
                                        <button
                                            className="btn btn-sm position-absolute top-0 end-0 m-2 bg-white rounded-circle"
                                            style={{ zIndex: 1 }}
                                            onClick={() => handleRemove(item.id)}
                                            title="Remove from wishlist"
                                        >
                                            <i className="bi bi-heart-fill text-danger"></i>
                                        </button>
                                        {item.product_detail.image && (
                                            <img src={item.product_detail.image} className="card-img-top p-3" alt={item.product_detail.name} style={{ height: '200px', objectFit: 'contain' }} />
                                        )}
                                        <div className="card-body">
                                            <h6 className="card-title mb-1">{item.product_detail.name}</h6>
                                            <p className="text-muted small mb-1">{item.product_detail.description?.slice(0, 30)}</p>
                                            <StarRating productId={item.product} showCount={true} />
                                            <p className="mb-3">
                                                <span className="fw-bold fs-5">Rs. {item.product_detail.price}</span>{' '}
                                                <span className="text-muted text-decoration-line-through small">Rs. {originalPrice}</span>{' '}
                                                <span className="small fw-semibold" style={{ color: '#ea580c' }}>{discount}% OFF</span>
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-flex-fill flex-fill text-white" style={{ backgroundColor: '#ea580c' }} onClick={() => handleAddToCart(item.product)}>
                                                    <i className="bi bi-cart"></i> Add to Cart
                                                </button>
                                                <button className="btn btn-outline-secondary" onClick={() => handleRemove(item.id)} title="Delete">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
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
                        <p className="small text-muted">We're here to help you</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wishlist