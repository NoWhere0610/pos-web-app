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

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  products: { name: string };
}

interface OrderDetail extends Order {
  order_items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const closeModal = () => setSelectedOrder(null);

  const [filterDate, setFilterDate] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [filterDate, page]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll(page, filterDate);
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const handleDetail = async (id: number) => {
    try {
      const res = await orderAPI.getById(id);
      setSelectedOrder(res.data);
    } catch (error) {
      console.error("Error getting detail:", error);
    }
  };

  return (
    <div className="flex gap-8 p-6">
      <div className="w-1/2">
        <div className="mb-6 flex items-center gap-4">
          <label className="font-bold text-gray-700">Lọc theo ngày:</label>
          <input
            type="date"
            className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-sm text-red-500 hover:underline"
            >
              Xóa lọc
            </button>
          )}
        </div>
        <table className="w-full border ">
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
                <td className="p-2 text-center">{order.created_at.split("T")[0]}</td>
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
            {orders.length < 9 &&
              Array.from({ length: 9 - orders.length }).map((_, index) => (
                <tr key={`empty - ${index}`} className="h-12">
                  <td colSpan={5}></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center gap-4 m-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {totalPages === 0 ? 0 : page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-emerald-600">
                Order Detail #{selectedOrder.id}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="text-blue-600 font-bold">
                    ${selectedOrder.total_amount}
                  </span>
                </p>
                <p>
                  <strong>Tiền khách đưa:</strong> ${selectedOrder.paid_amount}
                </p>
                <p>
                  <strong>Tiền thối:</strong> ${selectedOrder.change_amount}
                </p>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2">Sản phẩm</th>
                    <th className="p-2 text-center">Số lượng</th>
                    <th className="p-2 text-right">Đơn giá</th>
                    <th className="p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.order_items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.products?.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">${item.unit_price}</td>
                      <td className="p-2 text-right">${item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
