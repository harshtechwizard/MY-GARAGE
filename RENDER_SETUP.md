# Fix Render Deployment - Environment Variables Missing

## The Problem
Your backend is failing on Render with: `JWT_SECRET environment variable is required!`

## The Solution
Add these environment variables in your Render dashboard:

### Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your service: `my-garage-backend-na1w`
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**

### Add These Variables:

**MONGO_URI**
```
mongodb+srv://tiwariharsh30200:2S4I46jzDVCU2Liq@cluster0.jtvaibc.mongodb.net/carServiceDB?retryWrites=true&w=majority&appName=Cluster0
```

**JWT_SECRET**
```
846d6e00cb8b5857921efd711a8dcd6debcc8efee8e0d3729cbd893bb381a531
```

**JWT_EXPIRES_IN**
```
7d
```

**NODE_ENV**
```
production
```

**ALLOWED_ORIGINS**
```
https://your-frontend-domain.com,http://localhost:5500
```

### Save and Wait
1. Click **"Save Changes"**
2. Render will auto-redeploy (takes 1-2 minutes)
3. Check the **Logs** tab - you should see "Server running on port..."

### Test It
Visit: https://my-garage-backend-na1w.onrender.com/

Should show: `{"message":"Car Service Backend is running!","status":"healthy"}`

Then try your garage login page again!
