import { useEffect, useState } from "react";
import { orderAPI } from "./services/api";

interface Order {
  id: number;
  total_amount: number;
  tax_amount: number;
  paid_amount: number;
  change_amount: number;
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll();
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const handleDetail = async (id: number) => {
    try {
      await orderAPI.getById(id);
    } catch (error) {
      console.error("Error getting detail:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex gap-8">
        <div className="w-1/2">
          <table className="w-full border-2 ">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-center">Total amount</th>
                <th className="p-2 text-center">Tax amount</th>
                <th className="p-2 text-center">Paid amount</th>
                <th className="p-2 text-center">Created at</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2 text-center">${order.total_amount}</td>
                  <td className="p-2 text-center">${order.tax_amount}</td>
                  <td className="p-2 text-center">${order.paid_amount}</td>
                  <td className="p-2 text-center">{order.created_at}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDetail(order.id)}
                      className="bg-emerald-400 text-white px-3 py-1 rounded relative z-10 hover:bg-emerald-800"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
