import { useGetRevenueByDaysQuery } from '@/services/order';
import { formartVND } from '@/utils/formartVND';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Revenue = () => {
    const { data: revenueByDay = {} } = useGetRevenueByDaysQuery({} as any)
    const chartData = Object.keys(revenueByDay).map((date) => ({
        name: date,
        revenue: revenueByDay[date],
    }));

    return (
        <div className='pt-4'>
            <a href="/admin/dashboard"><button className='btn bg-teal-500 text-white px-2 hover:bg-orange-400'>Quay lại</button></a>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="pl-6 text-xs font-medium py-3">
                        Thống kê theo ngày
                    </th>
                </tr>
            </thead>
            <div className="flex items-center justify-center rounded  ">
            <BarChart width={600} height={300} data={chartData}> 
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Bar dataKey="revenue"  name='Danh thu theo ngày' fill="#8884d8" barSize={20} />
                    </BarChart>
            </div>
        </div>
    )
}

export default Revenue
