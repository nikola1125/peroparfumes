(function(){
  const products = [
    { id: 1, name: 'Azure Dusk', brand: 'Pero Parfumes', price: 74, rating: 4.7, category: 'Fresh', colors: ['#2EC4B6', '#0077B6'], description: 'Crisp citrus with ocean breeze and musk.' },
    { id: 2, name: 'Floral Mirage', brand: 'Pero Parfumes', price: 68, rating: 4.5, category: 'Floral', colors: ['#E91E63', '#FF8A65'], description: 'Gardenia and peony with subtle vanilla.' },
    { id: 3, name: 'Noir Oud', brand: 'Pero Parfumes', price: 92, rating: 4.8, category: 'Woody', colors: ['#3B1F1F', '#A0522D'], description: 'Deep amber, oud and spices.' },
    { id: 4, name: 'Citrus Velvet', brand: 'Pero Parfumes', price: 55, rating: 4.2, category: 'Citrus', colors: ['#FFD166', '#06D6A0'], description: 'Bright lemon and orange blossom.' },
    { id: 5, name: 'Ambre Lumière', brand: 'Pero Parfumes', price: 80, rating: 4.6, category: 'Amber', colors: ['#D94F70', '#F6D365'], description: 'Warm amber with honeyed vanilla.' },
    { id: 6, name: 'Velvet Woods', brand: 'Pero Parfumes', price: 70, rating: 4.4, category: 'Woody', colors: ['#2C3E50', '#3498DB'], description: 'Cedarwood and sandalwood with musk.' },
    { id: 7, name: 'Ocean Whisper', brand: 'Pero Parfumes', price: 60, rating: 4.1, category: 'Fresh', colors: ['#5BC0EB', '#2ECC71'], description: 'Sea breeze, green notes, salt spray.' },
    { id: 8, name: 'Midnight Rose', brand: 'Pero Parfumes', price: 78, rating: 4.9, category: 'Floral', colors: ['#8E44AD', '#C0392B'], description: 'Rose petals with musk and vanilla.' }
  ];

  function bottleSVG(colorA, colorB){
    return `
<svg width="120" height="180" viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" aria-label="bottle">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${colorA}" offset="0"/>
      <stop stop-color="${colorB}" offset="1"/>
    </linearGradient>
  </defs>
  <rect x="28" y="18" width="64" height="120" rx="12" fill="url(#grad)" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
  <rect x="46" y="10" width="28" height="18" rx="6" fill="white" opacity=".85"/>
  <rect x="48" y="0" width="24" height="10" rx="3" fill="rgba(0,0,0,.15)"/>
  <rect x="34" y="90" width="52" height="6" rx="3" fill="rgba(255,255,255,.5)"/>
</svg>`;
  }

  function render(){
    const grid = document.getElementById('product-grid');
    const query = (document.getElementById('search')?.value || '').toLowerCase();
    const sort = document.getElementById('sort').value;
    let items = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    if (sort === 'price-asc') items = items.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') items = items.sort((a,b)=>b.price-a.price);
    else if (sort === 'rating') items = items.sort((a,b)=> b.rating - a.rating);

    grid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-id', p.id);
      card.innerHTML = `
        <div class="image" style="background: linear-gradient(135deg, ${p.colors[0]} 0%, ${p.colors[1]} 100%); display:flex; align-items:center; justify-content:center;">
          ${bottleSVG(p.colors[0], p.colors[1])}
        </div>
        <div class="card-body">
          <div class="card-title">${p.name}</div>
          <div class="card-sub">${p.category} • ${p.brand}</div>
          <div class="card-footer">
            <span class="price">$${p.price}</span>
            <span class="rating" title="${p.rating} stars">★ ${p.rating.toFixed(1)}</span>
            <button class="view-btn btn" aria-label="View ${p.name}">View</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function openModal(p){
    const modal = document.getElementById('quickView');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.getElementById('modalName').textContent = p.name;
    document.getElementById('modalPrice').textContent = `$${p.price.toFixed(2)}`;
    document.getElementById('modalDesc').textContent = p.description;
    document.getElementById('modalImage').innerHTML = bottleSVG(p.colors[0], p.colors[1]);
    document.getElementById('modalRating').textContent = `Rating: ${p.rating.toFixed(1)} / 5`;
    document.getElementById('addToCartBtn').dataset.id = p.id;
  }
  function closeModal(){
    const modal = document.getElementById('quickView');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  }
  function findById(id){ return products.find(p => p.id === id); }

  document.addEventListener('DOMContentLoaded', ()=>{
    render();
    document.getElementById('year').textContent = new Date().getFullYear();

    document.getElementById('search').addEventListener('input', ()=> render());
    document.getElementById('sort').addEventListener('change', ()=> render());

    document.getElementById('product-grid').addEventListener('click', (e)=>{
      const btn = e.target.closest('.view-btn');
      if (!btn) return;
      const card = btn.closest('.card');
      const id = parseInt(card.dataset.id);
      const p = findById(id);
      if (p) openModal(p);
    });

    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('quickView').addEventListener('click', (e)=>{ if (e.target === document.getElementById('quickView')) closeModal(); });
    document.getElementById('addToCartBtn').addEventListener('click', ()=>{ const id = parseInt(document.getElementById('addToCartBtn').dataset.id); const p = findById(id); alert(`Added ${p.name} to cart`); closeModal(); });

    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.main-nav');
    menuToggle.addEventListener('click', ()=>{ nav.classList.toggle('open'); });
  });
})();
