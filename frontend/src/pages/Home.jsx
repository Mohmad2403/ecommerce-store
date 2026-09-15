import * as bootstrap from 'bootstrap'

import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import { toast } from "react-toastify"

const categoryIcons = {
    'Electronics': { icon: 'bi-laptop', bg: '#dbeafe' },
    'Sports':{icon:'bi-bicycle',bg:'#dbeafe'},
    'Mobile': { icon: 'bi-phone', bg: '#fee2e2' },
    'Mobiles': { icon: 'bi-phone', bg: '#fee2e2' },
    'Mobile Phones': { icon: 'bi-phone', bg: '#fee2e2' },
    'Smartphones': { icon: 'bi-phone', bg: '#fee2e2' },
    'Accessories': { icon: 'bi-watch', bg: '#fce7f3' },
    'Fashions': { icon: 'bi-bag-heart', bg: '#dcfce7' },
    'Kitchen&Home': { icon: 'bi-house-heart', bg: '#fef3c7' },
    'Footwear': { icon: 'bi-bag', bg: '#e0e7ff' },
    'Beauty&Health': { icon: 'bi-heart-pulse', bg: '#fce7f3' },
}

const heroSlides = [
    { image: '/banners/img1.jpg', tag: 'Summer Collection 2026', title: 'Find What You Love', subtitle: 'Discover amazing products at great prices and exclusive deals.' },
    { image: '/banners/img2.webp', tag: 'New Arrivals', title: 'Fresh Styles Just In', subtitle: 'Check out our latest collection before it sells out.' },
    { image: '/banners/img3.webp', tag: 'Limited Time', title: 'Big Deals This Week', subtitle: 'Save more on your favorite products, only this week.' },
]

const testimonials = [
    { name: 'Rohan Verma', quote: 'Amazing quality products and fast delivery. Highly recommended!' },
    { name: 'Priya Sharma', quote: 'Great customer service and smooth shopping experience.' },
    { name: 'Amit Singh', quote: 'Best prices and genuine products. Love shopping here!' },
]

function Home() {
    const [categories, setCategories] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [error, setError] = useState('')
    const heroCarouselRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await api.get('categories/')
                setCategories(catRes.data)
                const prodRes = await api.get('products/')
                const sortedProducts = [...prodRes.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                setFeaturedProducts(sortedProducts.slice(0, 6))
                setBestSellers(sortedProducts.slice(6, 12))
            } catch (err) {
                setError('Failed to load home page data.')
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (heroCarouselRef.current) {
            new bootstrap.Carousel(heroCarouselRef.current, { interval: 5000, ride: 'carousel' })
        }
    }, [])

    const handleAddToCart = async (productId) => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to add items to your cart.')
            navigate('/login')
            return
        }
        try {
            await api.post('cart/', { product: productId, quantity: 1 })
            toast.success('Added to cart!')
        }
        catch (err) {
            toast.error('Failed to add to cart.')
        }
    }

    const handleAddToWishlist = async (productId) => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to add items to your wishlist.')
            navigate('/login')
            return
        }
        try {
            await api.post('wishlist/', { product: productId })
            toast.success('Added to wishlist!')
        }
        catch (err) {
            toast.error('Already in wishlist or failed to add.')
        }
    }

    return (
        <>
            <Navbar />

            {/* HERO CAROUSEL */}
            <div id="heroCarousel" ref={heroCarouselRef} className="carousel slide" data-bs-interval="5000">
                <div className="carousel-inner">
                    {heroSlides.map((slide, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <div className="px-3 px-md-4 py-4 py-md-5" style={{ backgroundColor: '#fef3e7', minHeight: '380px' }}>
                                <div className="container h-100">
                                    <div className="row align-items-center h-100 g-4">
                                        <div className="col-12 col-md-6 text-center text-md-start">
                                            <p className="fw-semibold mb-2" style={{ color: '#ea580c' }}>{slide.tag}</p>
                                            <h1 className="fw-bold mb-3 fs-2 fs-md-1">{slide.title}</h1>
                                            <p className="text-muted fs-6 fs-md-5 mb-4">{slide.subtitle}</p>
                                            <Link to="/products" className="btn text-white px-4 py-2" style={{ backgroundColor: '#ea580c' }}>Shop Now</Link>
                                        </div>
                                        <div className="col-12 col-md-6 text-center">
                                            <img src={slide.image} alt={slide.title} className="img-fluid rounded" style={{ maxHeight: '280px', objectFit: 'cover', width: '100%', maxWidth: '420px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" style={{ filter: 'invert(1)' }}></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" style={{ filter: 'invert(1)' }}></span>
                </button>
            </div>

            {/* SHOP BY CATEGORY */}
            <div className="container mt-4 mt-md-5">
                {error && <div className="alert alert-danger">{error}</div>}
                <h3 className="text-center fw-bold mb-4">— Shop by Category —</h3>
                <div className="row g-3 justify-content-center mb-5">
                    {categories.map((cat) => {
                        const style = categoryIcons[cat.name] || { icon: 'bi-grid', bg: '#f1f5f9' }
                        return (
                            <div className="col-4 col-sm-3 col-md-2 text-center" key={cat.id}>
                                <Link to={`/products?category=${cat.id}`} className="text-decoration-none">
                                    <div className="hover-card d-flex align-items-center justify-content-center mx-auto mb-2"
                                        style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: style.bg }}>
                                        <i className={`bi ${style.icon} fs-4`} style={{ color: '#334155' }}></i>
                                    </div>
                                    <p className="text-dark small mb-0 text-truncate">{cat.name}</p>
                                </Link>
                            </div>
                        )
                    })}
                </div>

                {/* FEATURED PRODUCTS */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fw-bold mb-0">Featured Products —</h3>
                    <Link to="/products" className="text-decoration-none small">View All →</Link>
                </div>
                <div className="row">
                    {featuredProducts.map((product) => (
                        <div className="col-6 col-md-2 mb-4" key={product.id}>
                            <div className="card hover-card h-100 border-0 shadow-sm position-relative">
                                <button className="btn btn-sm position-absolute top-0 end-0 m-1 bg-white rounded-circle" style={{ zIndex: 1 }} onClick={() => handleAddToWishlist(product.id)}>
                                    <i className="bi bi-heart"></i>
                                </button>
                                <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                                    {product.image && (
                                        <img src={product.image} className="card-img-top p-2" alt={product.name} style={{ height: '140px', objectFit: 'contain' }} />
                                    )}
                                    <div className="card-body pb-0">
                                        <h6 className="card-title small mb-1">{product.name}</h6>
                                    </div>
                                </Link>
                                <div className="card-body pt-0">
                                    <StarRating productId={product.id} />
                                    <p className="mb-2">
                                        <span className="fw-bold">Rs. {product.price}</span>{' '}
                                        <span className="text-muted text-decoration-line-through small">Rs. {Math.round(product.price * 1.4)}</span>
                                    </p>
                                    {/* <button className="btn btn-sm w-100"style={{backgroundColor:'#f97316',color:'white'}} onClick={() => handleAddToCart(product.id)}>
                                        <i className="bi bi-cart"></i> Add to Cart
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DEALS OF THE DAY + BRAND DEALS */}
            <div className="container mt-5">
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="text-white rounded p-4 h-100" style={{ backgroundColor: '#0f172a' }}>
                            <p className="fw-bold mb-3">Deals of the Day —</p>
                            <div className="d-flex gap-2 mb-3">
                                <div className="bg-white text-dark rounded px-3 py-2 text-center flex-fill">
                                    <div className="fw-bold fs-5">12</div><small>Hours</small>
                                </div>
                                <div className="bg-white text-dark rounded px-3 py-2 text-center flex-fill">
                                    <div className="fw-bold fs-5">45</div><small>Mins</small>
                                </div>
                                <div className="bg-white text-dark rounded px-3 py-2 text-center flex-fill">
                                    <div className="fw-bold fs-5">30</div><small>Secs</small>
                                </div>
                            </div>
                            <Link to="/products" className="btn btn-outline-light btn-sm">Shop All Deals</Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="bg-white rounded p-4 h-100 shadow-sm text-center">
                            <i className="bi bi-earbuds fs-1 text-muted mb-2"></i>
                            <p className="fw-semibold mb-1">Boult Audio AirBass Z20 Earbuds</p>
                            <p className="fw-bold mb-2" style={{ color: '#ea580c' }}>Rs. 999 <span className="text-muted text-decoration-line-through small">Rs. 1999</span></p>
                            <Link to="/products" className="btn btn-sm text-white" style={{ backgroundColor: '#ea580c' }}>Shop Now</Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="text-white rounded p-4 h-100 d-flex flex-column justify-content-center" style={{ backgroundColor: '#6d28d9' }}>
                            <p className="mb-1">Awesome Deals</p>
                            <p className="fw-bold mb-1">On Top Brands</p>
                            <p className="small mb-2">Limited Time Offer!</p>
                            <h2 className="fw-bold mb-0">UP TO 50% OFF</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRUST BADGES */}
            <div className="container mt-5">
                <div className="row text-center g-3">
                    <div className="col-6 col-md-3">
                        <i className="bi bi-truck fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Fast Delivery</p>
                        <p className="small text-muted">Get your products fast at your doorstep</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-shield-check fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Secure Payment</p>
                        <p className="small text-muted">100% secure payments with multiple options</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-arrow-repeat fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">Easy Returns</p>
                        <p className="small text-muted">Not satisfied? Return it within 7 days</p>
                    </div>
                    <div className="col-6 col-md-3">
                        <i className="bi bi-headset fs-3 text-primary"></i>
                        <p className="fw-semibold mb-0 mt-1">24/7 Support</p>
                        <p className="small text-muted">We are here to help you anytime, anywhere</p>
                    </div>
                </div>
            </div>

            {/* BEST SELLERS */}
            {bestSellers.length > 0 && (
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bold mb-0">Best Sellers —</h3>
                        <Link to="/products" className="text-decoration-none small">View All →</Link>
                    </div>
                    <div className="row">
                        {bestSellers.map((product) => (
                            <div className="col-6 col-md-2 mb-4" key={product.id}>
                                <div className="card hover-card h-100 border-0 shadow-sm position-relative">
                                    <button className="btn btn-sm position-absolute top-0 end-0 m-1 bg-white rounded-circle" style={{ zIndex: 1 }} onClick={() => handleAddToWishlist(product.id)}>
                                        <i className="bi bi-heart"></i>
                                    </button>
                                    <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                                        {product.image && (
                                            <img src={product.image} className="card-img-top p-2" alt={product.name} style={{ height: '140px', objectFit: 'contain' }} />
                                        )}
                                        <div className="card-body pb-0">
                                            <h6 className="card-title small mb-1">{product.name}</h6>
                                        </div>
                                    </Link>
                                    <div className="card-body pt-0">
                                        <StarRating productId={product.id} />
                                        <p className="mb-2">
                                            <span className="fw-bold">Rs. {product.price}</span>{' '}
                                            <span className="text-muted text-decoration-line-through small">Rs. {Math.round(product.price * 1.3)}</span>
                                        </p>
                                        <button className="btn btn-sm w-100" style={{backgroundColor:'#ea580c',color:'white'}} onClick={() => handleAddToCart(product.id)}>
                                            <i className="bi bi-cart"></i> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TESTIMONIALS */}
            <div className="container mt-5">
                <h3 className="text-center fw-bold mb-4">What Our Customers Say</h3>
                <div className="row g-3">
                    {testimonials.map((t, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card border-0 shadow-sm p-3 h-100">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="bi bi-person-circle fs-3 text-muted"></i>
                                    <div>
                                        <p className="fw-semibold mb-0">{t.name}</p>
                                        <span style={{ color: '#ffc107', fontSize: '13px' }}>★★★★★</span>
                                    </div>
                                </div>
                                <p className="text-muted small mb-0">{t.quote}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* NEWSLETTER */}
            <div className="text-center py-5 mt-5 text-white" style={{ backgroundColor: '#ea580c' }}>
                <div className="container">
                    <h4 className="mb-2">Subscribe to our Newsletter</h4>
                    <p className="mb-4">Get the latest updates on new arrivals, deals and exclusive offers</p>
                    <form className="d-flex flex-column flex-sm-row justify-content-center gap-2" style={{ maxWidth: '450px', margin: '0 auto' }} onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed! (demo only)') }}>
                        <input type="email" className="form-control" placeholder="Enter your email address" required />
                        <button className="btn btn-dark text-nowrap" type="submit">Subscribe</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Home