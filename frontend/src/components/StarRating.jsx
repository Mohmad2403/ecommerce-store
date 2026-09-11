function StarRating({ productId, showCount = false }) {
    const seed = productId % 5
    const rating = 3.5 + (seed * 0.3)
    const roundedRating = Math.round(rating * 2) / 2
    const fullStars = Math.floor(roundedRating)
    const hasHalfStar = roundedRating % 1 !== 0
    const reviewCount = 100 + (productId * 137) % 1200

    return (
        <div className="d-flex align-items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
                <i
                    key={i}
                    className={`bi ${i < fullStars ? 'bi-star-fill' : (i === fullStars && hasHalfStar) ? 'bi-star-half' : 'bi-star'}`}
                    style={{ color: '#ffc107', fontSize: '14px' }}
                ></i>
            ))}
            <span className="text-muted small ms-1">
                {roundedRating.toFixed(1)}{showCount && ` (${reviewCount.toLocaleString()})`}
            </span>
        </div>
    )
}

export default StarRating