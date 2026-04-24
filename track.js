const API_URL = 'http://localhost:3000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const trackingId = params.get('id');
  const showMatches = params.get('matches') === 'true';

  checkAuth();

  if (showMatches && trackingId) {
    // Show matches for this item
    displayMatches(trackingId);
  } else if (trackingId) {
    // Auto-fill and track the item
    document.getElementById('trackInput').value = trackingId;
    trackItem();
  }
});

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

// Track item by ID
async function trackItem() {
  const trackingId = document.getElementById('trackInput').value.trim().toUpperCase();
  if (!trackingId) {
    showError('Please enter a Tracking ID');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/items/track/${trackingId}`, {
      credentials: 'include'
    });

    if (!res.ok) {
      showError('Item not found. Please check your Tracking ID.');
      return;
    }

    const item = await res.json();
    displayTrackingResult(item);
  } catch (err) {
    console.error('Error:', err);
    showError('Failed to track item. Please try again.');
  }
}

// Display tracking result
function displayTrackingResult(item) {
  const result = document.getElementById('trackResult');
  result.classList.remove('hidden');
  
  const statusColor = item.status === 'lost' ? '#dc2626' : '#16a34a';
  const statusBg = item.status === 'lost' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)';
  
  result.innerHTML = `
    <div style="background: white; border: 2px solid ${statusColor}; border-radius: 12px; padding: 2rem; margin-top: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.25rem;">📋 Item Details</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Item Name</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0;">${item.item_name}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Category</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0;">${item.category}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Location</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0;">${item.location}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Date</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0;">${new Date(item.item_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.25rem;">🔍 Tracking Info</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Tracking ID</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0; font-family: monospace; background: #f3f4f6; padding: 0.5rem; border-radius: 6px;">${item.tracking_id}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Status</span>
              <p style="color: white; font-weight: 600; margin: 0.25rem 0 0 0; background: ${statusColor}; padding: 0.5rem 1rem; border-radius: 6px; display: inline-block; text-transform: uppercase; font-size: 0.875rem;">${item.status}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Reporter</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0;">${item.contact_name || item.user_name || 'Anonymous'}</p>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 0.875rem;">Contact</span>
              <p style="color: #1f2937; font-weight: 600; margin: 0.25rem 0 0 0; word-break: break-all;">${item.contact_email}</p>
            </div>
          </div>
        </div>
      </div>
      ${item.description ? `
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
          <h4 style="color: #1f2937; margin-bottom: 0.5rem;">Description</h4>
          <p style="color: #4b5563; line-height: 1.6;">${item.description}</p>
        </div>
      ` : ''}
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <button onclick="displayMatches('${item.tracking_id}')" style="background: #16a34a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">🔍 Find Matches</button>
        <button onclick="goHome()" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">🏠 Go Home</button>
      </div>
    </div>
  `;
}

// Display matches for an item
async function displayMatches(trackingId) {
  try {
    // First, get the item details
    const itemRes = await fetch(`${API_URL}/items/track/${trackingId}`, {
      credentials: 'include'
    });

    if (!itemRes.ok) {
      showError('Item not found.');
      return;
    }

    const item = await itemRes.json();

    // Then get matches
    const matchRes = await fetch(`${API_URL}/items/matches/${item.item_id}`, {
      credentials: 'include'
    });

    if (!matchRes.ok) {
      showError('Failed to find matches.');
      return;
    }

    const matches = await matchRes.json();
    renderMatches(item, matches);
  } catch (err) {
    console.error('Error:', err);
    showError('Failed to find matches. Please try again.');
  }
}

// Render matches
function renderMatches(originalItem, matches) {
  const result = document.getElementById('trackResult');
  result.classList.remove('hidden');

  let html = `
    <div style="margin-top: 1.5rem;">
      <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="color: #166534; margin: 0 0 0.5rem 0;">✅ Matches Found!</h2>
        <p style="color: #4b7c0f; margin: 0;">We found ${matches.length} potential match${matches.length !== 1 ? 'es' : ''} for your item.</p>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="color: #1f2937; margin-top: 0;">Your Item</h3>
        <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1f2937; font-weight: 600;">📦 ${originalItem.item_name}</p>
          <p style="margin: 0.25rem 0 0 0; color: #6b7280; font-size: 0.875rem;">📁 ${originalItem.category} • 📍 ${originalItem.location} • 📅 ${new Date(originalItem.item_date).toLocaleDateString()}</p>
          <p style="margin: 0.5rem 0 0 0; color: #6b7280; font-size: 0.875rem;">Status: <span style="background: ${originalItem.status === 'lost' ? '#fee2e2' : '#dcfce7'}; color: ${originalItem.status === 'lost' ? '#991b1b' : '#166534'}; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 600; text-transform: uppercase;">${originalItem.status}</span></p>
        </div>
      </div>
  `;

  if (matches.length === 0) {
    html += `
      <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 12px; padding: 2rem; text-align: center;">
        <p style="color: #92400e; margin: 0; font-size: 1.125rem;">😔 No matches found yet</p>
        <p style="color: #b45309; margin: 0.5rem 0 0 0;">Keep an eye on this page. New items are added regularly!</p>
      </div>
    `;
  } else {
    html += `
      <div>
        <h3 style="color: #1f2937; margin-bottom: 1rem;">🎯 Matching Items</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
    `;

    matches.forEach(match => {
      const matchStatusColor = match.status === 'lost' ? '#dc2626' : '#16a34a';
      const matchStatusBg = match.status === 'lost' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)';
      
      html += `
        <div style="background: white; border: 2px solid ${matchStatusColor}; border-radius: 12px; padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: #1f2937; font-size: 1.125rem;">${match.item_name}</h3>
            <span style="background: ${matchStatusBg}; color: ${matchStatusColor}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${match.status}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #6b7280;">
              <span>📁</span>
              <span>${match.category}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #6b7280;">
              <span>📍</span>
              <span>${match.location}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #6b7280;">
              <span>📅</span>
              <span>${new Date(match.item_date).toLocaleDateString()}</span>
            </div>
          </div>
          ${match.description ? `
            <p style="margin: 1rem 0; padding: 0.75rem; background: #f9fafb; border-radius: 6px; color: #4b5563; font-size: 0.875rem; line-height: 1.5;">${match.description}</p>
          ` : ''}
          <div style="padding-top: 1rem; border-top: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 0.5rem; color: #6b7280; font-size: 0.875rem;">
            <div><strong>Reporter:</strong> ${match.contact_name || match.user_name || 'Anonymous'}</div>
            <div><strong>Email:</strong> <a href="mailto:${match.contact_email}" style="color: #3b82f6; text-decoration: none;">${match.contact_email}</a></div>
            <div><strong>ID:</strong> <span style="font-family: monospace; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px;">${match.tracking_id}</span></div>
          </div>
          <button onclick="contactUser('${match.contact_email}', '${match.item_name}')" style="width: 100%; margin-top: 1rem; background: #3b82f6; color: white; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#3b82f6'">✉️ Contact User</button>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  html += `
    <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
      <button onclick="trackItem()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#3b82f6'">🔍 Search Another Item</button>
      <button onclick="goHome()" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">🏠 Go Home</button>
    </div>
  `;

  result.innerHTML = html;
}

// Contact user
async function contactUser(email, itemName) {
  // Get sender info from session or prompt
  const senderName = prompt('Enter your name:');
  if (!senderName) return;

  const senderEmail = prompt('Enter your email:');
  if (!senderEmail || !senderEmail.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }

  const message = prompt(`Enter your message (optional):\n\nDefault: "I am interested in the ${itemName} you reported on the Lost & Found Portal."`);

  try {
    const res = await fetch(`${API_URL}/contact/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderName,
        senderEmail,
        recipientEmail: email,
        itemName,
        message: message || `I am interested in the ${itemName} you reported on the Lost & Found Portal.`
      })
    });

    if (res.ok) {
      showSuccessNotification(`✅ Email sent to ${email}! They will receive your contact information.`);
    } else {
      const error = await res.json();
      alert(`Error: ${error.error || 'Failed to send email'}`);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to send email. Please try again.');
  }
}

// Show error
function showError(message) {
  const result = document.getElementById('trackResult');
  result.classList.remove('hidden');
  result.innerHTML = `
    <div style="background: #fee2e2; border: 2px solid #dc2626; border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem; text-align: center;">
      <p style="color: #991b1b; margin: 0; font-weight: 600;">❌ ${message}</p>
    </div>
  `;
}

// Show success notification
function showSuccessNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; animation: slideIn 0.3s ease;';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 4000);
}

// Go home
function goHome() {
  window.location.href = 'home.html';
}
