# 🍎 Apple Store Sousse - Business Intelligence Project

<div align="center">

![Apple Store Sousse](https://img.shields.io/badge/Apple%20Store-Sousse-black?style=for-the-badge&logo=apple&logoColor=white)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-yellow?style=for-the-badge&logo=powerbi&logoColor=black)
![Python](https://img.shields.io/badge/Python-ETL-blue?style=for-the-badge&logo=python&logoColor=white)

**A Complete Business Intelligence Solution for E-commerce Analytics**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [Dashboard](#-power-bi-dashboard) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [ETL Pipeline](#-etl-pipeline)
- [Data Warehouse](#-data-warehouse-star-schema)
- [Power BI Dashboard](#-power-bi-dashboard)
- [Key Metrics](#-key-metrics)
- [Documentation](#-documentation)
- [Author](#-author)

---

## 🎯 Overview

This project implements a **complete Business Intelligence solution** for the Apple Store Sousse e-commerce platform. It transforms raw transactional data from MongoDB into actionable business insights through:

- **ETL Pipeline** (Python) - Extract, Transform, Load process
- **Star Schema Data Warehouse** (SQLite) - Optimized for analytical queries
- **Interactive Dashboard** (Power BI) - Real-time visualizations
- **MERN Integration** - Embedded analytics in React application

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Automated ETL** | Python pipeline processing 1,212 records in 1.77 seconds |
| ⭐ **Star Schema** | 4 dimension tables + 1 fact table |
| 📊 **Interactive Dashboard** | 7 KPIs, 6 visualizations, 3 slicers |
| 🌐 **Web Integration** | Power BI embedded in React app |
| 🗺️ **Geographic Analysis** | Sales across 15 Tunisian governorates |
| 📈 **Trend Analysis** | 12-month revenue trends |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     │
│   │ MongoDB  │────▶│  Python  │────▶│  SQLite  │────▶│ Power BI │     │
│   │  Atlas   │     │   ETL    │     │    DW    │     │Dashboard │     │
│   └──────────┘     └──────────┘     └──────────┘     └────┬─────┘     │
│       │                                                    │           │
│       │            Source Data                             │           │
│       │            • Users (35)                            ▼           │
│       │            • Products (29)              ┌──────────────────┐   │
│       │            • Orders (500)               │   React App      │   │
│       │                                         │   /analytics     │   │
│       └─────────────────────────────────────────┴──────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend & Database
| Technology | Purpose |
|------------|---------|
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Source Database (Atlas) |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Backend Runtime |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | REST API Framework |

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Frontend Framework |
| ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Styling |

### Business Intelligence
| Technology | Purpose |
|------------|---------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | ETL Pipeline |
| ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white) | Data Manipulation |
| ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white) | Data Warehouse |
| ![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?style=flat&logo=powerbi&logoColor=black) | Visualization |

---

## 📁 Project Structure

```
applestoresousse/
├── 📂 client/                      # React Frontend
│   └── src/
│       └── pages/
│           └── PowerBIDashboard.jsx    # BI Dashboard Component
│
├── 📂 server/                      # Node.js Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js                    # Order Model (BI)
│   ├── seeder.js
│   └── seederBI.js                     # BI Data Seeder
│
├── 📂 bi_project/                  # Business Intelligence
│   ├── etl_pipeline.py                 # Python ETL Script
│   ├── datawarehouse_schema.sql        # SQL Schema
│   ├── requirements.txt                # Python Dependencies
│   ├── README.md                       # BI Documentation
│   ├── apple_store_datawarehouse.db    # SQLite Database
│   └── dw_export/                      # CSV Exports
│       ├── dim_customer.csv
│       ├── dim_product.csv
│       ├── dim_time.csv
│       ├── dim_location.csv
│       └── fact_sales.csv
│
├── 📂 docs/                        # Documentation
│   ├── AppleStoreSousse_BI_Presentation.pptx
│   └── AppleStoreSousse_BI_Report.docx
│
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account
- Power BI Desktop
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/mohamedhosni23/apple-store-bi-project.git
cd apple-store-bi-project
```

### Step 2: Install Dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install

# Python dependencies
cd ../bi_project
pip install -r requirements.txt
```

### Step 3: Environment Setup

Create `.env` files:

**Server (.env):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**BI Project (bi_project/.env):**
```env
MONGO_URI=your_mongodb_connection_string
DW_URI=sqlite:///apple_store_datawarehouse.db
```

### Step 4: Seed the Database

```bash
cd server
npm run seed:bi
```

### Step 5: Run ETL Pipeline

```bash
cd bi_project
python etl_pipeline.py
```

---

## 📖 Usage

### Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Analytics Dashboard | http://localhost:5173/analytics |

---

## 🔄 ETL Pipeline

### Process Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   EXTRACT   │────▶│  TRANSFORM  │────▶│    LOAD     │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      ▼                   ▼                   ▼
  MongoDB            Pandas DF           SQLite DW
  • Users            • Clean data        • dim_customer
  • Products         • Normalize         • dim_product
  • Orders           • Create dims       • dim_time
                     • Build facts       • dim_location
                                         • fact_sales
```

### Run ETL

```bash
cd bi_project
python etl_pipeline.py
```

### Expected Output

```
============================================================
🚀 APPLE STORE SOUSSE - ETL PIPELINE
============================================================

📥 EXTRACTION PHASE
   ✓ Extracted 35 users
   ✓ Extracted 29 products
   ✓ Extracted 500 orders

🔄 TRANSFORMATION PHASE
   ✓ Created 33 customer records
   ✓ Created 29 product records
   ✓ Created 272 time records
   ✓ Created 15 location records
   ✓ Created 1,212 sales fact records

📤 LOADING PHASE
   ✓ All data loaded successfully!

✅ ETL Pipeline completed in 1.77 seconds
============================================================
```

---

## ⭐ Data Warehouse (Star Schema)

```
                         ┌─────────────┐
                         │  dim_time   │
                         │  (272 rows) │
                         └──────┬──────┘
                                │
                                │
┌─────────────┐         ┌──────┴──────┐         ┌─────────────┐
│dim_customer │─────────│ fact_sales  │─────────│ dim_product │
│  (33 rows)  │         │(1,212 rows) │         │  (29 rows)  │
└─────────────┘         └──────┬──────┘         └─────────────┘
                                │
                                │
                         ┌──────┴──────┐
                         │dim_location │
                         │  (15 rows)  │
                         └─────────────┘
```

### Dimension Tables

| Table | Records | Key Fields |
|-------|---------|------------|
| `dim_customer` | 33 | customer_id, name, email, registration_date |
| `dim_product` | 29 | product_id, name, category, price |
| `dim_time` | 272 | time_id, date, month, quarter, year |
| `dim_location` | 15 | location_id, city, governorate |

### Fact Table

| Table | Records | Measures |
|-------|---------|----------|
| `fact_sales` | 1,212 | quantity, unit_price, total_amount, tax, shipping |

---

## 📊 Power BI Dashboard

### KPIs (DAX Measures)

```dax
Total Revenue = SUM(fact_sales[total_amount])
Total Orders = DISTINCTCOUNT(fact_sales[order_mongo_id])
Total Units Sold = SUM(fact_sales[quantity])
Avg Order Value = DIVIDE([Total Revenue], [Total Orders], 0)
Total Customers = DISTINCTCOUNT(fact_sales[customer_id])
Paid Revenue = CALCULATE([Total Revenue], fact_sales[is_paid] = TRUE)
Conversion Rate = DIVIDE(CALCULATE(...), COUNTROWS(...), 0)
```

### Visualizations

| Visual | Type | Purpose |
|--------|------|---------|
| KPI Cards | Card | Key metrics at a glance |
| Revenue Trend | Line Chart | Monthly revenue analysis |
| Category Sales | Donut Chart | Sales distribution by category |
| Top Products | Bar Chart | Best selling products |
| Regional Sales | Bar Chart | Sales by governorate |
| Payment Methods | Pie Chart | Payment distribution |
| Filters | Slicers | Year, Category, Status |

### Dashboard Preview

The interactive dashboard is published to Power BI Service and embedded in the React application at `/analytics`.

---

## 📈 Key Metrics

| Metric | Value |
|--------|-------|
| 💰 **Total Revenue** | 834,000+ TND |
| 📦 **Total Orders** | 500 |
| 🛍️ **Units Sold** | 1,212 |
| 💵 **Avg Order Value** | 6,230 TND |
| 👥 **Customers** | 33 |
| 🗺️ **Regions** | 15 governorates |
| 📅 **Data Period** | Jan 2024 - Jan 2025 |

### Revenue by Category

| Category | Revenue | Share |
|----------|---------|-------|
| Desktops | 966,009 TND | 40.8% |
| Laptops | 571,299 TND | 24.1% |
| Smartphones | 330,043 TND | 13.9% |
| Tablets | 252,836 TND | 10.7% |
| Wearables | 144,713 TND | 6.1% |
| Audio | 105,100 TND | 4.4% |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📊 [Presentation](docs/AppleStoreSousse_BI_Presentation.pptx) | 10-slide project presentation |
| 📄 [Technical Report](docs/AppleStoreSousse_BI_Report.docx) | Comprehensive 20+ page report |
| 📖 [BI README](bi_project/README.md) | ETL & DW documentation |

---

## 🛣️ Roadmap

- [x] Order Model Creation
- [x] BI Data Seeder (500 orders)
- [x] Python ETL Pipeline
- [x] Star Schema Data Warehouse
- [x] Power BI Dashboard
- [x] MERN Integration
- [ ] Automated ETL Scheduling
- [ ] Real-time Data Streaming
- [ ] Predictive Analytics
- [ ] Customer Segmentation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<div align="center">

**Mohamed Hosni**

[![GitHub](https://img.shields.io/badge/GitHub-mohamedhosni23-181717?style=for-the-badge&logo=github)](https://github.com/mohamedhosni23)

**Polytechnique Sousse • 2025**

*Data Analytics & Business Intelligence Project*

</div>

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

</div>
