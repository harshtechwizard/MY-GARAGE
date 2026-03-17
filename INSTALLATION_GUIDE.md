# Installation Guide - Secure Car Service App

## 🚀 Quick Setup Guide

Follow these steps to get the secure version of the Car Service app running.

---

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

---

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including security dependencies:
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- helmet (security headers)
- express-rate-limit (rate limiting)
- express-validator (input validation)
- express-mongo-sanitize (injection prevention)
- xss-clean (XSS prevention)

---

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Edit `.env` file with your values:
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/carServiceDB?retryWrites=true&w=majority

# JWT Configuration (use the generated secret from step 2)
JWT_SECRET=your-generated-secure-random-string-here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# CORS - Allowed Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500

# Server Port
PORT=5000
```

**Important**: 
- Replace `MONGO_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with the generated secret from step 2
- Never commit the `.env` file to Git

---

## Step 3: Start the Backend Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
Starting server...
Environment: development
Port: 5000
Connected to MongoDB
Server running on port 5000
```

---

## Step 4: Test the Backend

### Test Health Check:
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "Car Service Backend is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "healthy"
}
```

### Test User Registration:
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Test User Login:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

---

## Step 5: Open the Frontend

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Open `index.html` in your browser:
   - Double-click the file, or
   - Use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 5500
   
   # Using Node.js http-server
   npx http-server -p 5500
   ```

3. Visit `http://localhost:5500` in your browser

---

## Step 6: Test the Complete Flow

1. **Register a User**:
   - Go to Login page
   - Enter name, email, and password
   - Password must have: uppercase, lowercase, and number
   - Click "Sign In"

2. **Register a Garage**:
   - Go to Register Garage page
   - Fill in garage details
   - Add services (comma-separated)
   - Click "Register Now"

3. **Book a Service**:
   - Go to Book Service page
   - Fill in booking details
   - Use a valid garage ID
   - Click "Confirm Booking"

4. **View Dashboard**:
   - Go to Garage Dashboard
   - Select a garage
   - Click "Load Bookings"
   - View statistics and bookings

---

## Troubleshooting

### Issue: "MONGO_URI environment variable is required!"
**Solution**: Make sure you created the `.env` file and added your MongoDB connection string.

### Issue: "JWT_SECRET environment variable is required!"
**Solution**: Add `JWT_SECRET` to your `.env` file with a secure random string.

### Issue: "Connection refused" or "ECONNREFUSED"
**Solution**: 
1. Make sure MongoDB is running
2. Check your MongoDB connection string
3. Verify your IP is whitelisted in MongoDB Atlas

### Issue: "Validation failed" errors
**Solution**: Check that your input meets the requirements:
- Email must be valid format
- Password must be at least 6 characters with uppercase, lowercase, and number
- All required fields must be filled

### Issue: "Too many requests"
**Solution**: You've hit the rate limit. Wait 15 minutes or restart the server.

### Issue: CORS errors in browser
**Solution**: 
1. Make sure backend is running
2. Check `ALLOWED_ORIGINS` in `.env`
3. Add your frontend URL to `ALLOWED_ORIGINS`

---

## Verifying Security Features

### 1. Check Password Hashing
- Register a user
- Check MongoDB database
- Password should be a bcrypt hash (starts with `$2a$` or `$2b$`)
- NOT plain text

### 2. Check JWT Authentication
- Login to get a token
- Try accessing `/api/users/profile` without token → Should fail (401)
- Try with token → Should succeed (200)

### 3. Check Input Validation
- Try registering with invalid email → Should fail with validation error
- Try weak password → Should fail with validation error
- Try empty fields → Should fail with validation error

### 4. Check Rate Limiting
- Make 6 rapid login attempts
- 6th attempt should be blocked with 429 status

---

## Development vs Production

### Development Mode:
- Detailed error messages
- Stack traces visible
- CORS allows localhost
- Logs everything

### Production Mode:
Set in `.env`:
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-actual-domain.com
```

Changes:
- Generic error messages
- No stack traces
- CORS restricted to specific domains
- Minimal logging

---

## Next Steps

1. **Customize the App**:
   - Update branding in frontend
   - Add more features
   - Customize styling

2. **Deploy to Production**:
   - See `backend/README.md` for deployment guide
   - Use Render, Heroku, or similar platform
   - Enable HTTPS
   - Set production environment variables

3. **Monitor and Maintain**:
   - Run `npm audit` regularly
   - Update dependencies
   - Monitor logs
   - Backup database

---

## Useful Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm start               # Start production server
npm run dev             # Start development server
npm audit               # Check for vulnerabilities
npm audit fix           # Fix vulnerabilities
npm update              # Update dependencies

# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test API
curl http://localhost:5000/
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"SecurePass123"}'
```

---

## Documentation

- `backend/README.md` - Backend documentation
- `backend/SECURITY.md` - Security documentation
- `frontend/README.md` - Frontend documentation
- `SECURITY_FIXES_SUMMARY.md` - Security fixes summary

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check backend logs for errors
4. Verify environment variables are set correctly
5. Create an issue on GitHub

---

## Success Checklist

- [ ] Backend dependencies installed
- [ ] `.env` file created and configured
- [ ] JWT_SECRET generated and added
- [ ] MongoDB connection working
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] User registration works
- [ ] User login works and returns token
- [ ] Frontend opens in browser
- [ ] Can register users through UI
- [ ] Can register garages through UI
- [ ] Can create bookings through UI
- [ ] Dashboard loads and displays data

---

**You're all set! The secure Car Service app is ready to use.** 🎉

For production deployment, see the deployment section in `backend/README.md`.
