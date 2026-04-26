const API_URL = '/api';
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
        onclick="contactItemOwner('${item.contact_email}', '${item.item_name}', '${item.tracking_id}')" 
        style="margin-top: .5rem; width: 100%; background: #3b82f6; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
        onmouseover="this.style.background='#1d4ed8'" 
        onmouseout="this.style.background='#3b82f6'">
        ✉️ Contact via Email
      </button>
    </div>
  `).join('');
}

async function contactItemOwner(recipientEmail, itemName, trackingId) {
  const senderName = prompt('Enter your name:');
  if (!senderName) return;

  const senderEmail = prompt('Enter your email address:');
  if (!senderEmail) return;

  const message = prompt('Enter your message (optional):') || '';

  try {
    const res = await fetch(`${API_URL}/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderName, senderEmail, recipientEmail, itemName, message })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Email sent successfully! The reporter will contact you back.');
    } else {
      alert(data.error || 'Failed to send email.');
    }
  } catch (err) {
    alert('Failed to send email. Please try again.');
  }
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
