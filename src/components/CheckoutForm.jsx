import React, { useState } from 'react'

export default function CheckoutForm({ onPlaceOrder, onCancel, totalPrice }) {
  const [form, setForm] = useState({ name: '', email: '', address: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.address) return
    onPlaceOrder(form)
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} style={{ padding: '0', border: 'none', marginTop: '20px' }}>
      <h3 className="footer-heading" style={{ marginBottom: '16px' }}>Shipping Details</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          className="search"
          style={{ width: '100%' }}
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="search"
          style={{ width: '100%' }}
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          className="search"
          style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
          placeholder="Shipping Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button type="button" className="nav-link" style={{ flex: 1, fontSize: '12px' }} onClick={onCancel}>
          BACK TO CART
        </button>
        <button type="submit" className="btn-primary" style={{ flex: 2, fontSize: '12px' }}>
          PLACE ORDER • ${totalPrice}
        </button>
      </div>
    </form>
  )
}
