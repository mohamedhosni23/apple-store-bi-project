import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

// ============================================
// USERS DATA - 35 Users across Tunisia
// ============================================
const usersData = [
  // Admin users
  { name: 'Admin Principal', email: 'admin@applestoresousse.tn', password: 'admin123', isAdmin: true },
  { name: 'Mohamed Hosni', email: 'mohamed.hosni@applestoresousse.tn', password: 'admin123', isAdmin: true },
  
  // Regular customers from different Tunisian cities
  { name: 'Ahmed Ben Ali', email: 'ahmed.benali@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Fatma Trabelsi', email: 'fatma.trabelsi@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Youssef Hammami', email: 'youssef.hammami@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Amira Sassi', email: 'amira.sassi@hotmail.com', password: 'password123', isAdmin: false },
  { name: 'Karim Bouazizi', email: 'karim.bouazizi@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Nour Gharbi', email: 'nour.gharbi@outlook.com', password: 'password123', isAdmin: false },
  { name: 'Slim Mejri', email: 'slim.mejri@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Ines Chaabane', email: 'ines.chaabane@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Mehdi Jebali', email: 'mehdi.jebali@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Sarra Belhaj', email: 'sarra.belhaj@hotmail.com', password: 'password123', isAdmin: false },
  { name: 'Omar Khedher', email: 'omar.khedher@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Rim Mansouri', email: 'rim.mansouri@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Bilel Nasr', email: 'bilel.nasr@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Hela Ferchichi', email: 'hela.ferchichi@outlook.com', password: 'password123', isAdmin: false },
  { name: 'Tarek Jaziri', email: 'tarek.jaziri@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Mariem Souissi', email: 'mariem.souissi@hotmail.com', password: 'password123', isAdmin: false },
  { name: 'Hamza Dridi', email: 'hamza.dridi@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Asma Tlili', email: 'asma.tlili@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Walid Rezgui', email: 'walid.rezgui@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Salma Brahmi', email: 'salma.brahmi@outlook.com', password: 'password123', isAdmin: false },
  { name: 'Fares Chouchane', email: 'fares.chouchane@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Olfa Messaoud', email: 'olfa.messaoud@hotmail.com', password: 'password123', isAdmin: false },
  { name: 'Rami Ammar', email: 'rami.ammar@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Nadia Kouki', email: 'nadia.kouki@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Zied Mbarki', email: 'zied.mbarki@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Leila Feki', email: 'leila.feki@outlook.com', password: 'password123', isAdmin: false },
  { name: 'Anis Selmi', email: 'anis.selmi@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Houda Zammel', email: 'houda.zammel@hotmail.com', password: 'password123', isAdmin: false },
  { name: 'Khaled Baccar', email: 'khaled.baccar@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Yasmine Turki', email: 'yasmine.turki@yahoo.fr', password: 'password123', isAdmin: false },
  { name: 'Sofien Gharbi', email: 'sofien.gharbi@gmail.com', password: 'password123', isAdmin: false },
  { name: 'Rania Ayed', email: 'rania.ayed@outlook.com', password: 'password123', isAdmin: false },
  { name: 'Nizar Haddad', email: 'nizar.haddad@gmail.com', password: 'password123', isAdmin: false },
];

// ============================================
// PRODUCTS DATA - 30 Apple Products
// ============================================
const productsData = [
  // iPhones
  {
    name: 'iPhone 15 Pro Max',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPhone 15 Pro Max with A17 Pro chip, titanium design, 6.7-inch display, and advanced camera system.',
    brand: 'Apple',
    category: 'Smartphones',
    price: 1199,
    countInStock: 25,
  },
  {
    name: 'iPhone 15 Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPhone 15 Pro featuring A17 Pro chip, titanium design, Action button, and 48MP camera.',
    brand: 'Apple',
    category: 'Smartphones',
    price: 999,
    countInStock: 30,
  },
  {
    name: 'iPhone 15',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPhone 15 with Dynamic Island, A16 Bionic chip, and 48MP camera system.',
    brand: 'Apple',
    category: 'Smartphones',
    price: 799,
    countInStock: 40,
  },
  {
    name: 'iPhone 15 Plus',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-plus-finish-select-202309-6-7inch-pink?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPhone 15 Plus with larger 6.7-inch display, A16 Bionic, and all-day battery life.',
    brand: 'Apple',
    category: 'Smartphones',
    price: 899,
    countInStock: 35,
  },
  {
    name: 'iPhone 14',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPhone 14 with A15 Bionic chip, improved camera, and Crash Detection.',
    brand: 'Apple',
    category: 'Smartphones',
    price: 699,
    countInStock: 45,
  },
  
  // MacBooks
  {
    name: 'MacBook Pro 16" M3 Max',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'MacBook Pro 16-inch with M3 Max chip, 36GB RAM, stunning Liquid Retina XDR display.',
    brand: 'Apple',
    category: 'Laptops',
    price: 3499,
    countInStock: 10,
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, perfect for professionals.',
    brand: 'Apple',
    category: 'Laptops',
    price: 1999,
    countInStock: 15,
  },
  {
    name: 'MacBook Air 15" M3',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-midnight-select-202306?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'MacBook Air 15-inch with M3 chip, stunningly thin design, and all-day battery.',
    brand: 'Apple',
    category: 'Laptops',
    price: 1299,
    countInStock: 20,
  },
  {
    name: 'MacBook Air 13" M3',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-202402?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'MacBook Air 13-inch with M3 chip, incredibly portable with amazing performance.',
    brand: 'Apple',
    category: 'Laptops',
    price: 1099,
    countInStock: 25,
  },
  
  // iPads
  {
    name: 'iPad Pro 12.9" M2',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-202210?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPad Pro 12.9-inch with M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    brand: 'Apple',
    category: 'Tablets',
    price: 1099,
    countInStock: 18,
  },
  {
    name: 'iPad Pro 11" M2',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-202210?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPad Pro 11-inch with M2 chip, portable powerhouse for creative professionals.',
    brand: 'Apple',
    category: 'Tablets',
    price: 799,
    countInStock: 22,
  },
  {
    name: 'iPad Air M1',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-202203?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPad Air with M1 chip, 10.9-inch Liquid Retina display, and all-day battery.',
    brand: 'Apple',
    category: 'Tablets',
    price: 599,
    countInStock: 30,
  },
  {
    name: 'iPad 10th Generation',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPad 10th generation with A14 Bionic chip, colorful design, and USB-C.',
    brand: 'Apple',
    category: 'Tablets',
    price: 449,
    countInStock: 35,
  },
  {
    name: 'iPad Mini 6',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-mini-select-202109?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iPad mini with A15 Bionic, 8.3-inch Liquid Retina display, ultra-portable.',
    brand: 'Apple',
    category: 'Tablets',
    price: 499,
    countInStock: 28,
  },
  
  // Apple Watch
  {
    name: 'Apple Watch Ultra 2',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Apple Watch Ultra 2 with S9 SiP, precision dual-frequency GPS, and 36-hour battery.',
    brand: 'Apple',
    category: 'Wearables',
    price: 799,
    countInStock: 12,
  },
  {
    name: 'Apple Watch Series 9 45mm',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Apple Watch Series 9 45mm with S9 chip, Double Tap gesture, and brighter display.',
    brand: 'Apple',
    category: 'Wearables',
    price: 429,
    countInStock: 25,
  },
  {
    name: 'Apple Watch Series 9 41mm',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-41-aluminum-midnight-nc-s9?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Apple Watch Series 9 41mm, perfect size with all advanced health features.',
    brand: 'Apple',
    category: 'Wearables',
    price: 399,
    countInStock: 30,
  },
  {
    name: 'Apple Watch SE 2nd Gen',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-se-case-40-aluminum-midnight-nc-se2?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Apple Watch SE with essential features at an affordable price.',
    brand: 'Apple',
    category: 'Wearables',
    price: 249,
    countInStock: 40,
  },
  
  // AirPods
  {
    name: 'AirPods Pro 2nd Gen',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'AirPods Pro with Active Noise Cancellation, Adaptive Transparency, and USB-C.',
    brand: 'Apple',
    category: 'Audio',
    price: 249,
    countInStock: 50,
  },
  {
    name: 'AirPods 3rd Gen',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'AirPods 3rd generation with Spatial Audio and Adaptive EQ.',
    brand: 'Apple',
    category: 'Audio',
    price: 179,
    countInStock: 55,
  },
  {
    name: 'AirPods Max',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'AirPods Max with high-fidelity audio, Active Noise Cancellation, and premium design.',
    brand: 'Apple',
    category: 'Audio',
    price: 549,
    countInStock: 15,
  },
  
  // iMac & Mac
  {
    name: 'iMac 24" M3',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'iMac 24-inch with M3 chip, stunning 4.5K Retina display, and vibrant colors.',
    brand: 'Apple',
    category: 'Desktops',
    price: 1299,
    countInStock: 12,
  },
  {
    name: 'Mac Mini M2',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Mac mini with M2 chip, compact powerhouse for any workspace.',
    brand: 'Apple',
    category: 'Desktops',
    price: 599,
    countInStock: 20,
  },
  {
    name: 'Mac Mini M2 Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Mac mini with M2 Pro chip, professional performance in a mini form factor.',
    brand: 'Apple',
    category: 'Desktops',
    price: 1299,
    countInStock: 10,
  },
  {
    name: 'Mac Studio M2 Max',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-studio-select-202306?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Mac Studio with M2 Max chip, extraordinary performance for professionals.',
    brand: 'Apple',
    category: 'Desktops',
    price: 1999,
    countInStock: 8,
  },
  {
    name: 'Mac Pro M2 Ultra',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-pro-hero-202306?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Mac Pro with M2 Ultra chip, ultimate power for the most demanding workflows.',
    brand: 'Apple',
    category: 'Desktops',
    price: 6999,
    countInStock: 3,
  },
  
  // Accessories
  {
    name: 'Apple Pencil 2nd Gen',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU8F2?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Apple Pencil 2nd generation with pixel-perfect precision and magnetic attachment.',
    brand: 'Apple',
    category: 'Accessories',
    price: 129,
    countInStock: 60,
  },
  {
    name: 'Magic Keyboard for iPad Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXQT2?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'Magic Keyboard with floating design, trackpad, and backlit keys.',
    brand: 'Apple',
    category: 'Accessories',
    price: 349,
    countInStock: 25,
  },
  {
    name: 'MagSafe Charger',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=800&hei=800&fmt=jpeg&qlt=90',
    description: 'MagSafe Charger for effortless wireless charging of iPhone and AirPods.',
    brand: 'Apple',
    category: 'Accessories',
    price: 39,
    countInStock: 100,
  },
];

// ============================================
// TUNISIAN LOCATIONS DATA
// ============================================
const tunisianLocations = [
  { city: 'Sousse', governorate: 'Sousse', postalCode: '4000' },
  { city: 'Tunis', governorate: 'Tunis', postalCode: '1000' },
  { city: 'Sfax', governorate: 'Sfax', postalCode: '3000' },
  { city: 'Monastir', governorate: 'Monastir', postalCode: '5000' },
  { city: 'Bizerte', governorate: 'Bizerte', postalCode: '7000' },
  { city: 'Gabès', governorate: 'Gabès', postalCode: '6000' },
  { city: 'Kairouan', governorate: 'Kairouan', postalCode: '3100' },
  { city: 'Ariana', governorate: 'Ariana', postalCode: '2080' },
  { city: 'Nabeul', governorate: 'Nabeul', postalCode: '8000' },
  { city: 'Hammamet', governorate: 'Nabeul', postalCode: '8050' },
  { city: 'Mahdia', governorate: 'Mahdia', postalCode: '5100' },
  { city: 'Ben Arous', governorate: 'Ben Arous', postalCode: '2013' },
  { city: 'La Marsa', governorate: 'Tunis', postalCode: '2070' },
  { city: 'Carthage', governorate: 'Tunis', postalCode: '2016' },
  { city: 'Djerba', governorate: 'Médenine', postalCode: '4180' },
];

const streetNames = [
  'Avenue Habib Bourguiba',
  'Rue de la Liberté',
  'Avenue de la République',
  'Rue Ibn Khaldoun',
  'Avenue Mohamed V',
  'Rue de Marseille',
  'Avenue Farhat Hached',
  'Rue de Palestine',
  'Avenue de Carthage',
  'Rue du 1er Juin',
];

const paymentMethods = ['Credit Card', 'PayPal', 'Cash on Delivery', 'Bank Transfer'];
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

// ============================================
// HELPER FUNCTIONS
// ============================================
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return new Date(start + Math.random() * (end - start));
}

function generateShippingAddress() {
  const location = getRandomElement(tunisianLocations);
  const streetNumber = getRandomInt(1, 200);
  const street = getRandomElement(streetNames);
  
  return {
    address: `${streetNumber} ${street}`,
    city: location.city,
    postalCode: location.postalCode,
    country: 'Tunisia',
    governorate: location.governorate,
  };
}

// Generate weighted status based on realistic distribution
function generateOrderStatus(orderDate) {
  const now = new Date();
  const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
  
  // Recent orders more likely to be pending/processing
  if (daysSinceOrder < 3) {
    const rand = Math.random();
    if (rand < 0.4) return 'Pending';
    if (rand < 0.7) return 'Processing';
    if (rand < 0.9) return 'Shipped';
    return 'Delivered';
  }
  
  // Older orders mostly delivered with some cancelled/refunded
  const rand = Math.random();
  if (rand < 0.75) return 'Delivered';
  if (rand < 0.85) return 'Shipped';
  if (rand < 0.92) return 'Cancelled';
  if (rand < 0.97) return 'Refunded';
  return 'Processing';
}

// ============================================
// MAIN SEEDER FUNCTION
// ============================================
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, salt),
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Generate 500 orders over 12 months
    const orders = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2025-01-13');
    
    // Get only non-admin users for orders
    const customers = createdUsers.filter(user => !user.isAdmin);
    
    for (let i = 0; i < 500; i++) {
      const customer = getRandomElement(customers);
      const orderDate = getRandomDate(startDate, endDate);
      
      // Generate 1-4 items per order
      const numItems = getRandomInt(1, 4);
      const orderItems = [];
      const usedProducts = new Set();
      
      for (let j = 0; j < numItems; j++) {
        let product;
        // Ensure no duplicate products in same order
        do {
          product = getRandomElement(createdProducts);
        } while (usedProducts.has(product._id.toString()) && usedProducts.size < createdProducts.length);
        
        usedProducts.add(product._id.toString());
        
        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: getRandomInt(1, 3),
        });
      }
      
      // Calculate totals
      const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const taxPrice = Math.round(itemsPrice * 0.19 * 100) / 100; // 19% TVA in Tunisia
      const shippingPrice = itemsPrice > 1000 ? 0 : 15; // Free shipping over 1000 TND
      const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;
      
      const status = generateOrderStatus(orderDate);
      const isPaid = ['Processing', 'Shipped', 'Delivered'].includes(status);
      const isDelivered = status === 'Delivered';
      
      // Set dates based on status
      let paidAt = null;
      let deliveredAt = null;
      
      if (isPaid) {
        paidAt = new Date(orderDate.getTime() + getRandomInt(0, 2) * 24 * 60 * 60 * 1000);
      }
      
      if (isDelivered) {
        deliveredAt = new Date(orderDate.getTime() + getRandomInt(3, 10) * 24 * 60 * 60 * 1000);
      }
      
      orders.push({
        user: customer._id,
        orderItems,
        shippingAddress: generateShippingAddress(),
        paymentMethod: getRandomElement(paymentMethods),
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
        status,
        createdAt: orderDate,
        updatedAt: deliveredAt || paidAt || orderDate,
      });
    }

    // Insert orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`🛒 Created ${createdOrders.length} orders`);

    // Print summary statistics
    console.log('\n📊 Data Summary:');
    console.log('================');
    console.log(`Total Users: ${createdUsers.length} (${createdUsers.filter(u => u.isAdmin).length} admins, ${customers.length} customers)`);
    console.log(`Total Products: ${createdProducts.length}`);
    console.log(`Total Orders: ${createdOrders.length}`);
    
    const totalRevenue = orders.reduce((acc, order) => {
      if (['Processing', 'Shipped', 'Delivered'].includes(order.status)) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);
    console.log(`Total Revenue: ${totalRevenue.toFixed(2)} TND`);
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    console.log('\nOrders by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\n✅ Database seeded successfully for BI project!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
