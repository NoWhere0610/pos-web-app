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
    try {
      await productAPI.delete(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
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
              <td className="p-2">{product.name}</td>
              <td className="p-2">${product.price}</td>
              <td className="p-2">{product.stock_quantity}</td>
              <td className="p-2">{product.category}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(product.id)}
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
