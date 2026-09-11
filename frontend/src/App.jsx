import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from './pages/Login'
import Register from "./pages/Register"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Orders from "./pages/Orders"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProducts from "./pages/AdminProducts"
import AdminCategories from "./pages/AdminCategories"
import AdminOrders from "./pages/AdminOrders"
import AdminStats from "./pages/AdminStats"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductDetail from "./pages/ProductDetail"





function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000}/>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/products/:id" element={<ProductDetail/>} />





      </Routes>
    </BrowserRouter>
  )
}

export default App