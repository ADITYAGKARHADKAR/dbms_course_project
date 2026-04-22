const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let myItems = [];
let currentFilter = 'all';

// Check authentication
async function checkAuth() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'login.html';
      return;
    }
    currentUser = await res.json();
    document.getElementById('userName').textContent = currentUser.user.name;
    document.querySelector('.btn-login').textContent = `👤 ${currentUser.user.name}`;
    
    // If admin, redirect to admin panel
    if (currentUser.user.role === 'admin') {
      window.location.href = 'admin.html';
      return;
    }
    
    fetchMyItems();
  } catch (err) {
    window.location.href = 'login.html';
  }
}

// Fetch only user's items
async function fetchMyItems() {
  try {
    const res = await fetch(`${API_URL}/items/my`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch');
    
    myItems = await res.json();
    updateStats();
    renderMyItems();
  } catch (err) {
    console.error('Failed to fetch items:', err);
    document.getElementById('noItems').classList.remove('hidden');
  }
}

function updateStats() {
  const total = myItems.length;
  const lost = myItems.filter(i => i.item_type === 'lost').length;
  const found = myItems.filter(i => i.item_type === 'found').length;
  const pending = myItems.filter(i => i.status === 'pending').length;
  
  document.getElementById('myTotal').textContent = total;
  document.getElementById('myLost').textContent = lost;
  document.getElementById('myFound').textContent = found;
  document.getElementById('myPending').textContent = pending;
}

function filterMyItems(filter) {
  currentFilter = filter;
  
  // Update active tab
  document.querySelectorAll('.form-tabs .tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', 
      (i === 0 && filter === 'all') ||
      (i === 1 && filter === 'lost') ||
      (i === 2 && filter === 'found') ||
      (i === 3 && filter === 'pending') ||
      (i === 4 && filter === 'resolved')
    );
  });
  
  renderMyItems();
}

function renderMyItems() {
  let filtered = myItems;
  
  if (currentFilter === 'lost') {
    filtered = myItems.filter(i => i.item_type === 'lost');
  } else if (currentFilter === 'found') {
    filtered = myItems.filter(i => i.item_type === 'found');
  } else if (currentFilter === 'pending') {
    filtered = myItems.filter(i => i.status === 'pending');
  } else if (currentFilter === 'resolved') {
    filtered = myItems.filter(i => i.status === 'resolved');
  }
  
  const grid = document.getElementById('myItemsGrid');
  const noItems = document.getElementById('noItems');
  
  if (!filtered.length) {
    grid.innerHTML = '';
    noItems.classList.remove('hidden');
    return;
  }
  
  noItems.classList.add('hidden');
  grid.innerHTML = filtered.map(item => `
    <div class="item-card ${item.item_type}">
      <span class="item-badge badge-${item.item_type}">${item.item_type}</span>
      <h3>${item.item_name}</h3>
      <p class="meta">📁 ${item.category}</p>
      <p class="meta">📍 ${item.location}</p>
      <p class="meta">📅 ${item.item_date.split('T')[0]}</p>
      <p class="meta" style="margin-top:.4rem;font-size:.83rem">${item.description || 'No description'}</p>
      <p class="item-id">ID: ${item.tracking_id} · <span class="status-badge status-${item.status}">${item.status}</span></p>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
        <button 
          onclick="viewMatches('${item.tracking_id}')" 
          style="flex: 1; background: var(--primary); color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;"
          onmouseover="this.style.background='var(--primary-dark)'" 
          onmouseout="this.style.background='var(--primary)'">
          🔍 Find Matches
        </button>
        <button 
          onclick="deleteItem('${item.tracking_id}')" 
          style="background: var(--lost); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;"
          onmouseover="this.style.background='#dc2626'" 
          onmouseout="this.style.background='var(--lost)'">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function viewMatches(trackingId) {
  window.location.href = `track.html?id=${trackingId}`;
}

async function deleteItem(trackingId) {
  if (!confirm('Are you sure you want to delete this report?')) return;
  
  try {
    const res = await fetch(`${API_URL}/items/${trackingId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (res.ok) {
      alert('Report deleted successfully!');
      fetchMyItems();
    } else {
      alert('Failed to delete report');
    }
  } catch (err) {
    alert('Failed to delete report');
  }
}

async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = 'home.html';
  } catch (err) {
    window.location.href = 'home.html';
  }
}

checkAuth();
