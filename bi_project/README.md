# 📊 Apple Store Sousse - Business Intelligence Project

## Data Analytics & Business Intelligence Mini-Project

This project implements a complete BI solution for the Apple Store Sousse e-commerce application, including ETL processes, Data Warehouse design, and Power BI integration.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Star Schema Design](#star-schema-design)
4. [ETL Process](#etl-process)
5. [Installation & Setup](#installation--setup)
6. [Power BI Integration](#power-bi-integration)
7. [KPIs & Business Questions](#kpis--business-questions)
8. [MERN Integration](#mern-integration)

---

## 🎯 Project Overview

### Objectives
- Implement a complete BI process from existing MERN application data
- Design and implement an ETL pipeline using Python
- Build a Data Warehouse with a star schema model
- Create interactive dashboards in Power BI
- Integrate dashboards into the MERN application

### Tech Stack
| Component | Technology |
|-----------|------------|
| Source Database | MongoDB |
| ETL Tool | Python (pandas, pymongo, sqlalchemy) |
| Data Warehouse | SQLite / PostgreSQL / MySQL |
| Visualization | Power BI |
| Integration | React (MERN) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BI ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SOURCE    │     │     ETL     │     │    DATA     │     │   POWER     │
│  MongoDB    │────▶│   Python    │────▶│  WAREHOUSE  │────▶│    BI       │
│             │     │   Pipeline  │     │ Star Schema │     │  Dashboard  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
      │                   │                   │                    │
      │              ┌────┴────┐              │                    │
      │              │         │              │                    ▼
      │           Extract   Transform         │            ┌─────────────┐
      │           Transform  Load             │            │    MERN     │
      │                                       │            │ Integration │
      │                                       │            │   (embed)   │
      └───────────────────────────────────────┘            └─────────────┘
          Collections:                         Tables:
          • users                              • dim_customer
          • products                           • dim_product
          • orders                             • dim_time
                                              • dim_location
                                              • fact_sales
```

---

## ⭐ Star Schema Design

### Schema Diagram

```
                         ┌─────────────────────┐
                         │     DIM_TIME        │
                         │─────────────────────│
                         │ time_id (PK)        │
                         │ full_date           │
                         │ day, month, year    │
                         │ quarter             │
                         │ day_name            │
                         │ is_weekend          │
                         └──────────┬──────────┘
                                    │
┌─────────────────────┐             │             ┌─────────────────────┐
│   DIM_CUSTOMER      │             │             │    DIM_PRODUCT      │
│─────────────────────│             │             │─────────────────────│
│ customer_id (PK)    │             │             │ product_id (PK)     │
│ customer_name       │             │             │ product_name        │
│ email               │             │             │ brand               │
│ registration_date   │             │             │ category            │
│ is_active           │             │             │ current_price       │
└──────────┬──────────┘             │             │ stock_quantity      │
           │                        │             └──────────┬──────────┘
           │              ┌─────────┴─────────┐              │
           │              │                   │              │
           │              │    FACT_SALES     │              │
           └──────────────┤                   ├──────────────┘
                          │───────────────────│
                          │ sale_id (PK)      │
                          │ time_id (FK)      │
                          │ product_id (FK)   │
                          │ customer_id (FK)  │
                          │ location_id (FK)  │
                          │ quantity          │
                          │ unit_price        │
                          │ total_amount      │
                          │ tax_amount        │
                          │ payment_method    │
                          │ order_status      │
                          │ is_paid           │
                          └─────────┬─────────┘
                                    │
                         ┌──────────┴──────────┐
                         │    DIM_LOCATION     │
                         │─────────────────────│
                         │ location_id (PK)    │
                         │ city                │
                         │ governorate         │
                         │ postal_code         │
                         │ country             │
                         └─────────────────────┘
```

### Dimension Tables

| Table | Description | Key Attributes |
|-------|-------------|----------------|
| **dim_customer** | Customer information | customer_id, name, email, registration_date |
| **dim_product** | Product catalog | product_id, name, brand, category, price |
| **dim_time** | Calendar/time attributes | time_id, date, month, quarter, year, day_name |
| **dim_location** | Geographic information | location_id, city, governorate, country |

### Fact Table

| Table | Grain | Measures |
|-------|-------|----------|
| **fact_sales** | One row per order item | quantity, unit_price, total_amount, tax_amount |

---

## 🔄 ETL Process

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ETL PIPELINE FLOW                             │
└─────────────────────────────────────────────────────────────────┘

EXTRACTION                 TRANSFORMATION              LOADING
───────────                ───────────────             ───────
                          
MongoDB.users    ──────▶  Clean names         ──────▶  dim_customer
                          Normalize emails
                          Filter non-admins
                          
MongoDB.products ──────▶  Standardize categories ──▶  dim_product
                          Clean descriptions
                          
MongoDB.orders   ──────▶  Extract dates        ──────▶  dim_time
                          Parse addresses       ──────▶  dim_location
                          Calculate totals      ──────▶  fact_sales
                          Map foreign keys
```

### Transformations Applied

| Source | Transformation | Target |
|--------|---------------|--------|
| users | Filter admins, clean names, normalize emails | dim_customer |
| products | Standardize categories, truncate descriptions | dim_product |
| orders.createdAt | Extract date components | dim_time |
| orders.shippingAddress | Parse city, governorate | dim_location |
| orders.orderItems | Calculate totals, map FKs | fact_sales |

### Running the ETL

```bash
# 1. Install dependencies
cd bi_project
pip install -r requirements.txt

# 2. Set environment variables
export MONGO_URI="mongodb://localhost:27017/applestoresousse"
export DW_URI="sqlite:///apple_store_datawarehouse.db"

# 3. Run ETL pipeline
python etl_pipeline.py
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB with seeded data
- Power BI Desktop

### Step 1: Seed the Database

```bash
cd server
npm run seed:bi   # Run the BI seeder
```

Or add this script to `package.json`:
```json
{
  "scripts": {
    "seed:bi": "node seederBI.js"
  }
}
```

### Step 2: Run ETL Pipeline

```bash
cd bi_project
pip install -r requirements.txt
python etl_pipeline.py
```

### Step 3: Connect Power BI

1. Open Power BI Desktop
2. Get Data → SQLite / CSV / PostgreSQL
3. Load all dimension and fact tables
4. Create relationships (if not auto-detected)

---

## 📈 Power BI Integration

### Data Model Setup

1. **Import Tables**: Load all 5 tables from Data Warehouse
2. **Create Relationships**:
   - fact_sales[time_id] → dim_time[time_id]
   - fact_sales[product_id] → dim_product[product_id]
   - fact_sales[customer_id] → dim_customer[customer_id]
   - fact_sales[location_id] → dim_location[location_id]

### DAX Measures

```dax
// Total Revenue
Total Revenue = SUM(fact_sales[total_amount])

// Total Orders
Total Orders = DISTINCTCOUNT(fact_sales[order_mongo_id])

// Total Units Sold
Total Units Sold = SUM(fact_sales[quantity])

// Average Order Value
Avg Order Value = DIVIDE([Total Revenue], [Total Orders], 0)

// Revenue YTD
Revenue YTD = TOTALYTD([Total Revenue], dim_time[full_date])

// Month-over-Month Growth
Revenue MoM Growth = 
VAR CurrentMonth = [Total Revenue]
VAR PreviousMonth = CALCULATE([Total Revenue], PREVIOUSMONTH(dim_time[full_date]))
RETURN DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth, 0)

// Paid Orders Rate
Paid Orders Rate = 
DIVIDE(
    CALCULATE(COUNTROWS(fact_sales), fact_sales[is_paid] = TRUE),
    COUNTROWS(fact_sales),
    0
)
```

### Suggested Visualizations

| KPI | Visual Type | Fields |
|-----|-------------|--------|
| Revenue Trend | Line Chart | dim_time[month_name], [Total Revenue] |
| Sales by Category | Donut Chart | dim_product[category], [Total Revenue] |
| Top Products | Bar Chart | dim_product[product_name], [Total Units Sold] |
| Sales by Region | Map | dim_location[governorate], [Total Revenue] |
| Order Status | Pie Chart | fact_sales[order_status], Count |
| Payment Methods | Column Chart | fact_sales[payment_method], [Total Revenue] |

---

## 🎯 KPIs & Business Questions

### Key Performance Indicators

1. **Total Revenue** - Sum of all paid order amounts
2. **Average Order Value (AOV)** - Revenue / Number of Orders
3. **Conversion Rate** - Paid Orders / Total Orders
4. **Units Sold** - Total quantity of products sold
5. **Customer Acquisition** - New customers over time

### Business Questions Answered

| Question | Visualization |
|----------|---------------|
| What is our monthly revenue trend? | Line Chart |
| Which product category generates most revenue? | Bar/Pie Chart |
| Who are our top customers? | Table |
| Which cities have highest sales? | Map/Bar Chart |
| What payment methods are preferred? | Pie Chart |
| How does weekend vs weekday sales compare? | Column Chart |
| What is our order fulfillment rate? | KPI Card |
| Which products have highest profit margin? | Scatter Plot |

---

## 🔗 MERN Integration

### Option 1: Power BI Embedded (Recommended)

```jsx
// PowerBIDashboard.jsx
import React from 'react';

const PowerBIDashboard = () => {
  const embedUrl = "YOUR_POWER_BI_EMBED_URL";
  
  return (
    <div className="dashboard-container">
      <h2>Sales Analytics Dashboard</h2>
      <iframe
        title="Apple Store Analytics"
        width="100%"
        height="600"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen={true}
      />
    </div>
  );
};

export default PowerBIDashboard;
```

### Option 2: Publish to Web

1. Publish dashboard to Power BI Service
2. Generate "Publish to web" embed code
3. Add iframe to React component

### Adding Route in React

```jsx
// App.jsx
import PowerBIDashboard from './pages/PowerBIDashboard';

// Add to routes
<Route path="/analytics" element={<PowerBIDashboard />} />
```

---

## 📁 Project Structure

```
applestoresousse/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js          # NEW: Order model
│   ├── seeder.js
│   └── seederBI.js           # NEW: BI data seeder
│
├── bi_project/               # NEW: BI Project folder
│   ├── etl_pipeline.py       # Python ETL script
│   ├── datawarehouse_schema.sql
│   ├── requirements.txt
│   ├── dw_export/            # Generated CSV files
│   │   ├── dim_customer.csv
│   │   ├── dim_product.csv
│   │   ├── dim_time.csv
│   │   ├── dim_location.csv
│   │   └── fact_sales.csv
│   └── README.md
│
└── client/
    └── src/
        └── pages/
            └── PowerBIDashboard.jsx  # Dashboard integration
```

---

## 👨‍💻 Author

**Mohamed Hosni**
- GitHub: [@mohamedhosni23](https://github.com/mohamedhosni23)
- Project: Apple Store Sousse

---

## 📝 License

This project is for educational purposes - Data Analytics & Business Intelligence course.

---

**Made with ❤️ for Polytechnique Sousse**
