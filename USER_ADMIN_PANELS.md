# 👥 User & Admin Panels

## ✅ Separate Dashboards Implemented!

Users now have their own dashboard showing only their reports, while admins can see and manage all reports.

---

## 🎯 Two Types of Panels:

### 1. **User Panel** (`profile.html`)
- Shows only user's own reports
- Cannot see other users' reports
- Can delete own reports
- Can find matches for own items
- View personal statistics

### 2. **Admin Panel** (`admin.html`)
- Shows ALL reports from ALL users
- Can update status (pending/resolved)
- Can delete any report
- View global statistics
- Manage entire system

---

## 📊 User Dashboard Features:

### Access:
- URL: `http://localhost:3000/profile.html`
- Login required
- Redirects to login if not authenticated

### Statistics Shown:
- 📝 My Reports (total)
- ❌ Lost Items (my lost items)
- ✅ Found Items (my found items)
- ⏳ Pending (my pending items)

### Filter Tabs:
- All My Items
- Lost Items
- Found Items  
- Pending
- Resolved

### Actions Available:
- 🔍 Find Matches - View potential matches
- 🗑️ Delete - Remove own report
- 🚪 Logout

---

## 🛡️ Admin Dashboard Features:

### Access:
- URL: `http://localhost:3000/admin.html`
- Admin login required
- Redirects regular users to profile.html

### Statistics Shown:
- 📊 Total Reports (all users)
- ❌ Lost Items (all)
- ✅ Found Items (all)
- ⏳ Pending (all)
- 🎉 Resolved (all)
- 👥 Total Users

### Search & Filters:
- Search by name, location, tracking ID
- Filter by category
- Filter by type (lost/found)
- Filter by status (pending/resolved)

### Actions Available:
- ✅ Mark Resolved - Change status to resolved
- ⏳ Mark Pending - Change status back to pending
- 🗑️ Delete - Remove any report
- 🚪 Logout

---

## 🔐 Authentication Flow:

```
User logs in
    ↓
Check role
    ↓
    ├─→ Regular User → profile.html (own reports only)
    │
    └─→ Admin → admin.html (all reports)
```

---

## 🧪 Test the Feature:

### Test 1: Regular User Login
1. Go to: `http://localhost:3000/login.html`
2. Register a new account or login with:
   - Email: `suresh@gmail.com`
   - Password: `admin123`
3. ✅ Redirected to `profile.html`
4. ✅ See only your own reports

### Test 2: Admin Login
1. Go to: `http://localhost:3000/login.html`
2. Login with admin credentials:
   - Email: `admin@portal.com`
   - Password: `admin123`
3. ✅ Redirected to `admin.html`
4. ✅ See ALL reports from ALL users

### Test 3: Report Item as User
1. Login as regular user
2. Go to Report page
3. Submit a report
4. Go to Profile
5. ✅ See your new report in dashboard

### Test 4: Admin Management
1. Login as admin
2. Go to Admin panel
3. Search for any item
4. Click "Mark Resolved"
5. ✅ Status updated
6. Click "Delete"
7. ✅ Item removed

---

## 📱 User Panel Layout:

```
┌─────────────────────────────────────────────┐
│ My Dashboard                    [Logout]    │
│ Welcome, John Doe                           │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │  📝  │ │  ❌  │ │  ✅  │ │  ⏳  │       │
│ │   5  │ │   3  │ │   2  │ │   4  │       │
│ │ My   │ │ Lost │ │Found │ │Pend. │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────────────┤
│ [All] [Lost] [Found] [Pending] [Resolved]  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐    │
│ │ [LOST] iPhone 13                    │    │
│ │ 📁 Phone · 📍 Library               │    │
│ │ ID: LF-1001 · [pending]            │    │
│ │ [🔍 Find Matches] [🗑️]              │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 🛡️ Admin Panel Layout:

```
┌─────────────────────────────────────────────┐
│ 🛡️ Admin Dashboard              [Logout]    │
│ Welcome, Admin User                         │
├─────────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│ │ 📊 │ │ ❌ │ │ ✅ │ │ ⏳ │ │ 🎉 │ │ 👥 │ │
│ │ 10 │ │ 6  │ │ 4  │ │ 8  │ │ 2  │ │ 6  │ │
│ │Tot.│ │Lost│ │Fnd.│ │Pen.│ │Res.│ │Usr.│ │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ │
├─────────────────────────────────────────────┤
│ [Search...] [Category▼] [Type▼] [Status▼] │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐    │
│ │ [LOST] iPhone 13                    │    │
│ │ 📁 Phone · 📍 Library               │    │
│ │ ✉️ user@example.com                 │    │
│ │ ID: LF-1001 · [pending]            │    │
│ │ [✅ Mark Resolved] [🗑️]             │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 🔒 Security Features:

### User Panel:
- ✅ Can only see own reports
- ✅ Can only delete own reports
- ✅ Cannot access admin functions
- ✅ Session-based authentication

### Admin Panel:
- ✅ Can see all reports
- ✅ Can manage any report
- ✅ Can update status
- ✅ Can delete any report
- ✅ Role-based access control

---

## 🔄 API Endpoints:

### User-Specific:
```
GET /api/items/my
- Returns only logged-in user's items
- Requires authentication
```

### Admin-Only:
```
GET /api/users/count
- Returns total user count
- Requires admin role

PATCH /api/items/:trackingId/status
- Update item status
- Requires admin role

DELETE /api/items/:trackingId
- Delete any item
- Requires admin role or item owner
```

---

## 📊 Database Queries:

### User Items:
```sql
SELECT * FROM v_item_details 
WHERE user_email = 'user@example.com'
ORDER BY item_date DESC
```

### All Items (Admin):
```sql
SELECT * FROM v_item_details
ORDER BY item_date DESC
```

---

## 🎯 Key Differences:

| Feature | User Panel | Admin Panel |
|---------|-----------|-------------|
| **View Reports** | Own only | All users |
| **Delete Reports** | Own only | Any report |
| **Update Status** | ❌ No | ✅ Yes |
| **Statistics** | Personal | Global |
| **User Count** | ❌ No | ✅ Yes |
| **Search/Filter** | Own items | All items |

---

## 🎉 Success!

**Users now have separate dashboards:**
- ✅ Regular users see only their reports
- ✅ Admins see and manage all reports
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ Clean separation of concerns

**Login and test both panels now!** 🚀
