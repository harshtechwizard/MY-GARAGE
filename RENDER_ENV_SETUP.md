# Render Environment Variables Setup

## Issue
Your backend deployment is failing with:
```
JWT_SECRET environment variable is required!
```

This is because Render doesn't have access to your `.env` file (which is gitignored for security).

## Solution: Add Environment Variables on Render

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Find your backend service: `my-garage-backend-na1w`
3. Click on it to open the service details

### Step 2: Add Environment Variables
1. Click on **"Environment"** in the left sidebar
2. Click **"Add Environment Variable"** button
3. Add the following variables one by one:

#### Required Variables:

**1. MONGO_URI**
```
Key: MONGO_URI
Value: mongodb+srv://tiwariharsh30200:2S4I46jzDVCU2Liq@cluster0.jtvaibc.mongodb.net/carServiceDB?retryWrites=true&w=majority&appName=Cluster0
```

**2. JWT_SECRET**
```
Key: JWT_SECRET
Value: 846d6e00cb8b5857921efd711a8dcd6debcc8efee8e0d3729cbd893bb381a531
```

**3. JWT_EXPIRES_IN**
```
Key: JWT_EXPIRES_IN
Value: 7d
```

**4. NODE_ENV**
```
Key: NODE_ENV
Value: production
```

**5. ALLOWED_ORIGINS** (for CORS)
```
Key: ALLOWED_ORIGINS
Value: https://your-frontend-domain.com,http://localhost:5500
```
*Note: Replace `https://your-frontend-domain.com` with your actual frontend URL if deployed*

### Step 3: Save and Redeploy
1. After adding all variables, click **"Save Changes"**
2. Render will automatically redeploy your service
3. Wait for the deployment to complete (usually 1-2 minutes)

### Step 4: Verify Deployment
Once deployed, check the logs:
1. Go to **"Logs"** tab
2. You should see:
   ```
   Starting server...
   Environment: production
   Port: 10000
   Connected to MongoDB
   Server running on port 10000
   ```

### Step 5: Test the API
Open this URL in your browser:
```
https://my-garage-backend-na1w.onrender.com/
```

You should see:
```json
{
  "message": "Car Service Backend is running!",
  "timestamp": "2026-03-18T...",
  "status": "healthy"
}
```

### Step 6: Test Garage Login
Now try your garage login page again. It should work!

## Security Note
⚠️ **IMPORTANT**: The values above contain sensitive credentials. In a real production environment:
1. Use a separate MongoDB cluster for production
2. Generate a new JWT_SECRET for production
3. Never commit `.env` files to Git (already in `.gitignore`)
4. Consider using Render's secret management features

## Troubleshooting

nder! adding them to Reully whenvalues carefse 
Copy the:5500 |
alhost//loc,http:.comntend-domain//your-frops:NS | httD_ORIGIoduction |
| ALLOWEENV | prODE_ Nd |
| 7IN |ES_PIR
| JWT_EX|81a531 b33729cbd893be8e0d6debcc8efe8dcdfd711a7921ed6e00cb8b585ET | 846CR JWT_SEpName=Cluster0 |
|jority&apw=maites=true&WrviceDB?retryet/carSerdb.nngomobc.uster0.jtvaiU2Liq@cl2S4I46jzDVC30200:ariharsh//tiwrv:| mongodb+sURI ONGO_
| M-|-------|
|--------- | Value |leiables

| Variabonment VarAll Envirrence: Quick Refest

## itelis whMongoDB Atlaes to P addresser's Id Rend0)
3. Or ad0.0/where (0.0.ns from anyiolows connectr alas clustengoDB Atlyour Moeck that rect
2. ChorGO_URI is c the MON
1. Verifyils: fa If MongoDB connectiongain

###cache and try awser  bror yourea")
3. Cl on port...runningr "Servehould show g (logs sninver is runt the serheck thafully
2. Csseted succet complhe deploymen t. Make sured":
1e not founout "Rsee you 
### If*
it"*t commloy lates"Dep → **y"**loal Dep"Manu: Click **ployring a redeually triggeTry manues
4. valpaces in the o extra s are ntheresure ake 
3. Mitive)nsase-seorrectly (cled celre spriables aronment vaenvi Verify all es
2.agror mess erfor specifics** tab  **LogCheck thels:
1. faient still f deploym# I
##