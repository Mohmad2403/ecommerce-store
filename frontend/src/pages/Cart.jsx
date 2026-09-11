import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from '../components/Navbar'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to view your cart.')
            navigate('/login')
            return
        }
        try {
            const response = await api.get('cart/')
            setCartItems(response.data)
            setSelectedIds(response.data.map(item => item.id))
        }
        catch (err) {
            setError('Failed to load cart.')
        }
    }

    const handleRemove = async (itemId) => {
        try {
            await api.delete(`cart/${itemId}/`)
            toast.success('Item removed from cart.')
            fetchCart()
        }
        catch (err) {
            toast.error('Failed to remove item.')
        }
    }

    const handleQuantityChange = async (item, delta) => {
        const newQty = item.quantity + delta
        if (newQty < 1) return
        try {
            await api.patch(`cart/${item.id}/`, { quantity: newQty })
            fetchCart()
        }
        catch (err) {
            toast.error('Failed to update quantity.')
        }
    }

    const toggleSelect = (itemId) => {
        setSelectedIds(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === cartItems.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(cartItems.map(item => item.id))
        }
    }

    const handleRemoveSelected = async () => {
        try {
            for (const id of selectedIds) {
                await api.delete(`cart/${id}/`)
            }
            toast.success('Selected items removed.')
            fetchCart()
        }
        catch (err) {
            toast.error('Failed to remove selected items.')
        }
    }

    const handlePlaceOrder = async () => {
        try {
            await api.post('orders/place_order/')
            toast.success('Order placed successfully!')
            navigate('/orders')
        }
        catch (err) {
            toast.error('Failed to place order')
        }
    }

    const getDiscount = (productId) => 15 + (productId * 7) % 30
    const getOriginalPrice = (price, discount) => Math.round(price / (1 - discount / 100))

    const selectedItems = cartItems.filter(item => selectedIds.includes(item.id))
    const totalMRP = selectedItems.reduce((sum, item) => {
        const discount = getDiscount(item.product)
        const original = getOriginalPrice(item.product_detail.price, discount)
        return sum + (original * item.quantity)
    }, 0)
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.product_detail.price * item.quantity), 0)
    const discountOnProducts = totalMRP - totalAmount
    const couponDiscount = selectedItems.length > 0 ? 300 : 0
    const finalTotal = Math.max(totalAmount - couponDiscount, 0)

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

                <h2 className="fw-bold mb-1">My Cart <span className="text-muted fs-5">({cartItems.length})</span></h2>
                <p className="text-muted mb-4">Review your items and proceed to checkout</p>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="table-responsive mb-3">
                                <table className="table align-middle">
                                    <thead>
                                        <tr className="text-muted small">
                                            <th></th>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => {
                                            const discount = getDiscount(item.product)
                                            const originalPrice = getOriginalPrice(item.product_detail.price, discount)
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            {item.product_detail.image && (
                                                                <img src={item.product_detail.image} alt={item.product_detail.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                                            )}
                                                            <div>
                                                                <p className="fw-semibold mb-0">{item.product_detail.name}</p>
                                                                <p className="text-muted small mb-0">{item.product_detail.description?.slice(0, 25)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="fw-semibold mb-0">Rs. {item.product_detail.price}</p>
                                                        <p className="text-muted text-decoration-line-through small mb-0">Rs. {originalPrice}</p>
                                                        <p className="small mb-0" style={{ color: '#ea580c' }}>{discount}% OFF</p>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item, -1)}>-</button>
                                                            <span>{item.quantity}</span>
                                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item, 1)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td className="fw-semibold">Rs. {(item.product_detail.price * item.quantity).toFixed(2)}</td>
                                                    <td>
                                                        <button className="btn btn-sm text-danger" onClick={() => handleRemove(item.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <input type="checkbox" checked={selectedIds.length === cartItems.length} onChange={toggleSelectAll} />
                                    <span>Select All</span>
                                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={handleRemoveSelected} disabled={selectedIds.length === 0}>Remove Selected</button>
                                </div>
                                <Link to="/products" className="btn btn-outline-secondary btn-sm">Continue Shopping</Link>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                                <h5 className="fw-bold mb-3">Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total MRP</span>
                                    <span>Rs. {totalMRP.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Discount on Products</span>
                                    <span className="text-success">- Rs. {discountOnProducts.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Delivery Charges</span>
                                    <span className="text-success">FREE</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Coupon Discount</span>
                                    <span className="text-success">- Rs. {couponDiscount}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="fw-bold mb-0">Total Amount</h5>
                                    <h5 className="fw-bold mb-0">Rs. {finalTotal.toFixed(2)}</h5>
                                </div>
                                {discountOnProducts + couponDiscount > 0 && (
                                    <div className="alert alert-success py-2 small mb-3">
                                        You will save Rs. {(discountOnProducts + couponDiscount).toFixed(2)} on this order
                                    </div>
                                )}
                                <button className="btn text-white w-100 mb-3" style={{ backgroundColor: '#ea580c' }} onClick={handlePlaceOrder} disabled={selectedIds.length === 0}>
                                    Proceed to Checkout <i className="bi bi-arrow-right"></i>
                                </button>
                                <p className="text-center small text-muted mb-0">
                                    <i className="bi bi-shield-lock"></i> Secure Checkout — 100% Secure Payments
                                </p>
                            </div>
                        </div>
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
                        <p className="small text-muted">We're here to help</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart