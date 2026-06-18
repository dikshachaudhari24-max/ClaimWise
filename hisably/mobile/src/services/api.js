const API_BASE = 'https://washbasin-relenting-monologue.ngrok-free.dev';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
};

export const api = {
  sendOtp: (phone) =>
    request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),

  verifyOtp: (phone, otp) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),


  getInvoices: (page = 1, perPage = 20) =>
    request(`/invoice/list?page=${page}&per_page=${perPage}`),

  uploadInvoice: async (fileUri, fileName) => {
    const form = new FormData();
    form.append('file', { uri: fileUri, name: fileName, type: 'application/octet-stream' });
    return request('/invoice/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: form,
    });
  },

  uploadGstr2b: async (fileUri, fileName) => {
    const form = new FormData();
    form.append('file', { uri: fileUri, name: fileName, type: 'text/csv' });
    return request('/gstr2b/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: form,
    });
  },

  getMismatches: () => request('/gstr2b/mismatches'),
  getItcSummary: () => request('/itc/summary'),
  getRiskScore: () => request('/risk/score'),
  getTasks: () => request('/tasks/list'),
  markTaskDone: (taskId, proofType, cashNote) =>
    request('/tasks/done', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, proof_type: proofType, cash_note: cashNote }),
    }),
  getSuppliers: () => request('/supplier/list'),
  sendSupplierMessage: (supplierId, channel, message, invoiceId) =>
    request('/supplier/message', {
      method: 'POST',
      body: JSON.stringify({
        supplier_id: supplierId,
        channel,
        edited_message: message,
        related_invoice_id: invoiceId,
      }),
    }),
  chatQuery: (query) =>
    request('/chatbot/query', { method: 'POST', body: JSON.stringify({ query }) }),
  getAnalytics: (month) => request(`/analytics/monthly${month ? `?month=${month}` : ''}`),
};
