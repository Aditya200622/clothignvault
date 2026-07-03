import { auth } from './firebase/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const apiClient = {
  // Analytics
  getAnalytics: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/analytics`, { headers });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Payment
  createPaymentOrder: async (amount: number, receipt: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/payment/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount, receipt })
    });
    if (!res.ok) throw new Error('Failed to create payment order');
    return res.json();
  },
  
  verifyPayment: async (paymentData: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/payment/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentData)
    });
    if (!res.ok) throw new Error('Payment verification failed');
    return res.json();
  },

  getPayments: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/payments`, { headers });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  // Orders
  updateOrderStatus: async (id: string, status: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },
  updateOrderTracking: async (id: string, trackingNumber: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/orders/${id}/tracking`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ trackingNumber })
    });
    if (!res.ok) throw new Error('Failed to update tracking');
    return res.json();
  },

  // Categories
  addCategory: async (data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/categories`, { method: 'POST', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateCategory: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/categories/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  deleteCategory: async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/categories/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // Coupons
  addCoupon: async (data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/coupons`, { method: 'POST', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateCoupon: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/coupons/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  deleteCoupon: async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/coupons/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // Products
  addProduct: async (data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/products`, { method: 'POST', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateProduct: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  deleteProduct: async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // Settings & Banners
  updateSettings: async (data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/settings/general`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateBanners: async (data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/settings/banners`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // Phase 2 Enterprise Methods
  getReviews: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/reviews`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateReview: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/reviews/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  deleteReview: async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/reviews/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getReturns: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/returns`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateReturnStatus: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/returns/${id}/status`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  
  getRefunds: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/refunds`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateRefundStatus: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/refunds/${id}/status`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getSupportTickets: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/support`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateSupportTicket: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/support/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  replySupportTicket: async (id: string, reply: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/support/${id}/reply`, { method: 'POST', headers, body: JSON.stringify({ reply }) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getShippingZones: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/shipping/zones`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  updateShippingZone: async (id: string, data: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/shipping/zones/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  generateManifest: async (orderIds: string[]) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/shipping/manifest`, { method: 'POST', headers, body: JSON.stringify({ orderIds }) });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getNotifications: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/notifications`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },
  markNotificationRead: async (id: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/notifications/${id}/read`, { method: 'PUT', headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  exportReport: async (type: string, startDate?: string, endDate?: string) => {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_URL}/admin/reports/export`);
    url.searchParams.append('type', type);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getAuditLogs: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/admin/audit-logs`, { headers });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  }
};
