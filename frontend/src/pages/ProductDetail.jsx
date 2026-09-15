import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [category, setCategory] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`products/${id}/`)
                setProduct(res.data)
                if (res.data.category) {
                    if (typeof res.data.category === 'object' && res.data.category !== null) {
                        setCategory(res.data.category)
                    } else {
                        try {
                            const catRes = await api.get(`categories/${res.data.category}/`)
                            setCategory(catRes.data)
                        } catch (catErr) {}
                    }
                }
            } catch (err) {
                setError('Product not found.')
            }
        }
        fetchProduct()
        window.scrollTo(0, 0)
    }, [id])

    const getDiscount = (productId) => 15 + (productId * 7) % 30
    const getOriginalPrice = (price, discount) => Math.round(price / (1 - discount / 100))
    const getSoldCount = (productId) => 50 + (productId * 41) % 500

    const handleAddToCart = async () => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to add items to your cart.')
            navigate('/login')
            return
        }
        try {
            await api.post('cart/', { product: product.id, quantity })
            toast.success('Added to cart!')
        }
        catch (err) {
            toast.error('Failed to add to cart.')
        }
    }

    const handleBuyNow = async () => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to continue.')
            navigate('/login')
            return
        }
        try {
            await api.post('cart/', { product: product.id, quantity })
            await api.post('orders/place_order/')
            toast.success('Order placed! Complete your payment.')
            navigate('/orders')
        }
        catch (err) {
            toast.error('Failed to place order.')
        }
    }

    const handleAddToWishlist = async () => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to add items to your wishlist.')
            navigate('/login')
            return
        }
        try {
            await api.post('wishlist/', { product: product.id })
            toast.success('Added to wishlist!')
        }
        catch (err) {
            toast.error('Already in wishlist or failed to add.')
        }
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center py-5">
                    <p>{error}</p>
                    <Link to="/products" className="btn btn-outline-primary">Back to Products</Link>
                </div>
            </>
        )
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center py-5">Loading...</div>
            </>
        )
    }

    const discount = getDiscount(product.id)
    const originalPrice = getOriginalPrice(product.price, discount)
    const soldCount = getSoldCount(product.id)

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <nav className="small text-muted mb-4">
                    <Link to="/" className="text-decoration-none text-muted">Home</Link> {' > '}
                    {category && <>{category.name} {' > '}</>}
                    <span>{product.name}</span>
                </nav>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="position-relative border rounded p-3 text-center">
                            <span className="badge bg-danger position-absolute top-0 start-0 m-3">-{discount}%</span>
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ height: '400px' }} className="d-flex align-items-center justify-content-center text-muted">No image available</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <span className="badge mb-2" style={{ backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#991b1b' }}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-muted small ms-2">Sold by <strong>MyShop</strong> <i className="bi bi-patch-check-fill text-primary"></i></span>

                        <h2 className="fw-bold mt-2 mb-2">{product.name}</h2>

                        <div className="d-flex align-items-center gap-2 mb-3">
                            <StarRating productId={product.id} showCount={true} />
                            <span className="text-muted small">| {soldCount} sold</span>
                        </div>

                        <div className="d-flex align-items-center gap-2 mb-3">
                            <h3 className="fw-bold mb-0" style={{ color: 'black' }}>Rs. {product.price}</h3>
                            <span className="text-muted text-decoration-line-through">Rs. {originalPrice}</span>
                            <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{discount}% OFF</span>
                        </div>

                        <p className="text-muted mb-4">{product.description}</p>

                        <p className="fw-semibold mb-2">Quantity:</p>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span className="px-3">{quantity}</span>
                            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>

                        <div className="d-flex gap-2 mb-4 flex-wrap flex-sm-nowrap">
                            <button className="btn text-white flex-fill py-2" style={{ backgroundColor: '#ea580c', minWidth: '130px' }} onClick={handleAddToCart} disabled={product.stock === 0}>
                                <i className="bi bi-cart"></i> Add to Cart
                            </button>
                            <button className="btn btn-outline-success flex-fill py-2" style={{ minWidth: '130px' }} onClick={handleBuyNow} disabled={product.stock === 0}>
                                <i className="bi bi-lightning-fill"></i> Buy Now
                            </button>
                            <button className="btn btn-outline-danger py-2" onClick={handleAddToWishlist} title="Add to Wishlist">
                                <i className="bi bi-heart"></i>
                            </button>
                        </div>

                        <div className="row text-center g-2 p-3 shadow-sm rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="col-6 col-sm-3 mb-2 mb-sm-0">
                                <i className="bi bi-arrow-repeat fs-4 text-primary"></i>
                                <p className="small mb-0 mt-1">7 Days<br />Easy Returns</p>
                            </div>
                            <div className="col-6 col-sm-3 mb-2 mb-sm-0">
                                <i className="bi bi-award fs-4 text-primary"></i>
                                <p className="small mb-0 mt-1">1 Year<br />Warranty</p>
                            </div>
                            <div className="col-6 col-sm-3">
                                <i className="bi bi-patch-check fs-4 text-primary"></i>
                                <p className="small mb-0 mt-1">100% Original<br />Product</p>
                            </div>
                            <div className="col-6 col-sm-3">
                                <i className="bi bi-shield-lock fs-4 text-primary"></i>
                                <p className="small mb-0 mt-1">Secure<br />Payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mt-5 mb-5">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">Description</h5>
                        <p className="text-muted">{product.description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail