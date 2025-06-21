# Car Service Backend

## Deployment on Render

### Prerequisites
1. MongoDB Atlas account and database
2. Render account

### Environment Variables Required
Set these in your Render dashboard:

- `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/database`)
- `NODE_ENV`: Set to `production`

### Render Configuration
1. **Build Command**: Leave empty (not needed for Node.js)
2. **Start Command**: `npm start`
3. **Root Directory**: Leave as default (should be the backend folder)

### Health Check
The server includes a health check endpoint at `/` that returns:
```json
{
  "message": "Car Service Backend is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### API Endpoints
- `GET /` - Health check
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/garages/register` - Register garage
- `GET /api/garages/nearby` - Get all garages
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:garageId` - Get garage bookings
- `PUT /api/bookings/status/:id` - Update booking status

### Troubleshooting
1. Check Render logs for any error messages
2. Ensure MongoDB connection string is correct
3. Verify all environment variables are set
4. Check if the service is starting on the correct port 