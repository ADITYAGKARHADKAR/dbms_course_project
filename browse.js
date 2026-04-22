const API_URL = 'http://localhost:3000/api';
let items = [];

async function checkAuth() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      document.querySelector('.btn-login').textContent = `👤 ${data.user.name}`;
      document.querySelector('.btn-login').onclick = () => window.location.href = 'profile.html';
    }
  } catch (err) {
    console.log('Not authenticated');
  }
}

async function fetchItems(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/items?${params}`);
    items = await res.json();
    renderItems(items);
  } catch (err) {
    console.error('Failed to fetch items');
  }
}

function renderItems(list) {
  const grid = document.getElementById('itemsGrid');
  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1">No items found.</p>';
    return;
  }
  grid.innerHTML = list.map(item => `
    <div class="item-card ${item.item_type}">
      <span class="item-badge badge-${item.item_type}">${item.item_type}</span>
      <h3>${item.item_name}</h3>
      <p class="meta">📁 ${item.category}</p>
      <p class="meta">📍 ${item.location}</p>
      <p class="meta">📅 ${item.item_date.split('T')[0]}</p>
      <p class="meta" style="margin-top:.4rem;font-size:.83rem">${item.description || 'No description'}</p>
      <p class="item-id">ID: ${item.tracking_id} · <span class="status-badge status-${item.status}">${item.status}</span></p>
      <button 
        onclick="contactItemOwner('${item.contact_email}', '${item.item_name}', '${item.tracking_id}', '${item.item_type}')" 
        style="margin-top: .5rem; width: 100%; background: #16a34a; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
        onmouseover="this.style.background='#15803d'" 
        onmouseout="this.style.background='#16a34a'">
        📧 Contact Owner
      </button>
    </div>
  `).join('');
}

function contactItemOwner(email, itemName, trackingId, itemType) {
  const subject = encodeURIComponent(`Regarding ${itemType.toUpperCase()} Item: ${itemName} (${trackingId})`);
  const body = encodeURIComponent(
    `Hello,\n\n` +
    `I saw your ${itemType} item report for "${itemName}" (Tracking ID: ${trackingId}).\n\n` +
    `I would like to discuss this with you.\n\n` +
    `Please let me know if this item is still available.\n\n` +
    `Best regards`
  );
  
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function filterItems() {
  const filters = {
    search: document.getElementById('searchInput').value,
    category: document.getElementById('filterCategory').value,
    type: document.getElementById('filterStatus').value,
  };
  fetchItems(filters);
}

checkAuth();
fetchItems();
