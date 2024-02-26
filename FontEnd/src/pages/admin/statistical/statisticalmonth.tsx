import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetTopSellingProductsMonthQuery } from '@/services/statisticsTop10sanpham';

const BarChartComponent: React.FC<{ data: { name: string; totalQuantity: number }[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: 'Product Name', position: 'insideBottom', offset: -10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalQuantity" fill="#f55142" />
      </BarChart>
    </ResponsiveContainer>
  );
};
const Thang: React.FC = () => {
  const { data: topSellingProductsMonth, isLoading } = useGetTopSellingProductsMonthQuery();
  if (isLoading) return <p>Loading...</p>;

  const chartData = topSellingProductsMonth?.map(product => ({
    name: product.productInfo?.name || "Unknown",
    totalQuantity: product.quantity,
  })) || [];
  return (
    <div>
      <div>
        <h1>Top 10 sản phẩm bán chạy trong tháng</h1>
      </div>
      <BarChartComponent data={chartData} />
    </div>
  );
};
export default Thang;
