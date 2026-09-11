import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from '../components/Navbar'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { toast } from "react-toastify"
import StarRating from "../components/StarRating";

function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryFilter = searchParams.get('category')
    const searchQuery = searchParams.get('search')
    const navigate = useNavigate()

    const [maxPrice, setMaxPrice] = useState(200000)
    const [priceRange, setPriceRange] = useState(200000)
    const [ratingFilter, setRatingFilter] = useState(0)
    const [sortBy, setSortBy] = useState('popularity')
    const [viewMode, setViewMode] = useState('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/')
                setProducts(response.data)
                if (response.data && response.data.length > 0) {
                    const highest = Math.max(...response.data.map(p => Number(p.price) || 0))
                    const topPrice = Math.max(highest, 200000)
                    setMaxPrice(topPrice)
                    setPriceRange(topPrice)
                }
            }
            catch (err) {
                setError('Failed to load products')
            }
        }
        const fetchCategories = async () => {
            try {
                const response = await api.get('categories/')
                setCategories(response.data)
            } catch (err) { }
        }
        fetchProducts()
        fetchCategories()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [categoryFilter, searchQuery, priceRange, ratingFilter, sortBy])

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

    const handleBuyNow = async (productId) => {
        if (!localStorage.getItem('access_token')) {
            toast.info('Please log in to continue.')
            navigate('/login')
            return
        }
        try {
            await api.post('cart/', { product: productId, quantity: 1 })
            await api.post('orders/place_order/')
            toast.success('Order placed! Complete your payment.')
            navigate('/orders')
        }
        catch (err) {
            toast.error('Failed to place order.')
        }
    }

    const getDiscount = (productId) => 15 + (productId * 7) % 30
    const getOriginalPrice = (price, discount) => Math.round(price / (1 - discount / 100))
    const getRating = (productId) => {
        const seed = productId % 5
        return Math.round((3.5 + seed * 0.3) * 2) / 2
    }
    const getSoldCount = (productId) => 50 + (productId * 41) % 500

    let filteredProducts = products.filter(p => {
        const pCatId = typeof p.category === 'object' && p.category !== null ? p.category.id : p.category
        const matchesCategory = categoryFilter ? String(pCatId) === String(categoryFilter) : true
        const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
        const matchesPrice = Number(p.price) <= priceRange
        const matchesRating = ratingFilter ? getRating(p.id) >= ratingFilter : true
        return matchesCategory && matchesSearch && matchesPrice && matchesRating
    })

    if (sortBy === 'price_low') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_high') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
    else if (sortBy === 'popularity') filteredProducts = [...filteredProducts].sort((a, b) => getSoldCount(b.id) - getSoldCount(a.id))

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleCategoryClick = (catId) => {
        setSearchParams(catId ? { category: catId } : {})
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <nav className="small text-muted mb-3">
                    <Link to="/" className="text-decoration-none text-muted">Home</Link> {' > '}
                    <span>All Products</span>
                </nav>

                <div className="row">
                    <div className="col-lg-3 mb-4">
                        <div className="card shadow-sm p-3 mb-3">
                            <h6 className="fw-bold mb-2">Categories</h6>
                            <div
                                className={`py-1 small ${!categoryFilter ? 'fw-bold' : ''}`}
                                style={{ cursor: 'pointer', color: !categoryFilter ? '#ea580c' : '#334155' }}
                                onClick={() => handleCategoryClick(null)}
                            >
                                All Categories
                            </div>
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="py-1 small"
                                    style={{ cursor: 'pointer', color: categoryFilter === String(cat.id) ? '#ea580c' : '#334155', fontWeight: categoryFilter === String(cat.id) ? 'bold' : 'normal' }}
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    {cat.name}
                                </div>
                            ))}
                        </div>

                        <div className="card shadow-sm p-3 mb-3">
                            <h6 className="fw-bold mb-2">Price Range</h6>
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max={maxPrice}
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                            />
                            <div className="d-flex justify-content-between small text-muted">
                                <span>Rs. 0</span>
                                <span>Rs. {priceRange.toLocaleString()}+</span>
                            </div>
                        </div>

                        <div className="card shadow-sm p-3">
                            <h6 className="fw-bold mb-2">Rating</h6>
                            {[4, 3, 2, 1].map((r) => (
                                <div key={r} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="rating"
                                        checked={ratingFilter === r}
                                        onChange={() => setRatingFilter(ratingFilter === r ? 0 : r)}
                                    />
                                    <label className="form-check-label small" onClick={() => setRatingFilter(ratingFilter === r ? 0 : r)} style={{ cursor: 'pointer' }}>
                                        {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <div>
                                <h2 className="fw-bold mb-0">All Products</h2>
                                <p className="text-muted small mb-0">Showing {paginatedProducts.length ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products</p>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                <select className="form-select form-select-sm" style={{ width: '160px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="popularity">Popularity</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                </select>
                                <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setViewMode('grid')}>
                                    <i className="bi bi-grid-3x3-gap"></i>
                                </button>
                                <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setViewMode('list')}>
                                    <i className="bi bi-list"></i>
                                </button>
                            </div>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        {paginatedProducts.length === 0 ? (
                            <p>No products found.</p>
                        ) : (
                            <div className={viewMode === 'grid' ? 'row' : ''}>
                                {paginatedProducts.map((product) => {
                                    const discount = getDiscount(product.id)
                                    const originalPrice = getOriginalPrice(product.price, discount)
                                    return viewMode === 'grid' ? (
                                        <div className="col-md-4 mb-4" key={product.id}>
                                            <div className="card hover-card h-100">
                                                <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                                                    {product.image && (
                                                        <img src={product.image} className="card-img-top p-3" alt={product.name} style={{ height: '220px', objectFit: 'contain' }} />
                                                    )}
                                                    <div className="card-body pb-0">
                                                        <h6 className="card-title">{product.name}</h6>
                                                    </div>
                                                </Link>
                                                <div className="card-body pt-0">
                                                    <StarRating productId={product.id} showCount={true} />
                                                    <p className="mb-1">
                                                        <span className="fw-bold">Rs. {product.price}</span>{' '}
                                                        <span className="text-muted text-decoration-line-through small">Rs. {originalPrice}</span>{' '}
                                                        <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{discount}% OFF</span>
                                                    </p>
                                                    <span className="badge mb-2" style={{ backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#991b1b' }}>
                                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                    <div className="d-flex gap-2 mt-2">
                                                        <button className="btn btn-sm flex-fill" style={{color:'white',border:'1px solid #ea580c',backgroundColor:'#ea580c'}} onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0}>
                                                            <i className="bi bi-cart"></i> Cart
                                                        </button>
                                                        <button className="btn btn-sm flex-fill"style={{color:'#16a34a',border:'1px solid #16a34a',backgroundColor:'white'}} onClick={() => handleBuyNow(product.id)} disabled={product.stock === 0}>
                                                            Buy Now
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleAddToWishlist(product.id)}>
                                                            <i className="bi bi-heart"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card hover-card mb-3" key={product.id}>
                                            <div className="row g-0 align-items-center">
                                                <div className="col-md-2">
                                                    <Link to={`/products/${product.id}`}>
                                                        {product.image && (
                                                            <img src={product.image} className="img-fluid p-2" alt={product.name} style={{ height: '120px', objectFit: 'contain', width: '100%' }} />
                                                        )}
                                                    </Link>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card-body">
                                                        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                                                            <h6 className="card-title">{product.name}</h6>
                                                        </Link>
                                                        <StarRating productId={product.id} showCount={true} />
                                                        <p className="text-muted small mb-0">{product.description?.slice(0, 80)}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="fw-bold mb-0">Rs. {product.price}</p>
                                                    <p className="text-muted text-decoration-line-through small mb-0">Rs. {originalPrice}</p>
                                                    <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{discount}% OFF</span>
                                                </div>
                                                <div className="col-md-2 d-flex flex-column gap-1 p-2">
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0}>Add to Cart</button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleAddToWishlist(product.id)}>Wishlist</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center gap-1 mt-4 mb-5">
                                <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`btn btn-sm ${currentPage === i + 1 ? 'text-white' : 'btn-outline-secondary'}`}
                                        style={currentPage === i + 1 ? { backgroundColor: '#ea580c' } : {}}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products