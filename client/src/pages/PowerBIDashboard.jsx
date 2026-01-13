import React, { useState } from 'react';

const PowerBIDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Replace with your actual Power BI embed URL
  // Get this from Power BI Service: File > Embed report > Website or portal
  const POWER_BI_EMBED_URL = "https://app.powerbi.com/view?r=eyJrIjoiNmVkNDc1MGQtYmZlMi00OTMyLTlmZjAtNzdhOTdkZWJmYmI5IiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9&embedImagePlaceholder=true";
  
  // Alternative: Use publish to web URL
  // const POWER_BI_EMBED_URL = "https://app.powerbi.com/view?r=YOUR_REPORT_ID";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                📊 Sales Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Business Intelligence insights powered by Power BI
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Live Data
              </span>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Total Revenue" 
            value="Loading..." 
            icon="💰" 
            color="blue"
          />
          <KPICard 
            title="Total Orders" 
            value="Loading..." 
            icon="📦" 
            color="green"
          />
          <KPICard 
            title="Products Sold" 
            value="Loading..." 
            icon="🛍️" 
            color="purple"
          />
          <KPICard 
            title="Active Customers" 
            value="Loading..." 
            icon="👥" 
            color="orange"
          />
        </div>

        {/* Power BI Embed */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">
              Interactive Sales Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Analyze sales trends, top products, customer behavior, and more
            </p>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-96 bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Dashboard...</p>
              </div>
            </div>
          )}
          
          {/* Power BI iFrame */}
          <iframe
            title="Apple Store Sousse Analytics"
            width="100%"
            height="700"
            src={POWER_BI_EMBED_URL}
            frameBorder="0"
            allowFullScreen={true}
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? 'none' : 'block' }}
            className="w-full"
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Data Sources"
            description="This dashboard analyzes data from orders, products, and customers in real-time."
            icon="🗄️"
          />
          <InfoCard
            title="Update Frequency"
            description="Data is refreshed through our ETL pipeline. Last update: Today"
            icon="🔄"
          />
          <InfoCard
            title="Export Options"
            description="Use Power BI's export feature to download reports as PDF or PowerPoint."
            icon="📤"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Apple Store Sousse - Business Intelligence Dashboard | 
            Data Analytics & BI Mini-Project © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
