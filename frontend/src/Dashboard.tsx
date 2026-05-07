import { useEffect, useState } from "react";
import { dashboardAPI } from "./services/api";
import RevenueChart from "./RevenueChart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    topProducts: [],
    last7Days: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await dashboardAPI.getAllStat();
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Hệ thống báo cáo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Doanh thu hôm nay
          </p>
          <p className="text-3xl font-bold text-gray-800">
            ${stats.todayRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Số đơn hàng hôm nay
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.todayOrders} đơn
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Top 5 sản phẩm bán chạy nhất</h2>
        <div className="space-y-4">
          {stats.topProducts.map((product: any, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-700">
                  {product.name}
                </span>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                {product.quantity} đã bán
              </span>
            </div>
          ))}
        </div>
      </div>
      <br></br>
      <RevenueChart data={stats.last7Days}></RevenueChart>
    </div>
  );
}
