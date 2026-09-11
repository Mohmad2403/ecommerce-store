# 🛒 E-Commerce Web Application

A full-featured, modern E-Commerce web application built with **Django REST Framework** (Backend) and **React 19 + Vite** (Frontend). It features secure JWT authentication, Razorpay online payment integration, real-time email notifications, interactive admin analytics, and product/order management.

---

## 🚀 Features

### 🛍️ Customer Features
- **User Authentication**: Secure user registration, login, and JWT-based authentication.
- **Product Catalog**: Dynamic product listings with category filtering, real-time search, sorting, and pagination.
- **Product Details**: Detailed view including image galleries, stock availability, pricing, and descriptions.
- **Shopping Cart**: Add to cart, quantity update, item removal, and subtotal/total calculations.
- **Wishlist**: Save favorite items for quick access later.
- **Razorpay Checkout**: Seamless online payment processing via Razorpay gateway.
- **Order Management**: Order placement, order history, detailed invoice views, and real-time status tracking.
- **Email Notifications**: Automated email updates upon order placement using SMTP.
- **User Profile**: Manage personal user details and address information.

### 🛡️ Admin Dashboard
- **Analytics & Statistics**: Interactive revenue, order, and sales charts powered by Recharts.
- **Product Management**: Full CRUD operations for products (image upload, stock, category assignment, price).
- **Category Management**: Create and manage product categories.
- **Order Administration**: Track and update order statuses (Pending, Processing, Shipped, Delivered, Cancelled).

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Python 3.x, Django 6.0, Django REST Framework (DRF)
- **Authentication**: Simple JWT (`djangorestframework-simplejwt`)
- **Database**: MySQL (`mysqlclient`)
- **Payment Gateway**: Razorpay Python SDK (`razorpay`)
- **Email Service**: Django SMTP (Gmail Integration)
- **Environment Management**: `python-decouple`
- **CORS**: `django-cors-headers`

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router DOM v7
- **UI & Styling**: Bootstrap 5, Bootstrap Icons
- **HTTP Client**: Axios (with Request Interceptors for JWT authorization)
- **Charts / Analytics**: Recharts
- **Toast Notifications**: React Toastify

---

## 📁 Project Structure

```text
ecoomerce website/
├── backend/                  # Django REST API Backend
│   ├── accounts/             # User Auth & Custom User Model
│   ├── cart/                 # Cart logic & APIs
│   ├── categories/           # Category models & views
│   ├── ecommerce_backend/    # Django Project Settings & Root URLs
│   ├── media/                # Product & Category Uploaded Images
│   ├── orders/               # Order creation & Razorpay verification
│   ├── products/             # Product models & views
│   ├── wishlist/             # Wishlist management
│   ├── .env                  # Backend Environment Variables (Git ignored)
│   ├── .env.example          # Sample Environment File
│   ├── manage.py             # Django CLI Tool
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Shared UI Components (Navbar, Footer, etc.)
│   │   ├── context/          # React Contexts (AuthContext, CartContext)
│   │   ├── pages/            # Page Views (Home, Products, Admin, etc.)
│   │   ├── services/         # Axios API instance and endpoints
│   │   ├── App.jsx           # Main App Routes & Layout
│   │   └── main.jsx          # App Entrypoint
│   ├── .env.example          # Sample Frontend Environment File
│   ├── package.json          # Frontend Dependencies & Scripts
│   └── vite.config.js        # Vite Configuration
│
└── README.md                 # Project Documentation
```

---

## ⚙️ Sample Environment Variables

### 🔑 Backend Environment (`backend/.env`)

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```env
# Razorpay API Credentials (Obtain from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email SMTP Credentials (for sending order confirmation emails)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
```

### 🌐 Frontend Environment (`frontend/.env`)

Create a `.env` file in the `frontend/` directory based on `frontend/.env.example`:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

---

## 🚀 Getting Started & How to Run

### 📋 Prerequisites
Make sure you have installed on your machine:
- **Python**: 3.10+
- **Node.js**: 18+ & npm
- **MySQL Database Server**: Running locally or remotely (e.g. MySQL Workbench / XAMPP)

---

### 1️⃣ Database Setup (MySQL)

Create a MySQL database named `ecommerce_backend_db`:

```sql
CREATE DATABASE ecommerce_backend_db;
```

> **Note**: Verify database credentials (`USER`, `PASSWORD`, `HOST`, `PORT`) in `backend/ecommerce_backend/settings.py` match your local MySQL configuration.

---

### 2️⃣ Backend Setup (Django REST Framework)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create the `.env` file in the `backend/` directory:
   ```bash
   cp .env.example .env
   # Edit .env and enter your Razorpay keys and Gmail App Password
   ```

5. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create an Administrator / Superuser account:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run at `http://127.0.0.1:8000/`.

---

### 3️⃣ Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file in the `frontend/` directory:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173/`.

---

## 📡 API Endpoints Summary

| Module | Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/accounts/register/` | `POST` | Register new user account | No |
| **Auth** | `/api/accounts/login/` | `POST` | User login & retrieve JWT tokens | No |
| **Auth** | `/api/accounts/token/refresh/` | `POST` | Refresh access token | No |
| **Products** | `/api/products/` | `GET` | Get all products (supports search/filter) | No |
| **Products** | `/api/products/<id>/` | `GET` | Get detailed product info | No |
| **Categories**| `/api/categories/` | `GET` | List product categories | No |
| **Cart** | `/api/cart/` | `GET` / `POST` | Get user cart / Add item | Yes |
| **Wishlist** | `/api/wishlist/` | `GET` / `POST` | Get user wishlist / Add item | Yes |
| **Orders** | `/api/orders/` | `GET` / `POST` | List user orders / Create new order | Yes |
| **Orders** | `/api/orders/verify-payment/`| `POST` | Razorpay signature verification | Yes |

---

## 🧪 Admin Dashboard Access

1. Register or log in with an account that has `is_staff=True` or `is_superuser=True` (created via `python manage.py createsuperuser`).
2. Access the Admin Dashboard at `http://localhost:5173/admin` (or via the user navigation menu).
3. Use the Django Admin site directly at `http://127.0.0.1:8000/admin/`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
