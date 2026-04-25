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

  const handleDelete = async (id: number) => {
    try {
      await orderAPI.delete(id);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Total amount</th>
            <th className="p-2">Tax amount</th>
            <th className="p-2">Paid amount</th>
            <th className="p-2">Created at</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2">${order.total_amount}</td>
              <td className="p-2">${order.tax_amount}</td>
              <td className="p-2">${order.paid_amount}</td>
              <td className="p-2">{order.created_at}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
