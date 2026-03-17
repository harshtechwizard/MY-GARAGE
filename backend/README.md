# Car Service Backend - Secure API

A secure, enterprise-grade REST API for car service booking and management.

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ XSS protection
- ✅ NoSQL injection prevention
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Role-based access control

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-random-string-min-32-chars
NODE_ENV=development
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### User Routes

**Register User**
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Login User**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Get User Profile** (Protected)
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Garage Routes

**Register Garage**
```http
POST /api/garages/register
Content-Type: application/json

{
  "name": "AutoCare Center",
  "location": "New York, NY",
  "email": "garage@example.com",
  "password": "SecurePass123",
  "services": ["Oil Change", "Brake Repair", "Engine Diagnostics"]
}
```

**Login Garage**
```http
POST /api/garages/login
Content-Type: application/json

{
  "email": "garage@example.com",
  "password": "SecurePass123"
}
```

**Get Nearby Garages**
```http
GET /api/garages/nearby
```

**Get Garage Profile** (Protected)
```http
GET /api/garages/profile
Authorization: Bearer <token>
```

#### Booking Routes

**Create Booking**
```http
POST /api/bookings
Content-Type: application/json

{
  "userName": "John Doe",
  "phone": "+1234567890",
  "service": "Oil Change",
  "garageId": "garage-mongodb-id"
}
```

**Get Garage Bookings**
```http
GET /api/bookings/:garageId
```

**Update Booking Status** (Protected - Garage only)
```http
PUT /api/bookings/status/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Get User Bookings** (Protected - User only)
```http
GET /api/bookings/user/my-bookings
Authorization: Bearer <token>
```

**Delete Booking** (Protected)
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Rate Limits

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes

## 🗄️ Database Schema

### User
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date
}
```

### Garage
```javascript
{
  name: String (required, 2-100 chars),
  location: String (required, 2-200 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  services: [String] (required, min 1 service),
  createdAt: Date
}
```

### Booking
```javascript
{
  userName: String (required, 2-100 chars),
  phone: String (required, valid format),
  service: String (required, 5-500 chars),
  garageId: ObjectId (required, ref: Garage),
  status: String (enum: pending, confirmed, in-progress, completed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Development

### Project Structure
```
backend/
├── controllers/       # Request handlers
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
│   ├── auth.js      # Authentication
│   └── validation.js # Input validation
├── .env             # Environment variables (not in git)
├── .env.example     # Environment template
├── .gitignore       # Git ignore rules
├── server.js        # Entry point
├── package.json     # Dependencies
├── SECURITY.md      # Security documentation
└── README.md        # This file
```

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `helmet` - Security headers
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `express-mongo-sanitize` - NoSQL injection prevention
- `xss-clean` - XSS prevention
- `dotenv` - Environment variables

## 🔐 Security

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Best Practices
1. Never commit `.env` file
2. Use strong JWT secrets (min 32 characters)
3. Enable HTTPS in production
4. Keep dependencies updated
5. Run `npm audit` regularly
6. Use environment variables for secrets
7. Implement proper logging
8. Regular database backups

## 🚀 Deployment on Render

### Prerequisites
1. MongoDB Atlas account and database
2. Render account

### Environment Variables Required
Set these in your Render dashboard:

- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secure random string (min 32 chars)
- `JWT_EXPIRES_IN`: Token expiration (e.g., "7d")
- `NODE_ENV`: Set to `production`
- `ALLOWED_ORIGINS`: Your frontend URL (e.g., "https://your-app.com")

### Render Configuration
1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Root Directory**: `backend` (if in monorepo)

### Health Check
The server includes a health check endpoint at `/` that returns:
```json
{
  "message": "Car Service Backend is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "healthy"
}
```

### Deployment Checklist
- [ ] Set all environment variables in Render
- [ ] Use secure JWT_SECRET (generate with crypto)
- [ ] Configure ALLOWED_ORIGINS with your frontend domain
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB IP whitelist (add Render IPs)
- [ ] Test all endpoints after deployment
- [ ] Monitor logs for errors
- [ ] Set up automatic deployments from GitHub

### Troubleshooting
1. Check Render logs for error messages
2. Verify MongoDB connection string is correct
3. Ensure all environment variables are set
4. Check MongoDB Atlas IP whitelist
5. Verify JWT_SECRET is set
6. Test health check endpoint first

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@yourcompany.com

---

**Built with security and best practices in mind** 🔒
