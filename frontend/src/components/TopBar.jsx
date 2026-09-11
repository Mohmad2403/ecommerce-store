function TopBar() {
    return (
        <div className="text-white py-1 px-4 d-none d-md-flex justify-content-between align-items-center small" style={{ backgroundColor: '#0f172a' }}>
            <span>🚚 Free Delivery on orders over ₹999</span>
            <div className="d-flex gap-4 align-items-center">
                <span>Track Order</span>
                <span>Help Center</span>
                <span>📞 +91 98765 43210</span>
                <div className="d-flex gap-2">
                    <i className="bi bi-facebook"></i>
                    <i className="bi bi-instagram"></i>
                    <i className="bi bi-twitter"></i>
                    <i className="bi bi-youtube"></i>
                </div>
            </div>
        </div>
    )
}

export default TopBar