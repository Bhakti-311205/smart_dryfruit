# Smart Dryfruit - Setup Instructions

## Environment Configuration

### Backend Setup

1. Navigate to the `backend` directory
2. Create a `.env` file (copy from `.env.example` if available) with the following variables:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_dryfruit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important:** 
- Replace `JWT_SECRET` with a strong, random string for production
- Update `MONGODB_URI` if your MongoDB is hosted elsewhere

### Frontend Setup

1. Navigate to the `frontend` directory
2. Create a `.env` file with the following variables:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

**Note:** For production, update `REACT_APP_API_URL` to your production API URL.

## Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Security Improvements Made

✅ JWT secret moved to environment variables
✅ MongoDB connection string moved to environment variables
✅ API URL moved to environment variables
✅ Error handling middleware added
✅ Input validation added to auth routes
✅ Backend `.gitignore` created

## Default Configuration

If `.env` files are not present, the application will use these defaults:
- Backend PORT: 8000
- MongoDB URI: mongodb://127.0.0.1:27017/smart_dryfruit
- JWT Secret: secretkey123 (⚠️ Change this!)
- Frontend API URL: http://localhost:8000/api

**Warning:** Always use proper environment variables in production!
