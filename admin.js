const API_URL = '/api';
let currentUser = null;
let allItems = [];

// Check admin authentication
async function checkAuth() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'login.html';
      return;
    }
    currentUser = await res.json();
    
    // Check if admin
    if (currentUser.user.role !== 'admin') {
      window.location.href = 'profile.html';
      return;
    }
    
    document.getElementById('adminName').textContent = currentUser.user.name;
    document.querySelector('.btn-login').textContent = `🛡️ ${currentUser.user.name}`;
    
    fetchAllItems();
    fetchStats();
  } catch (err) {
    window.location.href = 'login.html';
  }
}

// Fetch all items (admin can see everything)
async function fetchAllItems() {
  try {
    const res = await fetch(`${API_URL}/items`);
    allItems = await res.json();
    renderAdminItems(allItems);
  } catch (err) {
    console.error('Failed to fetch items');
  }
}

// Fetch statistics
async function fetchStats() {
  try {
    const res = await fetch(`${API_URL}/stats`);
    const stats = await res.json();
    
    document.getElementById('totalItems').textContent = stats.total;
    document.getElementById('totalPending').textContent = stats.pending;
    document.getElementById('totalResolved').textContent = stats.resolved;
    
    // Calculate lost/found from allItems
    const lost = allItems.filter(i => i.item_type === 'lost').length;
    const found = allItems.filter(i => i.item_type === 'found').length;
    
    document.getElementById('totalLost').textContent = lost;
    document.getElementById('totalFound').textContent = found;
    
    // Fetch user count
    const usersRes = await fetch(`${API_URL}/users/count`, { credentials: 'include' });
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      document.getElementById('totalUsers').textContent = usersData.count;
    }
  } catch (err) {
    console.error('Failed to fetch stats');
  }
}

function filterAdminItems() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;
  const status = document.getElementById('filterStatus').value;
  
  const filtered = allItems.filter(item => {
    const matchSearch = !search || 
      item.item_name.toLowerCase().includes(search) || 
      item.location.toLowerCase().includes(search) ||
      item.tracking_id.toLowerCase().includes(search);
    const matchCategory = !category || item.category === category;
    const matchType = !type || item.item_type === type;
    const matchStatus = !status || item.status === status;
    
    return matchSearch && matchCategory && matchType && matchStatus;
  });
  
  renderAdminItems(filtered);
}

function renderAdminItems(items) {
  const grid = document.getElementById('adminItemsGrid');
  
  if (!items.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1">No items found.</p>';
    return;
  }
  
  grid.innerHTML = items.map(item => `
    <div class="item-card ${item.item_type}">
      <span class="item-badge badge-${item.item_type}">${item.item_type}</span>
      <h3>${item.item_name}</h3>
      <p class="meta">📁 ${item.category}</p>
      <p class="meta">📍 ${item.location}</p>
      <p class="meta">📅 ${item.item_date.split('T')[0]}</p>
      <p class="meta" style="margin-top:.4rem;font-size:.83rem">${item.description || 'No description'}</p>
      <p class="meta">📱 ${item.contact_phone}</p>
      <p class="item-id">ID: ${item.tracking_id} · <span class="status-badge status-${item.status}">${item.status}</span></p>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
        <button 
          onclick="updateStatus('${item.tracking_id}', '${item.status === 'pending' ? 'resolved' : 'pending'}')" 
          style="flex: 1; background: ${item.status === 'pending' ? '#16a34a' : '#f59e0b'}; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
          ${item.status === 'pending' ? '✅ Mark Resolved' : '⏳ Mark Pending'}
        </button>
        <button 
          onclick="deleteItem('${item.tracking_id}')" 
          style="background: var(--lost); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

async function updateStatus(trackingId, newStatus) {
  try {
    const res = await fetch(`${API_URL}/items/${trackingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      alert(`Status updated to ${newStatus}!`);
      fetchAllItems();
      fetchStats();
    } else {
      alert('Failed to update status');
    }
  } catch (err) {
    alert('Failed to update status');
  }
}

async function deleteItem(trackingId) {
  if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;
  
  try {
    const res = await fetch(`${API_URL}/items/${trackingId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (res.ok) {
      alert('Report deleted successfully!');
      fetchAllItems();
      fetchStats();
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

function filterByCard(type) {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterStatus').value = '';

  let filtered;
  let label;
  if (type === 'all') {
    filtered = allItems;
    label = 'All Reports';
  } else if (type === 'lost') {
    filtered = allItems.filter(i => i.item_type === 'lost');
    label = 'Lost Items';
  } else if (type === 'found') {
    filtered = allItems.filter(i => i.item_type === 'found');
    label = 'Found Items';
  } else if (type === 'pending') {
    filtered = allItems.filter(i => i.status === 'pending');
    label = 'Pending Items';
  } else if (type === 'resolved') {
    filtered = allItems.filter(i => i.status === 'resolved');
    label = 'Resolved Items';
  }

  document.getElementById('gridTitle').textContent = label;
  renderAdminItems(filtered);
  document.getElementById('adminItemsGrid').scrollIntoView({ behavior: 'smooth' });
}

async function showUsers() {
  try {
    const res = await fetch(`${API_URL}/users`, { credentials: 'include' });
    const users = await res.json();
    const container = document.getElementById('usersTableContainer');
    container.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">#</th>
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">Name</th>
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">Email</th>
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">Phone</th>
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">Role</th>
            <th style="padding:0.75rem; text-align:left; border-bottom:2px solid #e5e7eb;">Joined</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u, i) => `
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:0.75rem;">${i + 1}</td>
              <td style="padding:0.75rem; font-weight:600;">${u.user_name}</td>
              <td style="padding:0.75rem;">${u.email}</td>
              <td style="padding:0.75rem;">${u.phone_no}</td>
              <td style="padding:0.75rem;">
                <span style="background:${u.role === 'admin' ? '#fef3c7' : '#dbeafe'}; color:${u.role === 'admin' ? '#d97706' : '#1d4ed8'}; padding:0.25rem 0.75rem; border-radius:20px; font-size:0.8rem; font-weight:600;">
                  ${u.role}
                </span>
              </td>
              <td style="padding:0.75rem; color:#6b7280;">${new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('usersModal').style.display = 'block';
  } catch (err) {
    alert('Failed to fetch users');
  }
}

function closeUsers() {
  document.getElementById('usersModal').style.display = 'none';
}

checkAuth();
