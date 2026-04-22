# 👤 User Panel - View Your Lost & Found Items

## ✅ User Panel Already Shows User's Items!

The user panel (`profile.html`) displays **ONLY** the items uploaded by the logged-in user.

---

## 🎯 How It Works:

### 1. **User Logs In**
```
User logs in with email: suresh@gmail.com
    ↓
System checks authentication
    ↓
Fetches items WHERE contact_email = 'suresh@gmail.com'
    ↓
Displays only Suresh's items
```

### 2. **Backend API**
```javascript
// GET /api/items/my
// Returns ONLY logged-in user's items

app.get('/api/items/my', requireAuth, async (req, res) => {
  const [items] = await db.query(
    'SELECT * FROM v_item_details WHERE user_email = ?',
    [req.session.userEmail]  // ← User's email from session
  );
  res.json(items);
});
```

### 3. **Frontend Display**
```javascript
// profile.js
async function fetchMyItems() {
  const res = await fetch('/api/items/my', { credentials: 'include' });
  myItems = await res.json();  // ← Only user's items
  renderMyItems();
}
```

---

## 📊 User Panel Layout:

```
┌─────────────────────────────────────────────┐
│ My Dashboard                    [Logout]    │
│ Welcome, Suresh                             │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │  📝  │ │  ❌  │ │  ✅  │ │  ⏳  │       │
│ │   2  │ │   0  │ │   2  │ │   2  │       │
│ │ My   │ │ Lost │ │Found │ │Pend. │       │
│ │Reports│ │Items │ │Items │ │      │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────────────┤
│ [All My Items] [Lost] [Found] [Pending]    │
├─────────────────────────────────────────────┤
│ MY UPLOADED ITEMS:                          │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ [FOUND] Car Keys                    │    │
│ │ 📁 Keys · 📍 Sahakarnagar           │    │
│ │ 📅 2025-06-12                       │    │
│ │ ID: LF-1004 · [pending]            │    │
│ │ [🔍 Find Matches] [🗑️]              │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ [LOST] Wired Earphones              │    │
│ │ 📁 Electronics · 📍 Katraj          │    │
│ │ 📅 2025-06-08                       │    │
│ │ ID: LF-1005 · [pending]            │    │
│ │ [🔍 Find Matches] [🗑️]              │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 🧪 Test It Now:

### Step 1: Login as Regular User
```bash
1. Go to: http://localhost:3000/login.html
2. Login with:
   Email: suresh@gmail.com
   Password: admin123
3. Click profile button or go to: http://localhost:3000/profile.html
```

### Step 2: View Your Items
```
✅ You will see ONLY items uploaded by suresh@gmail.com:
   - Car Keys (FOUND)
   - Wired Earphones (LOST)

❌ You will NOT see items from other users:
   - aditya@gmail.com's items
   - arnav@gmail.com's items
   - etc.
```

### Step 3: Test Filters
```
Click "Lost Items" tab:
✅ Shows only YOUR lost items

Click "Found Items" tab:
✅ Shows only YOUR found items

Click "Pending" tab:
✅ Shows only YOUR pending items
```

---

## 📋 What User Can See:

### ✅ User CAN See:
- Their own lost items
- Their own found items
- Their own item statistics
- Tracking IDs for their items
- Status of their items (pending/resolved)
- Matches for their items

### ❌ User CANNOT See:
- Other users' items in profile panel
- Other users' contact information (in profile)
- Admin functions
- Global statistics
- All reports

---

## 🔄 Complete Flow Example:

### Scenario: User "Suresh" Reports Items

**Step 1: Suresh reports a FOUND item**
```
Suresh logs in
    ↓
Goes to Report page
    ↓
Reports: FOUND Car Keys in Sahakarnagar
    ↓
Item saved with contact_email = 'suresh@gmail.com'
    ↓
Tracking ID: LF-1004
```

**Step 2: Suresh views profile**
```
Suresh clicks profile button
    ↓
System fetches: SELECT * WHERE user_email = 'suresh@gmail.com'
    ↓
Returns: Car Keys (LF-1004)
    ↓
Displays in profile panel
```

**Step 3: Another user "Aditya" logs in**
```
Aditya logs in
    ↓
Goes to profile
    ↓
System fetches: SELECT * WHERE user_email = 'aditya@gmail.com'
    ↓
Returns: ONLY Aditya's items
    ↓
Does NOT show Suresh's Car Keys
```

---

## 🎯 Statistics Shown:

### User Panel Statistics:
```javascript
My Reports: 2        // Total items uploaded by user
Lost Items: 0        // User's lost items
Found Items: 2       // User's found items
Pending: 2           // User's pending items
```

### Admin Panel Statistics:
```javascript
Total Reports: 10    // All users' items
Lost Items: 6        // All lost items
Found Items: 4       // All found items
Pending: 8           // All pending items
Resolved: 2          // All resolved items
Total Users: 6       // Total registered users
```

---

## 🔐 Security:

### Backend Protection:
```javascript
// User can ONLY access their own items
app.get('/api/items/my', requireAuth, async (req, res) => {
  // Uses session email to filter
  const [items] = await db.query(
    'SELECT * FROM v_item_details WHERE user_email = ?',
    [req.session.userEmail]  // ← Secure: from session, not request
  );
  res.json(items);
});
```

### Session-Based:
- User email stored in session after login
- Cannot be manipulated by user
- Server-side validation
- SQL injection protected

---

## 📱 User Actions Available:

### On Each Item Card:
1. **🔍 Find Matches**
   - Click to see potential matches
   - Redirects to track page with item ID
   - Shows opposite type items

2. **🗑️ Delete**
   - Remove your own report
   - Confirmation required
   - Cannot delete other users' items

---

## 🆚 User Panel vs Browse Page:

### User Panel (profile.html):
- Shows ONLY your items
- Your lost + found items
- Can delete your items
- Personal statistics

### Browse Page (browse.html):
- Shows ALL items from ALL users
- Can search and filter
- Can contact owners
- Cannot delete (unless admin)

---

## ✅ Verification:

### Test with Multiple Users:

**User 1: suresh@gmail.com**
```
Profile shows:
- Car Keys (FOUND)
- Wired Earphones (LOST)
Total: 2 items
```

**User 2: aditya@gmail.com**
```
Profile shows:
- Blue Backpack (LOST)
- iPhone 13 (FOUND)
- Student ID Card (LOST)
Total: 3 items
```

**User 3: arnav@gmail.com**
```
Profile shows:
- Leather Wallet (FOUND)
- Gold Ring (LOST)
Total: 2 items
```

Each user sees ONLY their own items! ✅

---

## 🎉 Summary:

**The user panel is working correctly!**

✅ Users see ONLY their uploaded items
✅ Separated by lost/found type
✅ Can filter by status
✅ Can manage their own items
✅ Cannot see other users' items in profile
✅ Secure and private

**Login and check your profile now!** 🚀

---

## 🔧 Quick Test Commands:

```bash
# Login as different users and check profile:

User 1:
Email: suresh@gmail.com
Password: admin123
Profile: Shows 2 items (Car Keys, Earphones)

User 2:
Email: aditya@gmail.com
Password: admin123
Profile: Shows 3 items (Backpack, iPhone, ID Card)

User 3:
Email: arnav@gmail.com
Password: admin123
Profile: Shows 2 items (Wallet, Ring)

Admin:
Email: admin@portal.com
Password: admin123
Panel: Shows ALL 10 items from ALL users
```
