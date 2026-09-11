import { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    try {
      await api.post('accounts/register/', formData)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Username may already be taken.')
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          <div className="col-md-5 p-4" style={{ backgroundColor: '#fef3e7' }}>
            <Link to="/" className="text-decoration-none fw-bold fs-4 mb-4 d-block" style={{ color: '#ea580c' }}>🛍️ MyShop</Link>
            <p className="text-muted small mb-1">Shop Smarter, Live Better</p>
            <h2 className="fw-bold mb-3">Your Favorite Products, All in One Place</h2>
            <p className="text-muted mb-4">Discover amazing deals, top brands and a seamless shopping experience — just for you.</p>

            <div className="text-center my-4">
                <i className="bi bi-cart4" style={{ fontSize: '100px', color: '#ea580c', opacity: 0.7 }}></i>
            </div>

            <div className="d-flex align-items-start gap-2 mb-3">
                <i className="bi bi-truck fs-5" style={{ color: '#ea580c' }}></i>
                <div>
                    <p className="fw-semibold mb-0 small">Fast & Reliable Delivery</p>
                    <p className="text-muted small mb-0">Get your orders at your doorstep</p>
                </div>
            </div>
            <div className="d-flex align-items-start gap-2 mb-3">
                <i className="bi bi-shield-check fs-5" style={{ color: '#ea580c' }}></i>
                <div>
                    <p className="fw-semibold mb-0 small">Secure Payments</p>
                    <p className="text-muted small mb-0">100% safe and trusted</p>
                </div>
            </div>
            <div className="d-flex align-items-start gap-2">
                <i className="bi bi-headset fs-5" style={{ color: '#ea580c' }}></i>
                <div>
                    <p className="fw-semibold mb-0 small">24/7 Customer Support</p>
                    <p className="text-muted small mb-0">We're always here to help</p>
                </div>
            </div>
          </div>

          <div className="col-md-7 p-5">
            <div className="d-flex justify-content-end mb-3">
                <span className="text-muted small">Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#ea580c' }}>Log In</Link></span>
            </div>
            <h3 className="fw-bold mb-1">Create Your Account</h3>
            <p className="text-muted mb-4">Join MyShop and get access to exclusive deals, personalized recommendations and more.</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username</label>
                <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                    <input className="form-control" name="username" placeholder="Choose a username" onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                    <input className="form-control" name="email" type="email" placeholder="Enter your email address" onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Mobile Number</label>
                <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-telephone"></i></span>
                    <input className="form-control" name="phone" placeholder="Enter your mobile number" onChange={handleChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                    <input className="form-control" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" onChange={handleChange} required />
                    <span className="input-group-text bg-white" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirm Password</label>
                <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                    <input className="form-control" type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              <button className="btn text-white w-100 py-2" style={{ backgroundColor: '#ea580c' }} type="submit">Create Account <i className="bi bi-arrow-right"></i></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register