import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: ''
    })
    const [editingId, setEditingId] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await api.get('products/')
            setProducts(response.data)
        } catch (err) {
            setError('Failed to load products.')
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/')
            setCategories(response.data)
        } catch (err) {
            setError('Failed to load categories.')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')
        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('stock', formData.stock)
            data.append('category', formData.category)
            if (imageFile) {
                data.append('image', imageFile)
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            if (editingId) {
                await api.put(`products/${editingId}/`, data, config)
                setMessage('Product updated!')
            } else {
                await api.post('products/', data, config)
                setMessage('Product created!')
            }
            setFormData({ name: '', description: '', price: '', stock: '', category: '' })
            setImageFile(null)
            setEditingId(null)
            fetchProducts()
        } catch (err) {
            setError('Failed to save product. Check all fields.')
        }
    }

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category
        })
        setImageFile(null)
        setEditingId(product.id)
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`products/${id}/`)
            fetchProducts()
        } catch (err) {
            setError('Failed to delete product.')
        }
    }

    const handleCancel = () => {
        setFormData({ name: '', description: '', price: '', stock: '', category: '' })
        setImageFile(null)
        setEditingId(null)
    }

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <Link to="/admin" className="btn btn-sm btn-outline-secondary mb-3">← Back to Dashboard</Link>
                <h2 className="mb-4">Admin — Manage Products</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="mb-3">{editingId ? 'Edit Product' : 'Add New Product'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <input className="form-control" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <textarea className="form-control" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-primary me-2" type="submit">{editingId ? 'Update' : 'Add'} Product</button>
                                {editingId && (
                                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{categories.find(c => c.id === product.category)?.name || '-'}</td>
                                    <td>Rs. {product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AdminProducts