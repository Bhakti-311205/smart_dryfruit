# How to Create Staff Users

## Problem
Staff users were not appearing in the database because:
1. Public registration only creates customers
2. No admin interface to create staff/admin users
3. Missing validation and logging

## Solutions Implemented

### 1. Admin Interface to Create Users
- **Route**: `/admin/users` (Admin only)
- **Features**:
  - View all users
  - Create new users (customer, staff, or admin)
  - See user roles and creation dates

### 2. Seed Script for Default Users
Run this to create default admin and staff users:
```bash
cd backend
node seedUsers.js
```

This creates:
- **Admin**: admin@dryfruit.com / admin123
- **Staff**: staff@dryfruit.com / admin123
- **Customer**: customer@test.com / admin123

### 3. Enhanced Registration
- Public registration now only creates customers
- Staff and admin must be created by admin
- Better logging and validation

## How to Create Staff Users

### Method 1: Using Admin Interface (Recommended)
1. Login as admin
2. Go to Admin Dashboard
3. Click "Manage Users"
4. Click "Add User"
5. Fill in:
   - Name
   - Email
   - Password
   - Role: Select "Staff" or "Admin"
6. Click "Create User"

### Method 2: Using Seed Script
```bash
cd backend
node seedUsers.js
```

### Method 3: Using API (For testing)
```bash
# Login as admin first, get token
# Then create user:
curl -X POST http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Staff Name",
    "email": "staff@example.com",
    "password": "password123",
    "role": "staff"
  }'
```

## Verify Users in Database

### Method 1: Test Script
```bash
cd backend
node test-users.js
```

This will show:
- Total user count
- All users with their roles
- Count by role (admin, staff, customer)

### Method 2: MongoDB Compass
1. Connect to: `mongodb://127.0.0.1:27017`
2. Select database: `smart_dryfruit`
3. Open collection: `users`
4. Check users and their roles

### Method 3: MongoDB Shell
```bash
mongosh
use smart_dryfruit
db.users.find().pretty()
db.users.find({ role: "staff" }).pretty()
```

## Quick Start

1. **Create default users**:
   ```bash
   cd backend
   node seedUsers.js
   ```

2. **Login as admin**:
   - Email: admin@dryfruit.com
   - Password: admin123

3. **Create more staff users**:
   - Go to Admin Dashboard → Manage Users
   - Click "Add User"
   - Select role: "Staff"

4. **Verify users**:
   ```bash
   cd backend
   node test-users.js
   ```

## API Endpoints

### Create User (Admin Only)
```
POST /api/admin/users
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "staff" | "admin" | "customer"
}
```

### Get All Users (Admin Only)
```
GET /api/admin/users
Headers: Authorization: Bearer <admin_token>
```

## Fixed Issues

✅ Public registration restricted to customers only
✅ Admin can create staff/admin users
✅ Better validation and error handling
✅ Comprehensive logging
✅ Test scripts to verify users
✅ Admin UI for user management

## Troubleshooting

**Issue: "User already exists"**
- Solution: Use different email or check existing users

**Issue: "Invalid role"**
- Solution: Role must be "admin", "staff", or "customer"

**Issue: Users not showing in database**
- Solution: Run `node test-users.js` to verify
- Check MongoDB connection
- Check backend console for errors

**Issue: Can't create staff via registration**
- Solution: This is by design. Use admin interface or seed script
