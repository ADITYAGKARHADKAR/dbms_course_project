const API_URL = '/api';
let currentUser = null;
let allMyItems = [];
let filteredItems = [];
let currentFilter = 'all';

// Check authentication
async function checkAuth() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    if (!res.ok) {
      alert('Please login to view your items');
      window.location.href = 'login.html';
      return;
    }
    currentUser = await res.json();
    document.querySelector('.btn-login').textContent = `👤 ${currentUser.user.name}`;
    document.querySelector('.btn-login').onclick = () => window.location.href = 'profile.html';
    
    fetchMyItems();
  } catch (err) {
    window.location.href = 'login.html';
  }
}

// Fetch user's items
async function fetchMyItems() {
  try {
    const res = await fetch(`${API_URL}/items/my`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch');
    
    allMyItems = await res.json();
    filteredItems = allMyItems;
    updateStats();
    renderItems();
  } catch (err) {
    console.error('Failed to fetch items:', err);
    document.getElementById('noItems').classList.remove('hidden');
  }
}

// Update statistics
function updateStats() {
  const total = allMyItems.length;
  const lost = allMyItems.filter(i => i.item_type === 'lost').length;
  const found = allMyItems.filter(i => i.item_type === 'found').length;
  const pending = allMyItems.filter(i => i.status === 'pending').length;
  const resolved = allMyItems.filter(i => i.status === 'resolved').length;
  
  document.getElementById('totalUploaded').textContent = total;
  document.getElementById('lostCount').textContent = lost;
  document.getElementById('foundCount').textContent = found;
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('resolvedCount').textContent = resolved;
}

// Filter items
function filterItems(filter) {
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
  
  applyFilters();
}

// Search items
function searchItems() {
  applyFilters();
}

// Apply both filter and search
function applyFilters() {
  const searchTerm = document.getElementById('searchBox').value.toLowerCase();
  
  filteredItems = allMyItems.filter(item => {
    // Apply filter
    let matchFilter = true;
    if (currentFilter === 'lost') matchFilter = item.item_type === 'lost';
    else if (currentFilter === 'found') matchFilter = item.item_type === 'found';
    else if (currentFilter === 'pending') matchFilter = item.status === 'pending';
    else if (currentFilter === 'resolved') matchFilter = item.status === 'resolved';
    
    // Apply search
    let matchSearch = true;
    if (searchTerm) {
      matchSearch = 
        item.item_name.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.tracking_id.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);
    }
    
    return matchFilter && matchSearch;
  });
  
  renderItems();
}

// Render items
function renderItems() {
  const grid = document.getElementById('itemsGrid');
  const noItems = document.getElementById('noItems');
  
  if (!filteredItems.length) {
    grid.innerHTML = '';
    noItems.classList.remove('hidden');
    return;
  }
  
  noItems.classList.add('hidden');
  grid.innerHTML = filteredItems.map(item => `
    <div class="item-card ${item.item_type}">
      <span class="item-badge badge-${item.item_type}">${item.item_type}</span>
      <h3>${item.item_name}</h3>
      <p class="meta">📁 ${item.category}</p>
      <p class="meta">📍 ${item.location}</p>
      <p class="meta">📅 ${item.item_date.split('T')[0]}</p>
      <p class="meta" style="margin-top:.4rem;font-size:.83rem">${item.description || 'No description'}</p>
      <p class="item-id">
        ID: ${item.tracking_id} · 
        <span class="status-badge status-${item.status}">${item.status}</span>
      </p>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
        <button 
          onclick="viewDetails('${item.tracking_id}')" 
          style="flex: 1; min-width: 120px; background: var(--primary); color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
          onmouseover="this.style.background='var(--primary-dark)'" 
          onmouseout="this.style.background='var(--primary)'">
          👁️ View Details
        </button>
        <button 
          onclick="findMatches('${item.tracking_id}')" 
          style="flex: 1; min-width: 120px; background: #16a34a; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
          onmouseover="this.style.background='#15803d'" 
          onmouseout="this.style.background='#16a34a'">
          🔍 Find Matches
        </button>
        <button 
          onclick="editItem('${item.tracking_id}')" 
          style="background: #f59e0b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
          onmouseover="this.style.background='#d97706'" 
          onmouseout="this.style.background='#f59e0b'">
          ✏️
        </button>
        <button 
          onclick="deleteItem('${item.tracking_id}')" 
          style="background: var(--lost); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background .2s;"
          onmouseover="this.style.background='#dc2626'" 
          onmouseout="this.style.background='var(--lost)'">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// View item details
function viewDetails(trackingId) {
  window.location.href = `track.html?id=${trackingId}`;
}

// Find matches
function findMatches(trackingId) {
  window.location.href = `track.html?id=${trackingId}&matches=true`;
}

// Edit item (placeholder for future feature)
function editItem(trackingId) {
  alert('Edit feature coming soon! For now, you can delete and create a new report.');
}

// Delete item
async function deleteItem(trackingId) {
  const item = allMyItems.find(i => i.tracking_id === trackingId);
  if (!confirm(`Are you sure you want to delete "${item.item_name}"?\n\nThis action cannot be undone.`)) return;
  
  try {
    const res = await fetch(`${API_URL}/items/${trackingId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (res.ok) {
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #16a34a; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; animation: slideIn 0.3s ease;';
      successDiv.innerHTML = '✅ Item deleted successfully!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => successDiv.remove(), 3000);
      
      // Refresh items
      fetchMyItems();
    } else {
      alert('Failed to delete item. Please try again.');
    }
  } catch (err) {
    alert('Failed to delete item. Please try again.');
  }
}

// Initialize
checkAuth();
