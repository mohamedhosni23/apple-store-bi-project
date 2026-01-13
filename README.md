# 🍎 Sousse Apple Store

A modern, full-stack e-commerce web application for an Apple product store in Sousse. Built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring a beautiful Apple-inspired user interface, complete shopping cart functionality, and admin dashboard for product management.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse a beautiful grid of Apple products with high-quality images
- **Product Details**: View detailed information about each product including price, description, and stock availability
- **Shopping Cart**: Add products to cart with quantity selection, persistent cart storage, and real-time updates
- **User Authentication**: Secure user registration and login with JWT tokens
- **Responsive Design**: Fully responsive design optimized for all devices (mobile, tablet, desktop)
- **Hero Video Section**: Engaging full-screen video background on homepage
- **Floating Action Buttons**: Quick access to cart, admin dashboard, and scroll to top

### 👨‍💼 Admin Features
- **Admin Dashboard**: Complete product management interface
- **Product CRUD Operations**: Create, read, update, and delete products
- **Image Upload**: Upload product images with automatic handling
- **Stock Management**: Track and manage product inventory
- **Protected Routes**: Role-based access control for admin features

### 🎨 Design Features
- **Apple-Inspired UI**: Clean, minimalist design matching Apple's aesthetic
- **Smooth Animations**: Elegant transitions and hover effects
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Beautiful loading indicators and skeletons
- **Custom Animations**: Fade-in and slide-up animations for enhanced UX

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 7.2.6** - Build tool and dev server
- **React Router DOM 6.20.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - HTTP client
- **React Hot Toast 2.4.1** - Toast notifications
- **Context API** - Global state management

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - Database
- **Mongoose 8.0.3** - MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **CORS 2.8.5** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamedhosni23/applestoresousse.git
   cd applestoresousse
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

### Backend Configuration

1. **Create a `.env` file in the `server` directory:**
   ```env
   MONGO_URI=mongodb://localhost:27017/applestoresousse
   DW_URI=sqlite:///apple_store_datawarehouse.db
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

   **Note:** If your MongoDB URI is different (like MongoDB Atlas), update it accordingly.
   
   **Environment Variables:**
   - `MONGO_URI`: MongoDB connection string for the main database
   - `DW_URI`: SQLite connection string for the data warehouse database
   - `PORT`: Server port (default: 5000)
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong random string)
   
   **MongoDB Atlas Example:**
   - `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/applestoresousse?retryWrites=true&w=majority`

2. **Create the `img` directory** (if it doesn't exist):
   ```bash
   mkdir server/img
   ```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If your backend runs on a different port, update the API URLs in:
- `client/src/pages/HomePage.jsx`
- `client/src/pages/ProductPage.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/utils/imageUtils.js`
- `client/src/pages/admin/ProductList.jsx`

## 🏃 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Seed the database (optional):**
   ```bash
   cd server
   npm run seed
   ```
   This will populate the database with sample products.

### Production Build

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server:**
   ```bash
   cd server
   npm start
   ```

## 📁 Project Structure

```
applestoresousse/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   ├── hero-video.mp4
│   │   └── logo.png
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── FloatingButtons.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ProductForm.jsx
│   │   ├── context/       # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── CartPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── utils/         # Utility functions
│   │   │   └── imageUtils.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/           # Mongoose models
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/           # API routes
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── img/              # Uploaded images directory
│   ├── .gitkeep
│   ├── seeder.js         # Database seeder
│   ├── server.js         # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Static Files
- `GET /img/:filename` - Serve uploaded product images

## 👤 Default Admin Account

To create an admin account, you can either:
1. Register a user and manually set `isAdmin: true` in MongoDB
2. Modify the registration logic to set the first user as admin

## 🎯 Key Features Implementation

### State Management
- **AuthContext**: Manages user authentication state globally
- **CartContext**: Handles shopping cart operations with localStorage persistence

### Image Handling
- Product images are uploaded via Multer middleware
- Images are served as static files from `/img` directory
- Frontend utility function normalizes image URLs

### Authentication Flow
1. User registers/logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token automatically included in API requests via axios interceptors
5. Protected routes verify token validity

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Postman Collection

A Postman collection (`Postman_Collection.json`) is included in the repository for testing API endpoints.

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected admin routes
- Input validation
- CORS configuration
- File upload validation

## 🎨 Design System

### Colors
- **Apple Blue**: `#0071e3` - Primary action color
- **Apple Text**: `#1d1d1f` - Primary text color
- **Apple Gray**: `#f5f5f7` - Background color

### Typography
- **Font Family**: Inter (Google Fonts)
- Clean, modern sans-serif design

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB connection string in `.env`
   - Ensure MongoDB is running locally or Atlas cluster is accessible

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Or kill the process using the port

3. **Image Upload Fails**
   - Ensure `server/img` directory exists
   - Check file permissions
   - Verify Multer configuration

4. **CORS Errors**
   - Verify CORS origin in `server.js` matches frontend URL
   - Check that frontend is running on the correct port

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mohamed Hosni**
- GitHub: [@mohamedhosni23](https://github.com/mohamedhosni23)

## 🙏 Acknowledgments

- Design inspired by Apple's aesthetic
- Built with the MERN stack
- Uses modern React patterns and best practices

## 📞 Support

For support, email or open an issue on GitHub.

---

**Made with ❤️ for the Sousse Apple Store**
