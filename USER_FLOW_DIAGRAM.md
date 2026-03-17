# AutoCare Pro - Complete User Flow

## 🏠 Homepage (index.html)
```
┌─────────────────────────────────────────┐
│         AutoCare Pro Homepage           │
│                                         │
│  Primary Actions:                       │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Get Started  │  │ Customer Login  │ │
│  │      ↓       │  │       ↓         │ │
│  │  register    │  │    login.html   │ │
│  └──────────────┘  └─────────────────┘ │
│                                         │
│  Quick Access Links:                    │
│  • Customer Sign Up → register.html     │
│  • Customer Login → login.html          │
│  • Register Garage → garage-register    │
│  • Garage Login → garage-login.html     │
└─────────────────────────────────────────┘
```

## 👤 Customer Journey

### Registration Flow
```
register.html (NEW!)
    ↓
[Enter: Name, Email, Password]
    ↓
POST /api/users/register
    ↓
✓ Success
    ↓
Store in localStorage:
  - authToken
  - userType: 'user'
  - userName
    ↓
Auto-redirect → book.html
```

### Login Flow
```
login.html (FIXED)
    ↓
[Enter: Email, Password]
    ↓
POST /api/users/login
    ↓
✓ Success
    ↓
Store in localStorage:
  - authToken
  - userType: 'user'
  - userName
    ↓
Auto-redirect → book.html
```

### Booking Flow
```
book.html (IMPROVED)
    ↓
[Auth Bar: Shows logged-in user]
    ↓
Select Garage from dropdown
  OR
Enter Garage ID manually
    ↓
[Fill: Name (pre-filled), Car Model, Phone, Service]
    ↓
POST /api/bookings
    ↓
✓ Booking Created
    ↓
[Logout Button Available]
```

## 🔧 Garage Journey

### Registration Flow
```
garage-register.html (FIXED)
    ↓
[Enter: Name, Location, Email, Password, Services]
    ↓
POST /api/garages/register
    ↓
✓ Success
    ↓
Store in localStorage:
  - authToken
  - userType: 'garage'
  - garageId
  - garageName
    ↓
Auto-redirect → garage-dashboard.html
```

### Login Flow
```
garage-login.html (NEW!)
    ↓
[Enter: Email, Password]
    ↓
POST /api/garages/login
    ↓
✓ Success
    ↓
Store in localStorage:
  - authToken
  - userType: 'garage'
  - garageId
  - garageName
    ↓
Auto-redirect → garage-dashboard.html
```

### Dashboard Flow
```
garage-dashboard.html (FIXED)
    ↓
[Auth Bar: Shows logged-in garage]
    ↓
Auto-detect logged-in garage
    ↓
Auto-load garage's bookings
    ↓
GET /api/bookings/:garageId
    ↓
Display:
  - Total Bookings
  - Pending Count
  - Completed Count
  - Booking Details Table
    ↓
[Logout Button Available]
```

## 🔐 Authentication System

### localStorage Structure
```javascript
// For Customers
{
  authToken: "jwt_token_here",
  userType: "user",
  userName: "John Doe"
}

// For Garages
{
  authToken: "jwt_token_here",
  userType: "garage",
  garageId: "garage_id_here",
  garageName: "AutoCare Center"
}
```

### Auth Bar (auth-utils.js)
```
┌────────────────────────────────────────┐
│ 👤 Customer John Doe    [🚪 Logout]   │
└────────────────────────────────────────┘
         OR
┌────────────────────────────────────────┐
│ 🔧 Garage AutoCare     [🚪 Logout]    │
└────────────────────────────────────────┘
```

## 🔄 Complete Flow Diagram

```
                    ┌──────────────┐
                    │  Homepage    │
                    └──────┬───────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
      [Customer]                     [Garage]
            │                             │
    ┌───────┴────────┐          ┌────────┴─────────┐
    │                │          │                  │
Register          Login    Register            Login
    │                │          │                  │
    └────────┬───────┘          └────────┬─────────┘
             │                           │
        [Store Token]              [Store Token]
             │                           │
             ↓                           ↓
      ┌──────────┐              ┌──────────────┐
      │   Book   │              │  Dashboard   │
      │ Service  │              │   Manage     │
      └──────────┘              └──────────────┘
             │                           │
        [Logout]                    [Logout]
             │                           │
             └───────────┬───────────────┘
                         ↓
                   ┌──────────┐
                   │ Homepage │
                   └──────────┘
```

## 📊 API Endpoints Used

### Customer Endpoints
- `POST /api/users/register` - Create new customer account
- `POST /api/users/login` - Customer authentication
- `GET /api/users/profile` - Get customer profile (protected)

### Garage Endpoints
- `POST /api/garages/register` - Register new garage
- `POST /api/garages/login` - Garage authentication
- `GET /api/garages/nearby` - List all garages (public)
- `GET /api/garages/profile` - Get garage profile (protected)

### Booking Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:garageId` - Get garage's bookings
- `PUT /api/bookings/status/:id` - Update booking status (garage only)
- `GET /api/bookings/user/my-bookings` - Get user's bookings (user only)
- `DELETE /api/bookings/:id` - Delete booking

## ✅ Key Improvements

1. **Complete Authentication** - Both user types can register and login
2. **Token Persistence** - Sessions maintained across pages
3. **Clear Navigation** - Obvious paths for different user types
4. **Auto-Population** - Forms pre-filled with user data
5. **Visual Feedback** - Auth bar shows login status
6. **Logout Capability** - Users can end sessions
7. **Better UX** - Garage selector instead of manual ID entry
8. **Auto-Loading** - Garages see their bookings automatically

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add booking status updates from garage dashboard
- [ ] Create user dashboard to view booking history
- [ ] Add garage search/filter functionality
- [ ] Implement real-time notifications
- [ ] Add garage ratings and reviews
- [ ] Create admin panel for platform management
