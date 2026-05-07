import { useEffect, useState } from "react";
import { productAPI } from "./services/api";
import { orderAPI } from "./services/api";
import { orderItemAPI } from "./services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  category: string;
  created_at: Date;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Sale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [idInput, setIdInput] = useState<number>();

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll(limit, page);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const hanleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === idInput);
    if (product) {
      addToCart(product);
    } else {
      alert("Khong tim thay ma san pham");
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const [cashReceived, setCashReceived] = useState<number>(0);
  const changeAmount = cashReceived > total ? cashReceived - total : 0;

  const handlePayment = async () => {
    if (cashReceived < total) {
      alert("Tiền khách đưa không đủ!");
      return;
    }

    try {
      const orderData = {
        total_amount: total,
        tax_amount: tax,
        paid_amount: cashReceived,
        change_amount: changeAmount,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const response = await orderAPI.create(orderData);

      if (response.status === 201 || response.status === 200) {
        alert("Thanh toán thành công!");
        setCart([]);
        setCashReceived(0);
        fetchProducts();
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Giao dịch thất bại!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/3 bg-white shadow-xl flex flex-col border-r min-w-75">
        <div className="px-3 py-2 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Current Order
          </h2>
          <form onSubmit={hanleIdSubmit} className="flex gap-2">
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(parseInt(e.target.value))}
              placeholder="Nhập mã Id..."
              className="flex-1 border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold"
            >
              Add
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2 max-h-95 min-h-25">
          {cart.length === 0 && (
            <p className="text-center text-gray-400 mt-10">Giỏ hàng trống</p>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-700 leading-tight">
                  {item.name}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-xl font-bold text-gray-500 px-2"
                  >
                    -
                  </button>
                  <span className="font-bold min-w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-xl font-bold text-emerald-500 px-2"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t bg-gray-50 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax VAT (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-black border-t pt-2 text-gray-900">
            <span>Total:</span>
            <span className="text-emerald-600">${total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <label className="font-bold text-xl text-emerald-700 mb-1 whitespace-nowrap w-1/4">
              Cash received:
            </label>
            <input
              type="number"
              className="w-32 text-xl font-bold p-2 rounded border focus:ring-2 focus:ring-emerald-500 outline-none"
              value={cashReceived || ""}
              onChange={(e) => setCashReceived(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-between mt-3 text-emerald-800 font-bold">
            <span className="w-22">Tiền thừa:</span>
            {cashReceived > 0 && <span>${changeAmount.toFixed(2)}</span>}
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 transition-all active:scale-95"
          >
            Checkout
          </button>
        </div>
      </aside>

      <main className="flex-1 px-5 py-1 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 m-2">Menu</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="justify-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 border-2 border-transparent transition-all flex flex-col items-center text-center group min-h-25"
            >
              <p className="font-semibold text-gray-700">{product.name}</p>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center mt-6 mb-4">
          <div className="flex items-center gap-4">
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
      </main>
    </div>
  );
}
