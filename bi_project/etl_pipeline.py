"""
============================================
ETL SCRIPT FOR APPLE STORE SOUSSE
Data Analytics & Business Intelligence Project
============================================

This script performs:
1. EXTRACTION: Pull data from MongoDB (operational database)
2. TRANSFORMATION: Clean, normalize, and prepare data
3. LOADING: Insert into PostgreSQL/MySQL Data Warehouse (Star Schema)

Author: Mohamed Hosni
Date: January 2025
"""

import os
import sys
from datetime import datetime
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================
# CONFIGURATION
# ============================================
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/applestoresousse')
# Choose your Data Warehouse database:
# For PostgreSQL:
# DW_URI = 'postgresql://username:password@localhost:5432/apple_store_dw'
# For MySQL:
# DW_URI = 'mysql+pymysql://username:password@localhost:3306/apple_store_dw'
# For SQLite (easiest for testing):
DW_URI = os.getenv('DW_URI', 'sqlite:///apple_store_datawarehouse.db')


class AppleStoreETL:
    """ETL Pipeline for Apple Store Sousse BI Project"""
    
    def __init__(self):
        self.mongo_client = None
        self.mongo_db = None
        self.dw_engine = None
        
        # DataFrames for extracted data
        self.df_users = None
        self.df_products = None
        self.df_orders = None
        
        # Transformed DataFrames for DW
        self.dim_customer = None
        self.dim_product = None
        self.dim_time = None
        self.dim_location = None
        self.fact_sales = None
    
    # ============================================
    # EXTRACTION PHASE
    # ============================================
    def connect_mongodb(self):
        """Establish connection to MongoDB"""
        print("\n" + "="*50)
        print("📥 EXTRACTION PHASE")
        print("="*50)
        
        try:
            self.mongo_client = MongoClient(MONGO_URI)
            self.mongo_db = self.mongo_client.get_database()
            print(f"✅ Connected to MongoDB: {self.mongo_db.name}")
            return True
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            return False
    
    def extract_users(self):
        """Extract users collection from MongoDB"""
        print("\n📤 Extracting Users...")
        users = list(self.mongo_db.users.find())
        self.df_users = pd.DataFrame(users)
        print(f"   ✓ Extracted {len(self.df_users)} users")
        return self.df_users
    
    def extract_products(self):
        """Extract products collection from MongoDB"""
        print("📤 Extracting Products...")
        products = list(self.mongo_db.products.find())
        self.df_products = pd.DataFrame(products)
        print(f"   ✓ Extracted {len(self.df_products)} products")
        return self.df_products
    
    def extract_orders(self):
        """Extract orders collection from MongoDB"""
        print("📤 Extracting Orders...")
        orders = list(self.mongo_db.orders.find())
        self.df_orders = pd.DataFrame(orders)
        print(f"   ✓ Extracted {len(self.df_orders)} orders")
        return self.df_orders
    
    def extract_all(self):
        """Run full extraction"""
        self.connect_mongodb()
        self.extract_users()
        self.extract_products()
        self.extract_orders()
        
        print("\n📊 Extraction Summary:")
        print(f"   • Users: {len(self.df_users)}")
        print(f"   • Products: {len(self.df_products)}")
        print(f"   • Orders: {len(self.df_orders)}")
    
    # ============================================
    # TRANSFORMATION PHASE
    # ============================================
    def transform_data(self):
        """Main transformation function"""
        print("\n" + "="*50)
        print("🔄 TRANSFORMATION PHASE")
        print("="*50)
        
        self.transform_dim_customer()
        self.transform_dim_product()
        self.transform_dim_time()
        self.transform_dim_location()
        self.transform_fact_sales()
        
        print("\n✅ All transformations completed!")
    
    def transform_dim_customer(self):
        """Transform users into DIM_CUSTOMER"""
        print("\n🔧 Transforming DIM_CUSTOMER...")
        
        # Filter out admin users for customer dimension
        customers = self.df_users[self.df_users['isAdmin'] == False].copy()
        
        self.dim_customer = pd.DataFrame({
            'customer_id': range(1, len(customers) + 1),
            'mongo_id': customers['_id'].astype(str),
            'customer_name': customers['name'].str.strip().str.title(),
            'email': customers['email'].str.lower().str.strip(),
            'registration_date': pd.to_datetime(customers['createdAt']).dt.date,
            'is_active': True
        })
        
        # Handle missing values
        self.dim_customer['customer_name'] = self.dim_customer['customer_name'].fillna('Unknown')
        self.dim_customer['email'] = self.dim_customer['email'].fillna('unknown@email.com')
        
        print(f"   ✓ Created {len(self.dim_customer)} customer records")
    
    def transform_dim_product(self):
        """Transform products into DIM_PRODUCT"""
        print("🔧 Transforming DIM_PRODUCT...")
        
        self.dim_product = pd.DataFrame({
            'product_id': range(1, len(self.df_products) + 1),
            'mongo_id': self.df_products['_id'].astype(str),
            'product_name': self.df_products['name'].str.strip(),
            'brand': self.df_products['brand'].str.strip().str.title(),
            'category': self.df_products['category'].str.strip().str.title(),
            'current_price': self.df_products['price'].astype(float),
            'description': self.df_products['description'].str[:500],  # Truncate long descriptions
            'stock_quantity': self.df_products['countInStock'].astype(int)
        })
        
        # Handle missing values
        self.dim_product['brand'] = self.dim_product['brand'].fillna('Apple')
        self.dim_product['category'] = self.dim_product['category'].fillna('Other')
        
        print(f"   ✓ Created {len(self.dim_product)} product records")
    
    def transform_dim_time(self):
        """Create DIM_TIME dimension from order dates"""
        print("🔧 Transforming DIM_TIME...")
        
        # Get all unique dates from orders
        order_dates = pd.to_datetime(self.df_orders['createdAt']).dt.date.unique()
        
        time_records = []
        for i, date in enumerate(sorted(order_dates), 1):
            dt = pd.Timestamp(date)
            time_records.append({
                'time_id': i,
                'full_date': date,
                'day': dt.day,
                'month': dt.month,
                'month_name': dt.strftime('%B'),
                'quarter': (dt.month - 1) // 3 + 1,
                'year': dt.year,
                'day_of_week': dt.dayofweek,
                'day_name': dt.strftime('%A'),
                'is_weekend': dt.dayofweek >= 5,
                'week_of_year': dt.isocalendar()[1]
            })
        
        self.dim_time = pd.DataFrame(time_records)
        print(f"   ✓ Created {len(self.dim_time)} time records")
    
    def transform_dim_location(self):
        """Create DIM_LOCATION from shipping addresses"""
        print("🔧 Transforming DIM_LOCATION...")
        
        # Extract unique locations from orders
        locations = []
        seen_locations = set()
        
        for _, order in self.df_orders.iterrows():
            if 'shippingAddress' in order and order['shippingAddress']:
                addr = order['shippingAddress']
                location_key = f"{addr.get('city', '')}-{addr.get('governorate', '')}"
                
                if location_key not in seen_locations and addr.get('city'):
                    seen_locations.add(location_key)
                    locations.append({
                        'city': addr.get('city', 'Unknown'),
                        'governorate': addr.get('governorate', 'Unknown'),
                        'postal_code': addr.get('postalCode', '0000'),
                        'country': addr.get('country', 'Tunisia')
                    })
        
        self.dim_location = pd.DataFrame(locations)
        self.dim_location.insert(0, 'location_id', range(1, len(self.dim_location) + 1))
        
        print(f"   ✓ Created {len(self.dim_location)} location records")
    
    def transform_fact_sales(self):
        """Create FACT_SALES from orders"""
        print("🔧 Transforming FACT_SALES...")
        
        # Create lookup dictionaries
        customer_lookup = dict(zip(self.dim_customer['mongo_id'], self.dim_customer['customer_id']))
        product_lookup = dict(zip(self.dim_product['mongo_id'], self.dim_product['product_id']))
        time_lookup = dict(zip(self.dim_time['full_date'], self.dim_time['time_id']))
        
        # Create location lookup
        location_lookup = {}
        for _, loc in self.dim_location.iterrows():
            key = f"{loc['city']}-{loc['governorate']}"
            location_lookup[key] = loc['location_id']
        
        fact_records = []
        sale_id = 1
        
        for _, order in self.df_orders.iterrows():
            # Get customer_id
            user_mongo_id = str(order.get('user', ''))
            customer_id = customer_lookup.get(user_mongo_id, None)
            
            if customer_id is None:
                continue  # Skip orders without valid customer
            
            # Get time_id
            order_date = pd.to_datetime(order['createdAt']).date()
            time_id = time_lookup.get(order_date, None)
            
            # Get location_id
            shipping = order.get('shippingAddress', {})
            location_key = f"{shipping.get('city', '')}-{shipping.get('governorate', '')}"
            location_id = location_lookup.get(location_key, 1)
            
            # Process each order item
            order_items = order.get('orderItems', [])
            for item in order_items:
                product_mongo_id = str(item.get('product', ''))
                product_id = product_lookup.get(product_mongo_id, None)
                
                if product_id is None:
                    continue
                
                fact_records.append({
                    'sale_id': sale_id,
                    'time_id': time_id,
                    'product_id': product_id,
                    'customer_id': customer_id,
                    'location_id': location_id,
                    'order_mongo_id': str(order['_id']),
                    'quantity': int(item.get('quantity', 1)),
                    'unit_price': float(item.get('price', 0)),
                    'total_amount': float(item.get('price', 0)) * int(item.get('quantity', 1)),
                    'tax_amount': float(order.get('taxPrice', 0)) / len(order_items) if order_items else 0,
                    'shipping_amount': float(order.get('shippingPrice', 0)) / len(order_items) if order_items else 0,
                    'payment_method': order.get('paymentMethod', 'Unknown'),
                    'order_status': order.get('status', 'Unknown'),
                    'is_paid': bool(order.get('isPaid', False)),
                    'is_delivered': bool(order.get('isDelivered', False))
                })
                sale_id += 1
        
        self.fact_sales = pd.DataFrame(fact_records)
        
        # Round numerical values
        self.fact_sales['total_amount'] = self.fact_sales['total_amount'].round(2)
        self.fact_sales['tax_amount'] = self.fact_sales['tax_amount'].round(2)
        self.fact_sales['shipping_amount'] = self.fact_sales['shipping_amount'].round(2)
        
        print(f"   ✓ Created {len(self.fact_sales)} sales fact records")
    
    # ============================================
    # LOADING PHASE
    # ============================================
    def connect_datawarehouse(self):
        """Connect to Data Warehouse database"""
        print("\n" + "="*50)
        print("📤 LOADING PHASE")
        print("="*50)
        
        try:
            self.dw_engine = create_engine(DW_URI)
            print(f"✅ Connected to Data Warehouse")
            return True
        except Exception as e:
            print(f"❌ Data Warehouse connection error: {e}")
            return False
    
    def create_dw_schema(self):
        """Create Data Warehouse schema (Star Schema)"""
        print("\n🏗️  Creating Data Warehouse Schema...")
        
        schema_sql = """
        -- Drop existing tables (in correct order due to foreign keys)
        DROP TABLE IF EXISTS fact_sales;
        DROP TABLE IF EXISTS dim_time;
        DROP TABLE IF EXISTS dim_product;
        DROP TABLE IF EXISTS dim_customer;
        DROP TABLE IF EXISTS dim_location;
        
        -- DIM_CUSTOMER: Customer dimension
        CREATE TABLE dim_customer (
            customer_id INTEGER PRIMARY KEY,
            mongo_id VARCHAR(50),
            customer_name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            registration_date DATE,
            is_active BOOLEAN DEFAULT TRUE
        );
        
        -- DIM_PRODUCT: Product dimension
        CREATE TABLE dim_product (
            product_id INTEGER PRIMARY KEY,
            mongo_id VARCHAR(50),
            product_name VARCHAR(200) NOT NULL,
            brand VARCHAR(50),
            category VARCHAR(50),
            current_price DECIMAL(10,2),
            description TEXT,
            stock_quantity INTEGER
        );
        
        -- DIM_TIME: Time dimension
        CREATE TABLE dim_time (
            time_id INTEGER PRIMARY KEY,
            full_date DATE NOT NULL,
            day INTEGER,
            month INTEGER,
            month_name VARCHAR(20),
            quarter INTEGER,
            year INTEGER,
            day_of_week INTEGER,
            day_name VARCHAR(20),
            is_weekend BOOLEAN,
            week_of_year INTEGER
        );
        
        -- DIM_LOCATION: Location dimension
        CREATE TABLE dim_location (
            location_id INTEGER PRIMARY KEY,
            city VARCHAR(100),
            governorate VARCHAR(100),
            postal_code VARCHAR(10),
            country VARCHAR(50) DEFAULT 'Tunisia'
        );
        
        -- FACT_SALES: Sales fact table
        CREATE TABLE fact_sales (
            sale_id INTEGER PRIMARY KEY,
            time_id INTEGER,
            product_id INTEGER,
            customer_id INTEGER,
            location_id INTEGER,
            order_mongo_id VARCHAR(50),
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2),
            shipping_amount DECIMAL(10,2),
            payment_method VARCHAR(50),
            order_status VARCHAR(50),
            is_paid BOOLEAN,
            is_delivered BOOLEAN,
            FOREIGN KEY (time_id) REFERENCES dim_time(time_id),
            FOREIGN KEY (product_id) REFERENCES dim_product(product_id),
            FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id),
            FOREIGN KEY (location_id) REFERENCES dim_location(location_id)
        );
        """
        
        # Execute schema creation
        with self.dw_engine.connect() as conn:
            for statement in schema_sql.split(';'):
                if statement.strip():
                    conn.execute(text(statement))
            conn.commit()
        
        print("   ✓ Schema created successfully")
    
    def load_dimensions(self):
        """Load dimension tables into Data Warehouse"""
        print("\n📥 Loading Dimension Tables...")
        
        # Load DIM_CUSTOMER
        self.dim_customer.to_sql('dim_customer', self.dw_engine, 
                                  if_exists='append', index=False)
        print(f"   ✓ Loaded {len(self.dim_customer)} records to dim_customer")
        
        # Load DIM_PRODUCT
        self.dim_product.to_sql('dim_product', self.dw_engine, 
                                 if_exists='append', index=False)
        print(f"   ✓ Loaded {len(self.dim_product)} records to dim_product")
        
        # Load DIM_TIME
        self.dim_time.to_sql('dim_time', self.dw_engine, 
                              if_exists='append', index=False)
        print(f"   ✓ Loaded {len(self.dim_time)} records to dim_time")
        
        # Load DIM_LOCATION
        self.dim_location.to_sql('dim_location', self.dw_engine, 
                                  if_exists='append', index=False)
        print(f"   ✓ Loaded {len(self.dim_location)} records to dim_location")
    
    def load_facts(self):
        """Load fact table into Data Warehouse"""
        print("\n📥 Loading Fact Table...")
        
        self.fact_sales.to_sql('fact_sales', self.dw_engine, 
                                if_exists='append', index=False)
        print(f"   ✓ Loaded {len(self.fact_sales)} records to fact_sales")
    
    def load_all(self):
        """Run full loading process"""
        if not self.connect_datawarehouse():
            return False
        
        self.create_dw_schema()
        self.load_dimensions()
        self.load_facts()
        
        print("\n✅ All data loaded successfully!")
        return True
    
    # ============================================
    # VALIDATION & REPORTING
    # ============================================
    def validate_data(self):
        """Validate loaded data"""
        print("\n" + "="*50)
        print("✅ VALIDATION & SUMMARY")
        print("="*50)
        
        with self.dw_engine.connect() as conn:
            # Count records in each table
            tables = ['dim_customer', 'dim_product', 'dim_time', 'dim_location', 'fact_sales']
            
            print("\n📊 Record Counts:")
            for table in tables:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                print(f"   • {table}: {count} records")
            
            # Calculate total revenue
            result = conn.execute(text("""
                SELECT SUM(total_amount) as revenue 
                FROM fact_sales 
                WHERE is_paid = 1
            """))
            revenue = result.scalar() or 0
            print(f"\n💰 Total Revenue (Paid Orders): {revenue:,.2f} TND")
            
            # Top categories
            print("\n📈 Top Categories by Revenue:")
            result = conn.execute(text("""
                SELECT p.category, SUM(f.total_amount) as revenue
                FROM fact_sales f
                JOIN dim_product p ON f.product_id = p.product_id
                WHERE f.is_paid = 1
                GROUP BY p.category
                ORDER BY revenue DESC
                LIMIT 5
            """))
            for row in result:
                print(f"   • {row[0]}: {row[1]:,.2f} TND")
            
            # Top products
            print("\n🏆 Top Products by Sales:")
            result = conn.execute(text("""
                SELECT p.product_name, SUM(f.quantity) as units_sold
                FROM fact_sales f
                JOIN dim_product p ON f.product_id = p.product_id
                GROUP BY p.product_name
                ORDER BY units_sold DESC
                LIMIT 5
            """))
            for row in result:
                print(f"   • {row[0]}: {row[1]} units")
    
    def export_to_csv(self, output_dir='./dw_export'):
        """Export Data Warehouse tables to CSV for Power BI"""
        print(f"\n📁 Exporting to CSV ({output_dir})...")
        
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        self.dim_customer.to_csv(f'{output_dir}/dim_customer.csv', index=False)
        self.dim_product.to_csv(f'{output_dir}/dim_product.csv', index=False)
        self.dim_time.to_csv(f'{output_dir}/dim_time.csv', index=False)
        self.dim_location.to_csv(f'{output_dir}/dim_location.csv', index=False)
        self.fact_sales.to_csv(f'{output_dir}/fact_sales.csv', index=False)
        
        print("   ✓ All tables exported to CSV")
        print(f"   📂 Files saved in: {output_dir}")
    
    # ============================================
    # MAIN ETL PIPELINE
    # ============================================
    def run(self, export_csv=True):
        """Execute complete ETL pipeline"""
        print("\n" + "="*60)
        print("🚀 APPLE STORE SOUSSE - ETL PIPELINE")
        print("   Data Analytics & Business Intelligence Project")
        print("="*60)
        
        start_time = datetime.now()
        
        # Phase 1: Extraction
        self.extract_all()
        
        # Phase 2: Transformation
        self.transform_data()
        
        # Phase 3: Loading
        self.load_all()
        
        # Validation
        self.validate_data()
        
        # Export to CSV for Power BI
        if export_csv:
            self.export_to_csv()
        
        # Close connections
        if self.mongo_client:
            self.mongo_client.close()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print("\n" + "="*60)
        print(f"✅ ETL Pipeline completed in {duration:.2f} seconds")
        print("="*60)


# ============================================
# RUN ETL
# ============================================
if __name__ == "__main__":
    etl = AppleStoreETL()
    etl.run(export_csv=True)
