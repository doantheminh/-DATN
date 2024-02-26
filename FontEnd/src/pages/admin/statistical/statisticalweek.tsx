import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useGetTopSellingProductsWeekQuery } from '@/services/statisticsTop10sanpham';

const PieChartComponent: React.FC<{ data: { name: string; totalQuantity: number }[] }> = ({ data }) => {
  const rainbowColors = ['#FF0000','#FF7F00', '#1ddbd5','#db1d7c', '#1ddb92', '#FFFF00','#4B0082','#00FF00','#1d79db', '#0000FF'];
  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalQuantity"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={rainbowColors[index % rainbowColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="right" verticalAlign="middle" layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Tuan = () => {
  const { data: topSellingProductsWeek, isLoading } = useGetTopSellingProductsWeekQuery();

  console.log('topSellingProductsWeek', topSellingProductsWeek);

  if (isLoading) return <p>Loading...</p>;

  if (topSellingProductsWeek && topSellingProductsWeek.length > 0) {
    const chartData = topSellingProductsWeek.map(product => ({
      name: product.productInfo?.name || "Unknown", 
      totalQuantity: product.quantity,
    }));

    return (
      <div>
        <h1>Top 10 sản phẩm bán chạy trong tuần</h1>
        <PieChartComponent data={chartData} />
      </div>
    );
  } else {
    return <p className=' text-center'>Top 10 sản phẩm bán chạy không có </p>;
  }
};

export default Tuan;
