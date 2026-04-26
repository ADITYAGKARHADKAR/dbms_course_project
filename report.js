const API_URL = '/api';
let allItems = [];
let matchTimeout = null;

// Check auth
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

// Fetch all items for live matching
async function fetchAllItems() {
  try {
    const res = await fetch(`${API_URL}/items`);
    allItems = await res.json();
  } catch (err) {
    console.error('Failed to fetch items');
  }
}

function switchTab(type) {
  document.getElementById('reportType').value = type;
  document.querySelectorAll('.form-tabs .tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && type === 'lost') || (i === 1 && type === 'found'));
  });
  autoSuggestMatches(); // Re-check matches when switching tabs
}

// Auto-suggest matches as user types
function autoSuggestMatches() {
  clearTimeout(matchTimeout);
  
  matchTimeout = setTimeout(() => {
    const itemName = document.getElementById('itemName').value.trim().toLowerCase();
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value.trim().toLowerCase();
    const reportType = document.getElementById('reportType').value;
    
    // Need at least item name or category to show suggestions
    if (!itemName && !category && !location) {
      document.getElementById('liveMatches').classList.add('hidden');
      return;
    }
    
    // Find opposite type items
    const oppositeType = reportType === 'lost' ? 'found' : 'lost';
    
    // Filter and score matches
    const matches = allItems
      .filter(item => item.item_type === oppositeType && item.status === 'pending')
      .map(item => {
        let score = 0;
        let reasons = [];
        
        // Name matching
        if (itemName && item.item_name.toLowerCase().includes(itemName)) {
          score += 4;
          reasons.push('Similar Name');
        }
        
        // Category matching
        if (category && item.category === category) {
          score += 3;
          reasons.push('Same Category');
        }
        
        // Location matching
        if (location && item.location.toLowerCase().includes(location)) {
          score += 2;
          reasons.push('Similar Location');
        }
        
        return { ...item, match_score: score, reasons };
      })
      .filter(item => item.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);
    
    if (matches.length > 0) {
      displayLiveMatches(matches);
    } else {
      document.getElementById('liveMatches').classList.add('hidden');
    }
  }, 500); // Wait 500ms after user stops typing
}

function displayLiveMatches(matches) {
  const container = document.getElementById('liveMatches');
  const reportType = document.getElementById('reportType').value;
  
  container.innerHTML = `
    <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 1rem; margin-top: 0.5rem;">
      <h4 style="color: #2563eb; margin: 0 0 0.5rem 0; font-size: 0.9rem;">
        🔍 ${matches.length} Potential ${reportType === 'lost' ? 'Found' : 'Lost'} Item${matches.length > 1 ? 's' : ''} Match!
      </h4>
      ${matches.map(item => `
        <div style="background: white; padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
            <div style="flex: 1;">
              <strong style="color: #1e293b;">${item.item_name}</strong>
              <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.2rem;">
                📁 ${item.category} · 📍 ${item.location}
              </div>
              <div style="font-size: 0.75rem; color: #64748b;">
                📅 ${item.item_date.split('T')[0]} · ID: ${item.tracking_id}
              </div>
              <div style="font-size: 0.75rem; color: #2563eb; margin-top: 0.3rem;">
                📱 ${item.contact_phone}
              </div>
              <button 
                onclick="contactOwner('${item.contact_phone}', '${item.item_name}', '${item.tracking_id}')" 
                style="margin-top: 0.5rem; background: #16a34a; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600;"
                onmouseover="this.style.background='#15803d'" 
                onmouseout="this.style.background='#16a34a'">
                💬 WhatsApp Message
              </button>
            </div>
            <div style="background: #3b82f6; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; align-self: flex-start;">
              ${item.reasons.join(' + ')}
            </div>
          </div>
        </div>
      `).join('')}
      <p style="font-size: 0.75rem; color: #64748b; margin: 0.5rem 0 0 0;">
        💡 Click "Contact Owner" to reach out directly!
      </p>
    </div>
  `;
  container.classList.remove('hidden');
}

function validate(id, errId, msg) {
  const val = document.getElementById(id).value.trim();
  const err = document.getElementById(errId);
  if (!val) { err.textContent = msg; return false; }
  err.textContent = '';
  return true;
}

function validatePhone(id, errId) {
  const val = document.getElementById(id).value.trim();
  const err = document.getElementById(errId);
  if (!val) { err.textContent = 'Phone number is required.'; return false; }
  if (!/^\+?[0-9\s\-()]{7,}$/.test(val)) { err.textContent = 'Enter a valid phone number.'; return false; }
  err.textContent = '';
  return true;
}

async function submitReport(e) {
  e.preventDefault();
  const ok = [
    validate('itemName', 'itemNameErr', 'Item name is required.'),
    validate('category', 'categoryErr', 'Please select a category.'),
    validate('location', 'locationErr', 'Location is required.'),
    validate('itemDate', 'dateErr', 'Date is required.'),
    validate('userName', 'userNameErr', 'Your name is required.'),
    validatePhone('userPhone', 'phoneErr'),
  ].every(Boolean);

  if (!ok) return;

  const data = {
    type: document.getElementById('reportType').value,
    name: document.getElementById('itemName').value.trim(),
    category: document.getElementById('category').value,
    location: document.getElementById('location').value.trim(),
    date: document.getElementById('itemDate').value,
    description: document.getElementById('description').value.trim(),
    contactPhone: document.getElementById('userPhone').value.trim(),
    userName: document.getElementById('userName').value.trim(),
  };

  try {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (res.ok) {
      document.getElementById('trackingId').textContent = result.trackingId;
      document.getElementById('successMsg').classList.remove('hidden');
      document.getElementById('reportForm').reset();
      document.getElementById('liveMatches').classList.add('hidden');
      
      if (result.matches && result.matches.length > 0) {
        displayMatches(result.matches);
      } else {
        document.getElementById('matchesSection').classList.add('hidden');
      }
      
      // Refresh items list
      await fetchAllItems();
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } else {
      alert(result.error || 'Failed to submit report');
    }
  } catch (err) {
    alert('Failed to submit report. Please try again.');
  }
}

function displayMatches(matches) {
  const grid = document.getElementById('matchesGrid');
  grid.innerHTML = matches.map(item => {
    const matchLabels = [];
    if (item.match_score >= 3) matchLabels.push('Same Category');
    if (item.match_score >= 5) matchLabels.push('Similar Location');
    if (item.match_score >= 6) matchLabels.push('Recent Date');
    
    return `
      <div class="match-card">
        <div class="match-info">
          <h4>${item.item_name}</h4>
          <p class="meta">📁 ${item.category} · 📍 ${item.location}</p>
          <p class="meta">📅 ${item.item_date} · ID: ${item.tracking_id}</p>
          <p class="meta">📱 ${item.contact_phone}</p>
          <button 
            onclick="contactOwner('${item.contact_phone}', '${item.item_name}', '${item.tracking_id}')" 
            class="btn-contact">
            💬 WhatsApp Message
          </button>
        </div>
        <div class="match-score">${matchLabels.join(' + ') || 'Match'}</div>
      </div>
    `;
  }).join('');
  document.getElementById('matchesSection').classList.remove('hidden');
}

// Contact owner function - opens WhatsApp
function contactOwner(phone, itemName, trackingId) {
  const reportType = document.getElementById('reportType').value;
  const yourName = document.getElementById('userName').value || 'Someone';
  
  // Format phone number for WhatsApp (remove all non-digit characters except +)
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  const message = encodeURIComponent(
    `🎉 YOUR PRODUCT FOUND! 🎉\n\n` +
    `Hello,\n\n` +
    `Good news! I found a match for your item!\n\n` +
    `📦 Item: ${itemName}\n` +
    `🔍 Tracking ID: ${trackingId}\n\n` +
    `I saw your ${reportType === 'lost' ? 'found' : 'lost'} item report and I believe this might be the one you're looking for.\n\n` +
    `Let's connect and verify! Could we discuss this further?\n\n` +
    `Sent by: ${yourName}\n` +
    `From: Lost & Found Portal`
  );
  
  // Open WhatsApp Web
  window.location.href = `https://wa.me/${cleanPhone}?text=${message}`;
}

// Initialize
checkAuth();
fetchAllItems();
