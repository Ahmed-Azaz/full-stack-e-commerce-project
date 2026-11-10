# Full-Stack E-Commerce Website

A full-stack e-commerce application built with React and Node.js, featuring user authentication, product browsing, shopping cart management, favorites, and checkout functionality.

## Features

- **User Authentication:** Register and log in using email and password, with JWT-based authentication.
- **Google Sign-In:** Authenticate using Google OAuth.
- **Product Catalog:** Browse products fetched from the DummyJSON API.
- **Product Details:** View individual product information, images, prices, and ratings.
- **Shopping Cart:** Add products, update quantities, remove items, and calculate the total price.
- **Favorites:** Save and manage favorite products.
- **User Profile:** View and update personal profile information.
- **Checkout:** Place orders using Cash on Delivery or PayPal.
- **Bilingual Interface:** Switch between English and Arabic.
- **Theme Customization:** Light and dark mode support.
- **Persistent Data:** Store user accounts, shopping carts, favorites, and orders in MongoDB.

## Tech Stack

### Frontend
- React 19
- Vite
- Material UI (MUI)
- React Router
- Redux Toolkit
- React Redux
- i18next
- React i18next
- PayPal React SDK
- Google OAuth

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Google Auth Library
- CORS
- dotenv

### External Services
- [DummyJSON](https://dummyjson.com/) – Product data API.
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) – Cloud database hosting.
- [Google Identity](https://developers.google.com/identity) – Google authentication.
- [PayPal Developer](https://developer.paypal.com/) – Payment integration.

## Project Structure

```text
full-stack-e-commerce-project/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Order.js
│   │   │   └── User.js
│   │   │
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── orderRoutes.js
│   │       ├── productRoutes.js
│   │       └── userRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── i18n/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── public/
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) account or local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-Azaz/full-stack-e-commerce-project.git

cd full-stack-e-commerce-project
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

Configure the environment variables:

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |

Start the backend development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

Start the frontend development server:

```bash
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

The backend exposes the following REST API endpoints.

### Authentication

Base URL: `/api/auth`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/register` | Register a new account | No |
| POST | `/login` | Log in | No |
| POST | `/google` | Google authentication | No |
| GET | `/me` | Get current user | Yes |

### Products

Base URL: `/api/products`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | Retrieve products | No |
| GET | `/:id` | Retrieve a product by ID | No |

### User

Base URL: `/api/user`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| GET | `/cart` | Get shopping cart | Yes |
| POST | `/cart` | Add item to cart | Yes |
| PATCH | `/cart/:productId` | Update item quantity | Yes |
| DELETE | `/cart/:productId` | Remove item from cart | Yes |
| GET | `/favorites` | Get favorite products | Yes |
| POST | `/favorites` | Add a favorite product | Yes |
| DELETE | `/favorites/:productId` | Remove a favorite product | Yes |

### Orders

Base URL: `/api/orders`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/checkout` | Create an order and clear the cart | Yes |

**Authentication:** Protected endpoints require a JWT token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start the development server using Nodemon |
| `npm start` | Start the production server |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |

## Notes

- The product catalog is retrieved from DummyJSON rather than stored in the project's MongoDB database.
- MongoDB stores user information, cart items, favorites, and order records.
- Google authentication requires a configured Google OAuth client ID.
- PayPal requires a configured client ID to display its payment interface.
- The backend and frontend must both be running during local development.

## License

This project is available for personal and educational use.

---

**Developed by [Ahmed Azaz](https://github.com/Ahmed-Azaz)**
