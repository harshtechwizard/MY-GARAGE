# API Key Setup Guide

To connect the external services to our React app and Node backend, we need some API keys. Don't worry, all of these have completely free tiers! Follow these steps and save the keys in your `.env` files.

> [!IMPORTANT]
> Once you have gathered these keys, we will put them in a `.env` file in the `frontend` folder and the `backend` folder. **Do not share these keys publicly.**

---

## 1. Firebase (Authentication)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it something like `autocare-pro`.
3. You can disable Google Analytics for this project. Click **"Create Project"**.
4. Inside your new project, click the **Web icon (`</>`)** to add a web app. Register the app with a name.
5. Firebase will show you a block of code with `firebaseConfig`. We need these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
6. Click **"Continue to console"**.
7. In the left menu, click **"Authentication"** -> **"Get Started"**.
8. Go to the **"Sign-in method"** tab, enable **Email/Password**, and click Save.

---

## 2. Appwrite (File Storage)
1. Go to [Appwrite Cloud](https://cloud.appwrite.io/register) and create a free account.
2. Click **"Create project"** and name it `AutoCare Storage`.
3. In your project dashboard, note down the **Project ID** (found in Settings or at the top).
4. Go to **"Storage"** in the left menu and click **"Create bucket"**. Name it `Garages` and click Create.
5. Note down the **Bucket ID**.
6. (Important) Go to the **Settings** of your new Bucket, and under **Permissions**, add the `Any` role and check all boxes (Create, Read, Update, Delete) so we can easily test file uploads without complex rules.

---

## 3. Google Maps API (Location)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (name it `AutoCare Maps`).
3. Open the navigation menu (hamburger icon) -> **"APIs & Services"** -> **"Library"**.
4. Search for **"Maps JavaScript API"** and click **Enable**.
5. Go to **"APIs & Services"** -> **"Credentials"**.
6. Click **"Create Credentials"** -> **"API key"**.
7. Copy the generated **API Key**.

---

## 4. Razorpay (Payments)
1. Go to [Razorpay](https://dashboard.razorpay.com/signup) and sign up for an account.
2. Log in to the dashboard and ensure you are in **"Test Mode"** (usually a toggle switch at the top).
3. In the left menu, go to **"Account & Settings"** -> **"API Keys"** (under Website and app settings).
4. Click **"Generate Test Key"**.
5. Copy the **Key Id** and **Key Secret**.

---

## Next Steps

Once you have gathered these keys, let me know! We will put them in `frontend/.env` and `backend/.env` and I will wire them up to the code!
