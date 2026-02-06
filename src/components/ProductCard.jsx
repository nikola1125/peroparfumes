import React from 'react'

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <button
          className="quick-add"
          onClick={onAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Quick Add
        </button>
      </div>
      <div className="card-info">
        <p className="card-category">{product.category}</p>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">${product.price}</p>
      </div>
    </div>
  )
}
