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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
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

  const handleDetail = async (id: number) => {
    try {
      await productAPI.getById(id);
    } catch (error) {
      console.error("Error getting detail:", error);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="flex gap-8">
        <div className="w-1/2">
          <table className="w-full border-2 ">
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
                      onClick={() => handleDetail(product.id)}
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
        <div className="w-1/2 border p-4 rounded bg-gray-50">
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
        </div>
      </div>
    </div>
  );
}
