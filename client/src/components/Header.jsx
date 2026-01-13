import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? 'bg-black/20 backdrop-blur-md border-b border-white/10' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Sousse Apple Store Logo" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <span className={`text-2xl font-semibold hidden sm:block transition-colors ${
              isHomePage ? 'text-white' : 'text-apple-text'
            }`}>
              Sousse Apple Store
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isHomePage 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-apple-text hover:text-apple-blue'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/cart"
              className={`relative transition-colors ${
                isHomePage 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-apple-text hover:text-apple-blue'
              }`}
            >
              Cart
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-4 bg-apple-blue text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            <Link
              to="/analytics"
              className={`transition-colors ${
                isHomePage 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-apple-text hover:text-apple-blue'
              }`}
            >
              📊 Analytics
            </Link>

            {user?.isAdmin && (
              <Link
                to="/admin/products"
                className={`transition-colors ${
                  isHomePage 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-apple-text hover:text-apple-blue'
                }`}
              >
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isHomePage ? 'text-white/80' : 'text-gray-600'}`}>
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-apple-blue text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-apple-blue text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/cart"
              className={`relative ${
                isHomePage ? 'text-white' : 'text-apple-text'
              }`}
            >
              Cart
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-4 bg-apple-blue text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            <Link
              to="/analytics"
              className={isHomePage ? 'text-white' : 'text-apple-text'}
            >
              📊 Analytics
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-apple-blue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-apple-blue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

