import { useEffect, useState } from "react";
import { productAPI } from "./services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  category: string;
  created_at: Date;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
    category: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll(limit, page, searchTerm);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Chac chua?");
    if (!confirmed) return;
    try {
      await productAPI.delete(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await productAPI.getById(id);
      setEditingProduct(res.data);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const closeEditModal = () => setEditingProduct(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await productAPI.update(editingProduct.id, editingProduct);
      alert("Cap nhat thanh cong!");
      closeEditModal();
      fetchProducts();
    } catch (error) {
      console.error("Update that bai", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      await productAPI.create(payload);

      setFormData({
        name: "",
        sku: "",
        price: "",
        stock_quantity: "",
        category: "",
        created_at: "",
      });
      fetchProducts();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check server logs.");
    }
  };

  return (
    <div className="flex gap-8 p-6">
      <div className="w-2/3">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2 text-center">{product.name}</td>
                <td className="p-2 text-center">${product.price}</td>
                <td className="p-2 text-center">{product.stock_quantity}</td>
                <td className="p-2 text-center">{product.category}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded relative z-10 hover:bg-red-800 m-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="bg-emerald-400 text-white px-3 py-1 rounded relative z-10 hover:bg-emerald-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {products.length < 9 &&
              Array.from({ length: 9 - products.length }).map((_, index) => (
                <tr key={`empty - ${index}`} className="h-14.5">
                  <td colSpan={5}></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-6 mb-4">
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

          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã SKU..."
              className="border p-2 rounded w-full outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-1/3 border p-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form className="flex flex-col gap-3" onSubmit={handleAdd}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="sku"
            type="text"
            placeholder="Sku"
            value={formData.sku}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="stock_quantity"
            type="number"
            placeholder="Quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="created_at"
            type="date"
            value={formData.created_at}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            readOnly
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-bold relative z-10 hover:bg-blue-800"
          >
            Save Product
          </button>
        </form>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Giá</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Kho hàng
                    </label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={editingProduct.stock_quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock_quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
