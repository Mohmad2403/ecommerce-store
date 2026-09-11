import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [editingCategoryId, setEditingCategoryId] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/')
            setCategories(response.data)
        } catch (err) {
            setError('Failed to load categories.')
        }
    }

    const handleCategorySubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')
        try {
            const slug = categoryName
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
            if (editingCategoryId) {
                await api.put(`categories/${editingCategoryId}/`, { name: categoryName, slug })
                setMessage('Category updated!')
            } else {
                await api.post('categories/', { name: categoryName, slug })
                setMessage('Category created!')
            }
            setCategoryName('')
            setEditingCategoryId(null)
            fetchCategories()
        } catch (err) {
            setError('Failed to save category.')
        }
    }

    const handleCategoryEdit = (category) => {
        setCategoryName(category.name)
        setEditingCategoryId(category.id)
    }

    const handleCategoryDelete = async (id) => {
        try {
            await api.delete(`categories/${id}/`)
            fetchCategories()
        } catch (err) {
            setError('Failed to delete category. It may have products linked to it.')
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Link to="/admin" className="btn btn-sm btn-outline-secondary mb-3">← Back to Dashboard</Link>
            </div>
            <div className="container mt-5">
                <h2 className="mb-4">Admin — Manage Categories</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="mb-3">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h5>
                        <form onSubmit={handleCategorySubmit} className="d-flex gap-2">
                            <input className="form-control" placeholder="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                            <button className="btn btn-primary" type="submit">{editingCategoryId ? 'Update' : 'Add'}</button>
                            {editingCategoryId && (
                                <button className="btn btn-secondary" type="button" onClick={() => { setCategoryName(''); setEditingCategoryId(null) }}>Cancel</button>
                            )}
                        </form>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>{cat.slug}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleCategoryEdit(cat)}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleCategoryDelete(cat.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AdminCategories