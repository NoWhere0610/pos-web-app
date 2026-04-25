import axios from 'axios';

const apiURL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id: number) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: number, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`)
};

export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id: number) => apiClient.get(`/orders/${id}`),
  create: (data: any) => apiClient.post('/orders', data),
  update: (id: number, data: any) => apiClient.put(`/orders/${id}`, data),
  delete: (id: number) => apiClient.delete(`/orders/${id}`)
};

export const orderItemAPI = {
  getAll: () => apiClient.get('/order-items'),
  getById: (id: number) => apiClient.get(`/order-items/${id}`),
  create: (data: any) => apiClient.post('/order-items', data),
  update: (id: number, data: any) => apiClient.put(`/order-items/${id}`, data),
  delete: (id: number) => apiClient.delete(`/order-items/${id}`)
};

export default apiClient;