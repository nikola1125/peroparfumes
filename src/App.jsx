import React, { useMemo, useState } from 'react'
import { products } from './data/products.js'
import ProductCard from './components/ProductCard.jsx'
import CartPanel from './components/CartPanel.jsx'
import CheckoutForm from './components/CheckoutForm.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([]) // { id, qty }
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [])

  const addToCart = (prod, qty = 1) => {
    setCart((c) => {
      const found = c.find(i => i.id === prod.id)
      if (found) {
        return c.map(i => i.id === prod.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...c, { id: prod.id, qty }]
    })
    setCartOpen(true)
  }

  const updateQty = (id, delta) => {
    setCart((c) => {
      const next = c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0)
      return next
    })
  }

  const removeFromCart = (id) => {
    setCart((c) => c.filter(i => i.id !== id))
  }

  const totalItems = cart.reduce((sum, it) => sum + it.qty, 0)
  const totalPrice = cart.reduce((sum, it) => {
    const p = products.find(p => p.id === it.id)
    return sum + (p?.price ?? 0) * it.qty
  }, 0)

  const filtered = useMemo(() => {
    return products.filter(p => (
      (category === 'All' || p.category === category) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    ))
  }, [category, query])

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const placeOrder = (details) => {
    // Simple mock checkout: clear cart and show success
    setCart([])
    setCheckoutMode(false)
    setOrderPlaced(true)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-text">PERO PARFUMES</span>
          </div>
          <nav className="main-nav">
            <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button className="nav-link" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>Collections</button>
            <button className="nav-link" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>Our Story</button>
          </nav>
          <button className="cart-trigger" onClick={() => setCartOpen(true)}>
            CART ({totalItems})
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1 className="brand-slogan">The Art of Essence</h1>
            <p className="hero-sub">Discover our curated collection of artisanal fragrances, designed to evoke memories and inspire new ones.</p>
            <button className="btn-primary" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>Explore Collection</button>
          </div>
        </div>
      </section>

      <section id="shop" className="shop-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Signature Scents</h2>
              <p className="text-muted">Handcrafted with rare ingredients from across the globe.</p>
            </div>
            <div className="filters">
              <input
                className="search"
                placeholder="Find your scent..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select className="sort" onChange={(e) => setCategory(e.target.value)} value={category}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p, 1)} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content reveal">
            <h2 className="stagger-1">Our Story</h2>
            <p className="about-text stagger-2">
              Born from a passion for botanical wonders, Pero Parfumes creates scents that are simultaneously timeless and modern.
              Each bottle is a testament to our commitment to quality, sustainability, and the profound beauty of the natural world.
            </p>
          </div>
        </div>
      </section>

      <section className="spotlight-section">
        <div className="spotlight-wrapper">
          {products.slice(0, 3).map((p, idx) => (
            <div key={p.id} className={`spotlight-item reveal ${idx % 2 === 1 ? 'reverse' : ''}`}>
              <div className="container spotlight-container">
                <div className="spotlight-image">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="spotlight-content">
                  <div className="spotlight-line stagger-1"></div>
                  <p className="card-category stagger-2">{p.category}</p>
                  <h2 className="spotlight-title stagger-3">{p.name}</h2>
                  <p className="spotlight-desc stagger-4">{p.description}</p>
                  <div className="stagger-5" style={{ marginBottom: '24px' }}>
                    <div className="spotlight-notes">
                      <span>Top: {p.notes.top}</span>
                      <span>•</span>
                      <span>Heart: {p.notes.mid}</span>
                      <span>•</span>
                      <span>Base: {p.notes.base}</span>
                    </div>
                  </div>
                  <button className="btn-primary stagger-6" onClick={() => addToCart(p, 1)}>ADD TO CART — ${p.price}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ingredients-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div>
              <h2>Natural Rarities</h2>
              <p className="text-muted">A glimpse into the rare essences that define our fragrances.</p>
            </div>
          </div>
          <div className="ingredients-grid">
            <div className="ingredient-card reveal">
              <div className="ingredient-image-wrapper">
                <img src="https://images.unsplash.com/photo-1559563362-c667bb5f5480?auto=format&fit=crop&q=80&w=600" alt="Black Rose" className="ingredient-image" />
              </div>
              <h3 className="ingredient-name stagger-1">Black Rose</h3>
              <p className="ingredient-desc stagger-2">Deep, velvety, and mysterious. Harvested at midnight to preserve its intense aroma.</p>
            </div>
            <div className="ingredient-card reveal">
              <div className="ingredient-image-wrapper">
                <img src="https://images.unsplash.com/photo-1591146244463-548c772b1437?auto=format&fit=crop&q=80&w=600" alt="Sicilian Lemon" className="ingredient-image" />
              </div>
              <h3 className="ingredient-name stagger-1">Sicilian Lemon</h3>
              <p className="ingredient-desc stagger-2">Zesty and vibrant. Hand-picked from sun-drenched groves for unmatched freshness.</p>
            </div>
            <div className="ingredient-card reveal">
              <div className="ingredient-image-wrapper">
                <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=600" alt="Australian Sandalwood" className="ingredient-image" />
              </div>
              <h3 className="ingredient-name stagger-1">Australian Sandalwood</h3>
              <p className="ingredient-desc stagger-2">Creamy, warm, and grounding. Sourced from sustainable, ancient plantations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Olfactory Stories</h2>
              <p className="text-muted">The experiences of our community with Pero Parfumes.</p>
            </div>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">"Midnight Velvet has become my evening shadow. I've never received so many compliments on a scent before."</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <span className="author-name">Clara V.</span>
                  <span className="author-title">Verified Collector</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"The freshness of Citrus Grove is unparalleled. It feels like wearing a crisp white shirt in a lemon garden."</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <span className="author-name">Julian M.</span>
                  <span className="author-title">Fragrance Enthusiast</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"Ethereal Bloom is so delicate yet persistent. It’s my go-to for daily elegance. Stunning bottles too!"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <span className="author-name">Elena R.</span>
                  <span className="author-title">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="families-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div>
              <h2>Fragrance Families</h2>
              <p className="text-muted">Understanding the character behind every bottle.</p>
            </div>
          </div>
          <div className="families-grid">
            <div className="family-card">
              <img src="https://images.unsplash.com/photo-1490750967868-886a502cfa8a?auto=format&fit=crop&q=80&w=600" alt="Floral" className="family-image" />
              <div className="family-content">
                <h3 className="family-title">Floral</h3>
                <p className="family-desc">Romantic, feminine, and timeless. Notes of rose, jasmine, and lily.</p>
              </div>
            </div>
            <div className="family-card">
              <img src="https://images.unsplash.com/photo-1523413363574-c3c44b706051?auto=format&fit=crop&q=80&w=600" alt="Fresh" className="family-image" />
              <div className="family-content">
                <h3 className="family-title">Fresh</h3>
                <p className="family-desc">Clean, energetic, and bright. Notes of citrus, water, and green leaves.</p>
              </div>
            </div>
            <div className="family-card">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600" alt="Woody" className="family-image" />
              <div className="family-content">
                <h3 className="family-title">Woody</h3>
                <p className="family-desc">Earthy, warm, and sophisticated. Notes of sandalwood, cedar, and vetiver.</p>
              </div>
            </div>
            <div className="family-card">
              <img src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=600" alt="Spicy" className="family-image" />
              <div className="family-content">
                <h3 className="family-title">Spicy</h3>
                <p className="family-desc">Exotic, sensual, and bold. Notes of cinnamon, pepper, and amber.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layering-section">
        <div className="container">
          <div className="layering-content">
            <h2>The Art of Layering</h2>
            <p className="text-muted">Create a signature scent that is uniquely yours by combining our artisanal blends.</p>
            <div className="layering-steps">
              <div className="layering-step">
                <div className="step-number">01</div>
                <h3 className="step-title">The Foundation</h3>
                <p className="step-desc">Start with a heavier, woody or spicy base scent to ground your olfactory profile.</p>
              </div>
              <div className="layering-step">
                <div className="step-number">02</div>
                <h3 className="step-title">The Accent</h3>
                <p className="step-desc">Mist a lighter, floral or fresh fragrance on top to add complexity and brightness.</p>
              </div>
              <div className="layering-step">
                <div className="step-number">03</div>
                <h3 className="step-title">The Ritual</h3>
                <p className="step-desc">Avoid rubbing your wrists. Let the essences breathe and meld with your skin's natural warmth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-text">PERO PARFUMES</span>
              <p className="footer-desc">Crafting olfactory experiences that linger in the heart and mind.</p>
            </div>
            <div>
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><a href="#shop">All Collections</a></li>
                <li><a href="#shop">Best Sellers</a></li>
                <li><a href="#shop">Gift Sets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li><a href="#about">Our Story</a></li>
                <li><a href="#about">Sustainability</a></li>
                <li><a href="#about">Journal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Stay Connected</h4>
              <p className="footer-desc" style={{ marginBottom: '16px' }}>Join our newsletter for exclusive updates.</p>
              <input
                className="search"
                placeholder="Email Address"
                style={{ width: '100%', marginBottom: '12px' }}
              />
              <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '12px', width: '100%' }}>SUBSCRIBE</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Pero Parfumes. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Privacy Policy</a>
              <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <CartPanel
        isOpen={cartOpen}
        cart={cart}
        products={products}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setCheckoutMode(true); }}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClear={() => setCart([])}
        checkoutMode={checkoutMode}
        onPlaceOrder={placeOrder}
        onBackToCart={() => setCheckoutMode(false)}
      />

      {orderPlaced && (
        <div className="cart-overlay show" onClick={() => { setOrderPlaced(false); }} aria-label="Order placed confirmation">
          <div className="cart-panel" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2 className="logo-text">Thank You</h2>
              <button className="cart-close" onClick={() => setOrderPlaced(false)}>&times;</button>
            </div>
            <div className="cart-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', marginBottom: '32px' }}>Your order has been placed successfully.</p>
              <button className="btn-primary" onClick={() => { setOrderPlaced(false); setCartOpen(false); }}>Return to Shop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
