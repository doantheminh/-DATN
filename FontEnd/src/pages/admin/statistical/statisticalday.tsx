import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetTopSellingProductsQuery } from '@/services/statisticsTop10sanpham';
import moment from 'moment';

const BarChartComponent: React.FC<{ data: { name: string; totalQuantity: number }[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={700}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ position: 'insideBottom', offset: -30 }} />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalQuantity" fill="#f55142" yAxisId="left" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Ngay = () => {
  const { data: topSellingProducts, isLoading, error } = useGetTopSellingProductsQuery();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    console.error(error);
    return <p>Error: Unable to fetch data</p>;
  }

  const formattedDate = moment(selectedDate).format('MM/DD/YYYY');
  const filteredData = topSellingProducts?.filter(product => {
    const productDate = moment(product.createdAt).format('MM/DD/YYYY');
    return productDate === formattedDate;
  }) || [];

  return (
    <div>
      <div className='flex justify-around'>
        <h1>Top 10 sản phẩm bán chạy ngày {formattedDate}</h1>
        <input
          type="date"
          value={moment(selectedDate).format('YYYY-MM-DD')}
          onChange={(e) => {
            setSelectedDate(new Date(e.target.value));
          }}
        />
      </div>
      {filteredData.length > 0 ? (
        <BarChartComponent data={filteredData.map(product => ({
          name: product.name,
          totalQuantity: product.quantity,
        }))} />
      ) : (
        <p className=' text-center'>không có top 10 sản phẩm bán chạy trong ngày  {formattedDate}.</p>
      )}
    </div>
  );
};
export default Ngay;
