-- ============================================
-- APPLE STORE SOUSSE - DATA WAREHOUSE SCHEMA
-- Star Schema Implementation
-- ============================================
-- Author: Mohamed Hosni
-- Date: January 2025
-- Database: PostgreSQL / MySQL / SQLite
-- ============================================

-- ============================================
-- DROP EXISTING TABLES (if any)
-- ============================================
DROP TABLE IF EXISTS fact_sales CASCADE;
DROP TABLE IF EXISTS dim_time CASCADE;
DROP TABLE IF EXISTS dim_product CASCADE;
DROP TABLE IF EXISTS dim_customer CASCADE;
DROP TABLE IF EXISTS dim_location CASCADE;

-- ============================================
-- DIMENSION TABLES
-- ============================================

-- --------------------------------------------
-- DIM_CUSTOMER: Customer Dimension
-- Contains information about customers
-- --------------------------------------------
CREATE TABLE dim_customer (
    customer_id         INTEGER PRIMARY KEY,
    mongo_id            VARCHAR(50) UNIQUE,
    customer_name       VARCHAR(100) NOT NULL,
    email               VARCHAR(100),
    registration_date   DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_customer_email ON dim_customer(email);
CREATE INDEX idx_customer_mongo_id ON dim_customer(mongo_id);

COMMENT ON TABLE dim_customer IS 'Customer dimension table containing customer information';
COMMENT ON COLUMN dim_customer.customer_id IS 'Surrogate key for customer dimension';
COMMENT ON COLUMN dim_customer.mongo_id IS 'Original MongoDB ObjectId reference';


-- --------------------------------------------
-- DIM_PRODUCT: Product Dimension
-- Contains information about products
-- --------------------------------------------
CREATE TABLE dim_product (
    product_id          INTEGER PRIMARY KEY,
    mongo_id            VARCHAR(50) UNIQUE,
    product_name        VARCHAR(200) NOT NULL,
    brand               VARCHAR(50) DEFAULT 'Apple',
    category            VARCHAR(50),
    current_price       DECIMAL(10,2),
    description         TEXT,
    stock_quantity      INTEGER DEFAULT 0,
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookups and filtering
CREATE INDEX idx_product_category ON dim_product(category);
CREATE INDEX idx_product_brand ON dim_product(brand);
CREATE INDEX idx_product_mongo_id ON dim_product(mongo_id);

COMMENT ON TABLE dim_product IS 'Product dimension table containing product catalog information';
COMMENT ON COLUMN dim_product.product_id IS 'Surrogate key for product dimension';
COMMENT ON COLUMN dim_product.category IS 'Product category (Smartphones, Laptops, Tablets, etc.)';


-- --------------------------------------------
-- DIM_TIME: Time Dimension
-- Contains date-related attributes for time-based analysis
-- --------------------------------------------
CREATE TABLE dim_time (
    time_id             INTEGER PRIMARY KEY,
    full_date           DATE NOT NULL UNIQUE,
    day                 INTEGER,
    month               INTEGER,
    month_name          VARCHAR(20),
    quarter             INTEGER,
    year                INTEGER,
    day_of_week         INTEGER,
    day_name            VARCHAR(20),
    is_weekend          BOOLEAN,
    week_of_year        INTEGER,
    
    -- Additional useful attributes
    is_holiday          BOOLEAN DEFAULT FALSE,
    fiscal_quarter      INTEGER,
    fiscal_year         INTEGER
);

-- Indexes for time-based queries
CREATE INDEX idx_time_year_month ON dim_time(year, month);
CREATE INDEX idx_time_quarter ON dim_time(year, quarter);
CREATE INDEX idx_time_full_date ON dim_time(full_date);

COMMENT ON TABLE dim_time IS 'Time dimension table for date-based analysis and reporting';
COMMENT ON COLUMN dim_time.time_id IS 'Surrogate key for time dimension';
COMMENT ON COLUMN dim_time.is_weekend IS 'TRUE if Saturday or Sunday';


-- --------------------------------------------
-- DIM_LOCATION: Location/Geography Dimension
-- Contains shipping location information
-- --------------------------------------------
CREATE TABLE dim_location (
    location_id         INTEGER PRIMARY KEY,
    city                VARCHAR(100) NOT NULL,
    governorate         VARCHAR(100),
    postal_code         VARCHAR(10),
    country             VARCHAR(50) DEFAULT 'Tunisia',
    region              VARCHAR(50),
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for location-based analysis
CREATE INDEX idx_location_city ON dim_location(city);
CREATE INDEX idx_location_governorate ON dim_location(governorate);

COMMENT ON TABLE dim_location IS 'Location dimension table for geographical analysis';
COMMENT ON COLUMN dim_location.governorate IS 'Tunisian governorate (state/province equivalent)';


-- ============================================
-- FACT TABLE
-- ============================================

-- --------------------------------------------
-- FACT_SALES: Sales Fact Table
-- Central fact table containing sales transactions
-- Grain: One row per order item
-- --------------------------------------------
CREATE TABLE fact_sales (
    sale_id             INTEGER PRIMARY KEY,
    
    -- Foreign Keys to Dimensions
    time_id             INTEGER NOT NULL,
    product_id          INTEGER NOT NULL,
    customer_id         INTEGER NOT NULL,
    location_id         INTEGER NOT NULL,
    
    -- Degenerate Dimension
    order_mongo_id      VARCHAR(50),
    
    -- Measures (Facts)
    quantity            INTEGER NOT NULL DEFAULT 1,
    unit_price          DECIMAL(10,2) NOT NULL,
    total_amount        DECIMAL(10,2) NOT NULL,
    tax_amount          DECIMAL(10,2) DEFAULT 0,
    shipping_amount     DECIMAL(10,2) DEFAULT 0,
    discount_amount     DECIMAL(10,2) DEFAULT 0,
    
    -- Transaction Attributes
    payment_method      VARCHAR(50),
    order_status        VARCHAR(50),
    is_paid             BOOLEAN DEFAULT FALSE,
    is_delivered        BOOLEAN DEFAULT FALSE,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_fact_time 
        FOREIGN KEY (time_id) REFERENCES dim_time(time_id),
    CONSTRAINT fk_fact_product 
        FOREIGN KEY (product_id) REFERENCES dim_product(product_id),
    CONSTRAINT fk_fact_customer 
        FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id),
    CONSTRAINT fk_fact_location 
        FOREIGN KEY (location_id) REFERENCES dim_location(location_id)
);

-- Indexes for common query patterns
CREATE INDEX idx_fact_time ON fact_sales(time_id);
CREATE INDEX idx_fact_product ON fact_sales(product_id);
CREATE INDEX idx_fact_customer ON fact_sales(customer_id);
CREATE INDEX idx_fact_location ON fact_sales(location_id);
CREATE INDEX idx_fact_status ON fact_sales(order_status);
CREATE INDEX idx_fact_paid ON fact_sales(is_paid);
CREATE INDEX idx_fact_order_mongo ON fact_sales(order_mongo_id);

-- Composite indexes for common analytical queries
CREATE INDEX idx_fact_time_product ON fact_sales(time_id, product_id);
CREATE INDEX idx_fact_time_customer ON fact_sales(time_id, customer_id);

COMMENT ON TABLE fact_sales IS 'Sales fact table - grain is one row per order item';
COMMENT ON COLUMN fact_sales.sale_id IS 'Surrogate key for fact table';
COMMENT ON COLUMN fact_sales.total_amount IS 'quantity * unit_price';


-- ============================================
-- SAMPLE ANALYTICAL QUERIES
-- ============================================

-- Query 1: Total Revenue by Month
/*
SELECT 
    t.year,
    t.month_name,
    SUM(f.total_amount) as revenue,
    COUNT(DISTINCT f.order_mongo_id) as num_orders,
    SUM(f.quantity) as units_sold
FROM fact_sales f
JOIN dim_time t ON f.time_id = t.time_id
WHERE f.is_paid = TRUE
GROUP BY t.year, t.month, t.month_name
ORDER BY t.year, t.month;
*/

-- Query 2: Top Selling Products
/*
SELECT 
    p.product_name,
    p.category,
    SUM(f.quantity) as units_sold,
    SUM(f.total_amount) as revenue
FROM fact_sales f
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.is_paid = TRUE
GROUP BY p.product_id, p.product_name, p.category
ORDER BY revenue DESC
LIMIT 10;
*/

-- Query 3: Sales by Location
/*
SELECT 
    l.governorate,
    l.city,
    COUNT(DISTINCT f.customer_id) as num_customers,
    SUM(f.total_amount) as revenue
FROM fact_sales f
JOIN dim_location l ON f.location_id = l.location_id
WHERE f.is_paid = TRUE
GROUP BY l.governorate, l.city
ORDER BY revenue DESC;
*/

-- Query 4: Customer Purchase Analysis
/*
SELECT 
    c.customer_name,
    COUNT(DISTINCT f.order_mongo_id) as num_orders,
    SUM(f.quantity) as total_items,
    SUM(f.total_amount) as total_spent,
    AVG(f.total_amount) as avg_order_value
FROM fact_sales f
JOIN dim_customer c ON f.customer_id = c.customer_id
WHERE f.is_paid = TRUE
GROUP BY c.customer_id, c.customer_name
ORDER BY total_spent DESC
LIMIT 20;
*/

-- Query 5: Category Performance by Quarter
/*
SELECT 
    t.year,
    t.quarter,
    p.category,
    SUM(f.total_amount) as revenue,
    SUM(f.quantity) as units_sold
FROM fact_sales f
JOIN dim_time t ON f.time_id = t.time_id
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.is_paid = TRUE
GROUP BY t.year, t.quarter, p.category
ORDER BY t.year, t.quarter, revenue DESC;
*/

-- Query 6: Payment Method Distribution
/*
SELECT 
    f.payment_method,
    COUNT(*) as num_transactions,
    SUM(f.total_amount) as total_revenue,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) as percentage
FROM fact_sales f
WHERE f.is_paid = TRUE
GROUP BY f.payment_method
ORDER BY total_revenue DESC;
*/


-- ============================================
-- DAX MEASURES FOR POWER BI
-- ============================================
/*
-- Paste these in Power BI:

-- Total Revenue
Total Revenue = SUM(fact_sales[total_amount])

-- Total Orders
Total Orders = DISTINCTCOUNT(fact_sales[order_mongo_id])

-- Total Units Sold
Total Units Sold = SUM(fact_sales[quantity])

-- Average Order Value
Avg Order Value = DIVIDE([Total Revenue], [Total Orders], 0)

-- Revenue YTD
Revenue YTD = TOTALYTD([Total Revenue], dim_time[full_date])

-- Revenue vs Previous Month
Revenue PM = CALCULATE([Total Revenue], PREVIOUSMONTH(dim_time[full_date]))

-- Revenue Growth %
Revenue Growth % = 
    DIVIDE(
        [Total Revenue] - [Revenue PM],
        [Revenue PM],
        0
    )

-- Paid Revenue Only
Paid Revenue = CALCULATE([Total Revenue], fact_sales[is_paid] = TRUE)

-- Conversion Rate
Conversion Rate = 
    DIVIDE(
        CALCULATE(COUNTROWS(fact_sales), fact_sales[is_paid] = TRUE),
        COUNTROWS(fact_sales),
        0
    )
*/

-- ============================================
-- END OF SCHEMA
-- ============================================
