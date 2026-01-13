import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProductList from './pages/admin/ProductList';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import PowerBIDashboard from './pages/PowerBIDashboard';
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<CreateProductPage />} />
        <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
        <Route path="/analytics" element={<PowerBIDashboard />} />
      </Routes>
    </div>
  );
}

export default App;

