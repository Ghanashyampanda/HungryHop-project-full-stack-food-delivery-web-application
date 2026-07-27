# HungryHop 🍔🏃‍♂️

HungryHop is a full-stack, real-time food delivery web application. The platform supports three core user roles: **Customers**, **Restaurant Owners**, and **Delivery Partners**, providing a seamless flow from food browsing to payment and live delivery tracking.

---

## 🛠️ Technology Stack

### Backend
*   **Runtime:** Node.js (Express 5)
*   **Database:** MongoDB (via Mongoose)
*   **Real-time Communication:** Socket.io (restricted room-based broadcasting)
*   **Storage:** Cloudinary (via Multer) for image hosting
*   **Authentication:** JWT (JSON Web Tokens) with Cookie-Parser
*   **Payments:** Razorpay Integration
*   **Mailing:** Nodemailer (OTP delivery and verification)

### Frontend
*   **Framework:** React 19 (Vite)
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS v4
*   **Maps & Tracking:** Leaflet & React Leaflet
*   **Charts & Visuals:** Recharts (visualizing delivery statistics)
*   **Real-time Client:** Socket.io-client

---

## ✨ Features

*   **Role-Based Dashboards:** Distinct user experiences for Customers, Restaurant Owners, and Delivery Partners.
*   **Live Order Tracking:** Leaflet-powered maps displaying the real-time position of the delivery partner.
*   **Secure Payment Integration:** Integrated with Razorpay checkout for card/UPI/online payments alongside Cash on Delivery (COD).
*   **OTP-Based Secure Delivery:** Customers receive a secure OTP via email that the delivery partner must verify in order to mark the package as delivered.
*   **Restaurant & Menu Management:** Restaurant owners can upload shop details, create, edit, or delete items on their menu.
*   **Delivery Partner Stats:** Interactive earnings charts showing hourly/daily delivery analytics.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=8000
   MONGODB_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   EMAIL="your_nodemailer_gmail"
   PASS="your_gmail_app_password"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   ```
4. **Seed the database** (adds demo users, shops, and items):
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `frontend/.env`:
   ```env
   VITE_FIREBASE_APIKEY="your_firebase_api_key"
   VITE_GEOAPIKEY="your_geoapify_key"
   VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 👥 Demo Logins (Once Seeded)

*   **Customer:** `demo_user@hungryhop.com` (Password: `password123`)
*   **Shop Owner:** `demo_owner@hungryhop.com` (Password: `password123`)
*   **Delivery Partner:** `demo_delivery@hungryhop.com` (Password: `password123`)
