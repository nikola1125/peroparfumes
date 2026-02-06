import React from 'react'
import CheckoutForm from './CheckoutForm.jsx'

export default function CartPanel({
  isOpen,
  cart,
  products,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
  totalItems,
  totalPrice,
  onClear,
  checkoutMode,
  onPlaceOrder,
  onBackToCart
}) {
  return (
    <div className={`cart-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="logo-text">YOUR CART ({totalItems})</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">&times;</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#666', fontSize: '14px' }}>Your cart is empty.</p>
              <button
                className="btn-primary"
                style={{ marginTop: '20px', fontSize: '12px' }}
                onClick={onClose}
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => {
                const p = products.find((x) => x.id === item.id)
                if (!p) return null
                return (
                  <div key={item.id} className="cart-item" style={{ border: 'none', padding: '16px 0', borderBottom: '1px solid #eee', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                    <div className="cart-info" style={{ flex: 1 }}>
                      <p className="card-category" style={{ fontSize: '10px', marginBottom: '4px' }}>{p.category}</p>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="cart-qty" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)} style={{ padding: '4px 8px', border: '1px solid #ddd', background: 'none', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                          <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)} style={{ padding: '4px 8px', border: '1px solid #ddd', background: 'none', cursor: 'pointer' }}>+</button>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>${p.price * item.qty}</span>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{ background: 'none', border: 'none', color: '#999', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', marginTop: '8px', padding: '0' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>SUBTOTAL</span>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>${totalPrice}</span>
            </div>
            {!checkoutMode ? (
              <button className="btn-primary" style={{ width: '100%' }} onClick={onCheckout}>
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <CheckoutForm onPlaceOrder={onPlaceOrder} onCancel={onBackToCart} totalPrice={totalPrice} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
